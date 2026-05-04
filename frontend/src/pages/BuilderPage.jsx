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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-primary-accent)' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex" style={{ height: 'calc(100vh - var(--header-height))' }}>
        {/* Left Panel - AI Chat */}
        <div className="w-96 flex flex-col" style={{ backgroundColor: 'var(--color-card-bg)', borderRight: '1px solid var(--color-border)' }}>
          <div className="p-6 border-b border-border" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary-accent), var(--color-secondary-accent))' }}>
                <span className="text-white">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>AI Assistant</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Describe what you want to build</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <span className="text-2xl">💬</span>
                </div>
                <p style={{ color: 'var(--color-text-tertiary)' }}>
                  Start a conversation to build your app
                </p>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => setCurrentPrompt('Create a landing page with hero section')}
                    className="w-full text-left p-3 rounded-lg text-sm transition-all-200"
                    style={{ 
                      backgroundColor: 'var(--color-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    🎨 Create a landing page with hero section
                  </button>
                  <button 
                    onClick={() => setCurrentPrompt('Build a dashboard with charts')}
                    className="w-full text-left p-3 rounded-lg text-sm transition-all-200"
                    style={{ 
                      backgroundColor: 'var(--color-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    📊 Build a dashboard with charts
                  </button>
                  <button 
                    onClick={() => setCurrentPrompt('Design an e-commerce product page')}
                    className="w-full text-left p-3 rounded-lg text-sm transition-all-200"
                    style={{ 
                      backgroundColor: 'var(--color-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)'
                    }}
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
                          ? 'text-white' 
                          : 'text-text-primary'
                      }`}
                      style={{
                        background: message.role === 'user' 
                          ? 'linear-gradient(135deg, var(--color-primary-accent), var(--color-secondary-accent))'
                          : 'var(--color-surface)',
                        border: message.role === 'user' ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      <p className="text-sm leading-relaxed m-0">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-accent)' }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-accent)', animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-accent)', animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex gap-3">
              <button className="p-3 transition-all-200" style={{ color: 'var(--color-text-tertiary)' }}>
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
                className="flex-1 p-3 input text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !currentPrompt.trim()}
                className="p-3 rounded-lg hover-scale cursor-pointer transition-all-200"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary-accent), var(--color-secondary-accent))',
                  color: 'white'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-card-bg)', borderRight: '1px solid var(--color-border)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#f97316' }}>
                <span className="text-white text-sm font-bold">{'</>'}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Code Editor</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>HTML • CSS • JavaScript</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={saveProject}
                className="btn-primary text-sm px-4 py-2"
              >
                Save
              </button>
              <button className="p-2 transition-all-200" style={{ color: 'var(--color-text-tertiary)' }}>
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
        <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-card-bg)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                <span className="text-white text-sm">👁</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Live Preview</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Real-time updates</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 transition-all-200" style={{ color: 'var(--color-text-tertiary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button className="p-2 transition-all-200" style={{ color: 'var(--color-text-tertiary)' }}>
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
