import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, RefreshCw, Moon, Link, Bookmark, Share2, Copy } from 'lucide-react'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('preview')
  const [projectName, setProjectName] = useState('Untitled Project')
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)
  const [iframeLoading, setIframeLoading] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    // Get prompt from location state or dashboard enhancement
    const locationPrompt = location.state?.prompt
    const dashboardPrompt = location.state?.enhancedPrompt
    const finalPrompt = dashboardPrompt || locationPrompt
    
    if (finalPrompt) {
      setPrompt(finalPrompt)
      setProjectName(finalPrompt.slice(0, 30) + '...')
      // Auto-generate when prompt is received
      generateCode(finalPrompt)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateCode = async (promptToUse, conversationHistory = []) => {
    if (!promptToUse || !promptToUse.trim()) return

    setLoading(true)
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      if (!apiKey) {
        throw new Error('Groq API key is missing. Please configure VITE_GROQ_API_KEY.')
      }

      // Build conversation history for context
      const messagesForAPI = [
        {
          role: 'system',
          content: `You are an expert web developer. Generate a stunning, modern, professional single-file HTML website based on this request: "${promptToUse}".

CRITICAL RULES - YOU MUST FOLLOW THESE:
- NEVER use href="/" anywhere in the code
- NEVER use href="/about" or any path-based links
- ALL navigation links must ONLY use href="#section-id" for smooth scrolling
- Every nav link must point to a section id on the same page like href="#about" href="#services" href="#contact"
- Every section must have a matching id like <section id="about"> <section id="services">
- Do NOT use any external URLs except for Google Fonts and Font Awesome CDN imports

DESIGN REQUIREMENTS:
- Use Google Fonts (import with link tag)
- Use Font Awesome icons from cdnjs
- Modern CSS with gradients, animations, smooth transitions
- Mobile responsive with media queries
- Hero section with stunning gradient background
- Clean navbar with smooth scroll links
- Professional color scheme
- Hover effects on buttons and cards
- CSS keyframe animations
- CSS Grid and Flexbox layouts
- Beautiful footer

Return ONLY raw HTML starting with <!DOCTYPE html>. No explanation, no markdown, no backticks.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: promptToUse
        }
      ]

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` 
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messagesForAPI,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Groq API key. Please check your API key configuration.')
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.')
        } else {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`)
        }
      }

      const data = await response.json()
      const html = data.choices[0].message.content
      
      setGeneratedCode(html)
      setGeneratedHTML(html)
      setPreviewKey(prev => prev + 1)
      setIframeLoading(true)

      // Add AI response to chat
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `I've generated the website based on your request: "${promptToUse}". The preview is now showing on the right.`
      }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Error generating code:', error)
      alert(error.message || 'Failed to generate code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!chatInput.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput
    }

    setMessages(prev => [...prev, userMessage])
    
    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: 'typing...',
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    // Generate code with conversation history
    generateCode(chatInput, [...messages, userMessage])
    setChatInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const refreshPreview = () => {
    if (iframeRef.current && generatedCode) {
      iframeRef.current.srcdoc = generatedCode
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    // Could add toast notification here
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Navbar */}
      <div style={{
        height: '48px',
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        flexShrink: 0
      }}>
        {/* Left: Go Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Center: Project Name */}
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {projectName}
        </div>

        {/* Right: Icons and Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Moon size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          <RefreshCw size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          <Link size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          <Bookmark size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          <Share2 size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          
          <button
            onClick={copyPrompt}
            style={{
              backgroundColor: '#3b82f6',
              border: 'none',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Copy size={14} />
            Copy prompt
          </button>
          
          <button
            style={{
              backgroundColor: '#10b981',
              border: '1px solid #10b981',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Open
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Panel - Chat (35%) */}
        <div style={{
          width: '35%',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Initial prompt message */}
            {prompt && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  maxWidth: '80%',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    You
                  </div>
                  <div style={{ color: '#1a1a1a' }}>
                    {prompt}
                  </div>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  backgroundColor: message.role === 'user' ? '#f8fafc' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  maxWidth: '80%',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {message.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div style={{ color: '#1a1a1a' }}>
                    {message.isTyping ? (
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.4s infinite'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.4s infinite 0.2s'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.4s infinite 0.4s'
                        }}></div>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#1a1a1a',
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '44px',
                  maxHeight: '120px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || loading}
                style={{
                  backgroundColor: chatInput.trim() && !loading ? '#3b82f6' : '#f3f4f6',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: chatInput.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} color={chatInput.trim() && !loading ? '#ffffff' : '#9ca3af'} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview (65%) */}
        <div style={{
          width: '65%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Tab Bar */}
          <div style={{
            height: '56px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '4px'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px'
            }}>
              {[
                { id: 'preview', label: 'Preview' },
                { id: 'code', label: 'Code' },
                { id: 'share', label: 'Share' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                    boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}>
            {activeTab === 'preview' && (
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative'
              }}>
                {iframeLoading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #e5e7eb',
                      borderTop: '4px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                )}
                
                {generatedHTML ? (
                  <iframe
  key={previewKey}
  srcDoc={generatedHTML || ''}
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
  onLoad={() => setIframeLoading(false)}
/>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#9ca3af',
                    fontSize: '16px'
                  }}>
                    {loading ? 'Generating preview...' : 'No content to preview'}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                padding: '20px',
                overflow: 'auto'
              }}>
                {generatedCode ? (
                  <pre style={{
                    margin: 0,
                    color: '#374151',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontFamily: 'Monaco, Menlo, monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {generatedCode}
                  </pre>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#9ca3af',
                    fontSize: '16px'
                  }}>
                    No code generated yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'share' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                Share functionality coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  )
}

export default BuilderPage
