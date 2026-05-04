import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Editor from '@monaco-editor/react'
import Header from '../components/Layout/Header'

function BuilderPage() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const editorRef = useRef(null)

  useEffect(() => {
    async function checkUser() {
      try {
        if (!supabase) {
          navigate('/login')
          return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate('/login')
          return
        }
        setUser(user)

        // Load project
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setProject(project)
        setGeneratedCode(project.code || '')
      } catch (error) {
        console.error('Error loading project:', error)
        navigate('/dashboard')
      }
    }

    checkUser()
  }, [navigate, id])

  const sendMessage = async () => {
    if (!currentPrompt.trim() || !supabase) return

    const userMessage = { role: 'user', content: currentPrompt }
    setMessages(prev => [...prev, userMessage])
    setCurrentPrompt('')
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          projectId: id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      
      const aiMessage = { role: 'assistant', content: data.response || 'Code generated successfully' }
      setMessages(prev => [...prev, aiMessage])
      setGeneratedCode(data.code || data.response)

      // Save project to Supabase
      if (project && supabase) {
        await supabase
          .from('projects')
          .update({ 
            code: data.code || data.response,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async () => {
    if (!supabase || !project) return

    try {
      await supabase
        .from('projects')
        .update({ 
          code: generatedCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex" style={{ height: 'calc(100vh - var(--header-height))' }}>
        {/* Left Panel - AI Chat */}
        <div className="w-96 bg-card-bg border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-accent to-secondary-accent flex items-center justify-center">
                <span className="text-white">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">AI Assistant</h3>
                <p className="text-sm text-text-tertiary">Describe what you want to build</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-text-tertiary">
                  Start a conversation to build your app
                </p>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => setCurrentPrompt('Create a landing page with hero section')}
                    className="w-full text-left p-3 bg-surface/50 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface/70 hover:text-text-primary transition-all-200"
                  >
                    🎨 Create a landing page with hero section
                  </button>
                  <button 
                    onClick={() => setCurrentPrompt('Build a dashboard with charts')}
                    className="w-full text-left p-3 bg-surface/50 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface/70 hover:text-text-primary transition-all-200"
                  >
                    📊 Build a dashboard with charts
                  </button>
                  <button 
                    onClick={() => setCurrentPrompt('Design an e-commerce product page')}
                    className="w-full text-left p-3 bg-surface/50 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface/70 hover:text-text-primary transition-all-200"
                  >
                    🛒 Design an e-commerce product page
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-primary-accent to-secondary-accent text-white' 
                          : 'bg-surface/80 border border-border text-text-primary'
                      }`}
                    >
                      <p className="text-sm leading-relaxed m-0">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-surface/80 border border-border p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <button className="p-3 text-text-tertiary hover:text-text-primary transition-all-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Describe your app..."
                disabled={loading}
                className="flex-1 p-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-tertiary text-sm focus:outline-none focus:border-primary-accent focus:shadow-lg focus:shadow-primary-accent/20 transition-all-200"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !currentPrompt.trim()}
                className="p-3 bg-gradient-to-r from-primary-accent to-secondary-accent text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover-scale cursor-pointer transition-all-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 bg-card-bg border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{'</>'}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Code Editor</h3>
                <p className="text-xs text-text-tertiary">HTML • CSS • JavaScript</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={saveProject}
                className="btn-primary text-sm px-4 py-2"
              >
                Save
              </button>
              <button className="text-text-tertiary hover:text-text-primary p-2 transition-all-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={generatedCode}
              onChange={(value) => setGeneratedCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                wrappingIndent: 'indent',
              }}
              onMount={(editor) => {
                editorRef.current = editor
              }}
            />
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-card-bg flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm">👁</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Live Preview</h3>
                <p className="text-xs text-text-tertiary">Real-time updates</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-text-tertiary hover:text-text-primary p-2 transition-all-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button className="text-text-tertiary hover:text-text-primary p-2 transition-all-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-white">
            <iframe
              srcDoc={generatedCode ? `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                      }
                    </style>
                  </head>
                  <body>
                    ${generatedCode}
                  </body>
                </html>
              ` : `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #f8f9fa;
                        color: #6c757d;
                        text-align: center;
                        padding: 2rem;
                      }
                      .empty-state {
                        max-width: 400px;
                      }
                      .icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
                      h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #495057; }
                      p { font-size: 1rem; line-height: 1.6; }
                    </style>
                  </head>
                  <body>
                    <div class="empty-state">
                      <div class="icon">🎨</div>
                      <h1>Preview Ready</h1>
                      <p>Start building your app by describing what you want to create in the AI chat.</p>
                    </div>
                  </body>
                </html>
              `}
              className="w-full h-full border-0 rounded-lg"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage
