import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function BuilderPage() {
  const [user, setUser] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const iframeRef = useRef(null)

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

        // Load project if id exists
        if (id) {
          const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

          if (error) throw error
          setProject(project)
          setGeneratedCode(project.code || '')
        }
      } catch (error) {
        console.error('Error loading project:', error)
        navigate('/dashboard')
      }
    }

    checkUser()
  }, [navigate, id])

  const generateCode = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `Generate a complete single file HTML website with inline CSS and JS based on this request: ${prompt}. Return ONLY in HTML code, nothing else.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const data = await response.json()
      const code = data.choices[0].message.content
      
      setGeneratedCode(code)
      
      // Update project if it exists
      if (project) {
        await supabase
          .from('projects')
          .update({ code })
          .eq('id', project.id)
      }

      // Update iframe preview
      if (iframeRef.current) {
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
        iframeDoc.open()
        iframeDoc.write(code)
        iframeDoc.close()
      }
    } catch (error) {
      console.error('Error generating code:', error)
      alert('Failed to generate code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async () => {
    if (!user || !generatedCode) return

    try {
      if (project) {
        // Update existing project
        await supabase
          .from('projects')
          .update({ code: generatedCode })
          .eq('id', project.id)
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: prompt || 'New AI Generated Project',
            description: `Generated with prompt: ${prompt}`,
            code: generatedCode,
            status: 'generated'
          })
          .select()

        if (error) throw error
        
        if (data && data[0]) {
          navigate(`/builder/${data[0].id}`)
        }
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>Generating your code...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Run Away AI
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={saveProject}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save Project
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div style={{
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
              }}
            />
          </div>
          <button
            onClick={generateCode}
            disabled={loading || !prompt.trim()}
            style={{
              backgroundColor: loading || !prompt.trim() ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '140px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Left Side - Code Editor */}
        <div style={{
          flex: 1,
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            padding: '12px 16px',
            borderBottom: '1px solid #334155',
            fontSize: '14px',
            fontWeight: '500',
            color: '#e2e8f0'
          }}>
            Generated Code
          </div>
          <div style={{
            flex: 1,
            padding: '16px',
            overflow: 'auto'
          }}>
            <pre style={{
              margin: 0,
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {generatedCode || '// Your generated code will appear here...'}
            </pre>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Live Preview
          </div>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <iframe
              ref={iframeRef}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'white'
              }}
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default BuilderPage
