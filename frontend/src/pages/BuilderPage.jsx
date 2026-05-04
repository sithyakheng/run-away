import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Editor from '@monaco-editor/react'

function BuilderPage() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-surface p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white m-0">
          Run Away Builder
        </h2>
        <div className="flex gap-3">
          <button
            onClick={saveProject}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-semibold hover:scale-105 transition-transform cursor-pointer border-none"
          >
            Save Project
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-transparent text-text-secondary border border-border rounded-lg text-sm cursor-pointer hover:bg-border hover:text-white transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-72px)]">
        {/* Left Panel - Chat */}
        <div className="w-96 bg-surface border-r border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Assistant
            </h3>
            <p className="text-text-secondary text-sm">
              Describe what you want to build
            </p>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Start a conversation to build your app
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-background border border-border' 
                      : 'bg-purple-900/30 border border-purple-700'
                  }`}
                >
                  <p className="text-white text-sm leading-relaxed m-0">
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Describe your app..."
                disabled={loading}
                className="flex-1 p-3 bg-background border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !currentPrompt.trim()}
                className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 bg-surface border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white m-0">
              Generated Code
            </h3>
            <span className="text-text-secondary text-sm">
              HTML/CSS/JS
            </span>
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
              }}
              onMount={(editor) => {
                editorRef.current = editor
              }}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-surface flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white m-0">
              Live Preview
            </h3>
            <span className="text-text-secondary text-sm">
              Real-time
            </span>
          </div>
          <div className="flex-1 p-4">
            <iframe
              srcDoc={generatedCode ? `
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { 
                        margin: 0; 
                        padding: 20px; 
                        font-family: Arial, sans-serif; 
                        background: white;
                        color: black;
                      }
                    </style>
                  </head>
                  <body>
                    ${generatedCode}
                  </body>
                </html>
              ` : ''}
              className="w-full h-full border border-border rounded-lg bg-white"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage
