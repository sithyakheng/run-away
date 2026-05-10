import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const iframeRef = useRef(null)

  useEffect(() => {
    // Get prompt from location state
    const locationPrompt = location.state?.prompt
    if (locationPrompt) {
      setPrompt(locationPrompt)
      // Auto-generate when prompt is received
      generateCode(locationPrompt)
    }
  }, [location.state])

  const generateCode = async (promptToUse = prompt) => {
    if (!promptToUse.trim()) return

    setLoading(true)
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `Generate a complete single file HTML website with inline CSS and JS based on this request: ${promptToUse}. Return ONLY: raw HTML code, no explanation, no markdown, no backticks.` 
            }
          ],
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const data = await response.json()
      const code = data.choices[0].message.content
      
      setGeneratedCode(code)
      
      // Update iframe preview
      if (iframeRef.current) {
        const iframe = iframeRef.current
        iframe.srcdoc = code
      }
    } catch (error) {
      console.error('Error generating code:', error)
      alert('Failed to generate code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #334155',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#e2e8f0', fontSize: '18px' }}>Building your website...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#f1f5f9'
        }}>
          Run Away AI
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => generateCode()}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#475569' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Regenerate
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #334155',
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

      {/* Prompt Display */}
      {prompt && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            fontSize: '14px',
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif'
          }}>
            <strong style={{ color: '#e2e8f0' }}>Prompt:</strong> {prompt}
          </div>
        </div>
      )}

      {/* Split Screen Layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Left Side - Code Editor */}
        <div style={{
          flex: 1,
          backgroundColor: '#0f172a',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
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
            borderBottom: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '500',
            color: '#475569'
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
