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
      const html = data.choices[0].message.content
      
      setGeneratedCode(html)
      
      // Update iframe preview
      if (iframeRef.current) {
        const iframe = iframeRef.current
        iframe.srcdoc = html
      }
    } catch (error) {
      console.error('Error generating code:', error)
      alert('Failed to generate code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const refreshPreview = () => {
    if (iframeRef.current && generatedCode) {
      const iframe = iframeRef.current
      iframe.srcdoc = generatedCode
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#e2e8f0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #334155',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: '16px 0 8px',
            color: '#f1f5f9'
          }}>
            Building your website...
          </h2>
          <p style={{
            fontSize: '16px',
            margin: '0 0 32px',
            color: '#94a3b8',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            "{prompt}"
          </p>
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
      {/* TOP NAVBAR */}
      <div style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '56px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#3b82f6',
            borderRadius: '4px'
          }} />
          Run Away
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#94a3b8',
          maxWidth: '400px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          textAlign: 'center',
          margin: '0 20px'
        }}>
          {prompt}
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
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }} />
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

      {/* MAIN AREA - Split Screen */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* LEFT SIDE (40%) - Code Editor */}
        <div style={{
          width: '40%',
          backgroundColor: '#0d1117',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '12px 16px',
            borderBottom: '1px solid #334155',
            fontSize: '12px',
            fontWeight: '600',
            color: '#8b92a9',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Code</span>
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              HTML
            </div>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px'
          }}>
            <pre style={{
              margin: 0,
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.5',
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              tabSize: 2
            }}>
              {generatedCode || '// Your generated code will appear here...'}
            </pre>
          </div>
        </div>

        {/* RIGHT SIDE (60%) - Live Preview */}
        <div style={{
          width: '60%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '12px',
            fontWeight: '600',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Preview</span>
            <button
              onClick={refreshPreview}
              style={{
                backgroundColor: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6v6h6v-6h-6zm-6 0l-6 6v6h6v-6z" transform="rotate(180 12 12)"/>
              </svg>
              Refresh
            </button>
          </div>
          <div style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#ffffff'
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
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}

export default BuilderPage
