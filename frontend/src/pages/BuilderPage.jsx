import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, RefreshCw, Undo, Redo, Eye, Code, Share, Upload } from 'lucide-react'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('preview')
  const [projectName, setProjectName] = useState('Untitled Project')
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    // Get prompt from location state
    const locationPrompt = location.state?.prompt
    if (locationPrompt) {
      setPrompt(locationPrompt)
      setProjectName(locationPrompt.slice(0, 30) + '...')
      // Auto-generate when prompt is received
      generateCode(locationPrompt)
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
          content: `You are a web developer assistant. Generate complete single-file HTML websites with inline CSS and JavaScript based on user requests. Always return ONLY the raw HTML code without any explanations, markdown, or backticks.

Additionally, you are an expert in React component integration. When users ask about integrating React components, provide detailed guidance following these instructions:

REACT COMPONENT INTEGRATION GUIDELINES:

You are given a task to integrate an existing React component in the codebase.

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- TypeScript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or TypeScript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder.

COMPONENT INTEGRATION STEPS:
1. Analyze the component structure and identify all required dependencies
2. Review the component's arguments and state
3. Identify any required context providers or hooks and install them
4. Ask relevant questions:
   - What data/props will be passed to this component?
   - Are there any specific state management requirements?
   - Are there any required assets (images, icons, etc.)?
   - What is the expected responsive behavior?
   - What is the best place to use this component in the app?

IMPLEMENTATION STEPS:
0. Copy-paste the component code in the correct directories
1. Install external dependencies (e.g., lucide-react, framer-motion)
2. Fill image assets with Unsplash stock images if needed
3. Use lucide-react icons for svgs or logos if component requires them

For example, to integrate the agent-plan component:
- Copy agent-plan.tsx to /components/ui folder
- Install dependencies: npm install lucide-react framer-motion
- Ensure the project supports TypeScript and Tailwind CSS
- Import and use the component where needed

Always provide clear, step-by-step instructions and explain the reasoning behind each step.`
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
      
      // Update iframe preview
      if (iframeRef.current) {
        iframeRef.current.srcdoc = html
      }

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

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Navbar */}
      <div style={{
        height: '48px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        flexShrink: 0
      }}>
        {/* Left: Project Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff'
          }}>
            {projectName}
          </h1>
        </div>

        {/* Center: Undo/Redo */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #3a3a3a',
              color: '#888',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <Undo size={14} />
            Undo
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #3a3a3a',
              color: '#888',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <Redo size={14} />
            Redo
          </button>
        </div>

        {/* Right: Publish Button */}
        <button
          style={{
            backgroundColor: '#6366f1',
            border: 'none',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Upload size={16} />
          Publish
        </button>
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
          backgroundColor: '#0f0f0f',
          borderRight: '1px solid #2a2a2a',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #2a2a2a',
            backgroundColor: '#1a1a1a'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Conversation
            </h2>
          </div>

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
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#888',
                  fontWeight: '500'
                }}>
                  You
                </div>
                <div style={{
                  backgroundColor: '#2a2a2a',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {prompt}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#888',
                  fontWeight: '500'
                }}>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div style={{
                  backgroundColor: message.role === 'user' ? '#2a2a2a' : '#1a1a1a',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {message.isTyping ? (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s infinite 0.2s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s infinite 0.4s'
                      }}></div>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #2a2a2a',
            backgroundColor: '#1a1a1a'
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
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #3a3a3a',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
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
                  backgroundColor: chatInput.trim() && !loading ? '#6366f1' : '#3a3a3a',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  cursor: chatInput.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} color={chatInput.trim() && !loading ? '#ffffff' : '#888'} />
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
          {/* Toolbar */}
          <div style={{
            height: '56px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px'
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '2px',
              backgroundColor: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px'
            }}>
              {[
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'code', label: 'Code', icon: Code },
                { id: 'share', label: 'Share', icon: Share }
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                    boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshPreview}
              disabled={!generatedCode}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                cursor: generatedCode ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (generatedCode) {
                  e.target.style.backgroundColor = '#f9fafb'
                  e.target.style.borderColor = '#d1d5db'
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.borderColor = '#e5e7eb'
              }}
            >
              <RefreshCw size={16} color={generatedCode ? '#6b7280' : '#d1d5db'} />
            </button>
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
                height: '100%'
              }}>
                {generatedCode ? (
                  <iframe
                    ref={iframeRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                    sandbox="allow-scripts"
                    title="Preview"
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
                backgroundColor: '#1e1e1e',
                padding: '20px',
                overflow: 'auto'
              }}>
                {generatedCode ? (
                  <pre style={{
                    margin: 0,
                    color: '#d4d4d4',
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
                    color: '#6b7280',
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
                color: '#6b7280',
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
        
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background-color: #4a4a4a;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background-color: #5a5a5a;
        }
      `}</style>
    </div>
  )
}

export default BuilderPage
