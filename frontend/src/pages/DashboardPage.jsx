import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paperclip, Settings, Code, Mic, Send } from 'lucide-react'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fullstack')
  const [userPrompt, setUserPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUserData() {
      try {
        const { supabase } = await import('../lib/supabase')
        
        if (!supabase) {
          navigate('/login')
          return
        }

        // Get user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate('/login')
          return
        }
        setUser(user)

        // Get projects
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(projects || [])
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [navigate])

  
  const handleLogout = async () => {
    const { supabase } = await import('../lib/supabase')
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  const handleGenerate = async () => {
  if (!userPrompt.trim()) return
  
  setIsEnhancing(true)
  
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
            content: `You are a professional prompt engineer. Take this simple prompt and enhance it into a detailed professional prompt for building a website. Return ONLY the enhanced prompt, nothing else.

User prompt: "${userPrompt}"`
          }
        ],
        max_tokens: 500
      })
    })
    
    const data = await response.json()
    const enhancedPrompt = data.choices[0].message.content
    setEnhancedPrompt(enhancedPrompt)
    setShowModal(true)
  } catch (error) {
    console.log('Enhancement error:', error)
    navigate('/builder', { state: { prompt: userPrompt } })
  } finally {
    setIsEnhancing(false)
  }
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #7c3aed',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Top Navigation */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #2d3748',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Run Away
          </h1>
          <span style={{
            fontSize: '14px',
            color: '#94a3b8',
            marginLeft: '8px'
          }}>
            {user?.email || 'user@example.com'}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: '#6b7280',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            border: '1px solid #374151',
            transition: 'all 0.2s ease'
          }}
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #2d3748',
        padding: '0 24px',
        gap: '0'
      }}>
        {[
          { id: 'fullstack', label: 'Full Stack' },
          { id: 'frontend', label: 'Frontend' },
          { id: 'backend', label: 'Backend' },
          { id: 'ai', label: 'AI Tools' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: activeTab === tab.id ? '#374151' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        padding: '24px',
        gap: '24px'
      }}>
        {/* Left Side - Prompt Input */}
        <div style={{
          flex: 1,
          maxWidth: '600px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>🚀</span>
              What would you like to build?
            </h2>
            
            <div style={{
              position: 'relative'
            }}>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your project idea..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: '1.5'
                }}
              />
              
              {/* Right Side Send Button */}
              <button
                onClick={handleGenerate}
                disabled={isEnhancing || !userPrompt.trim()}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                <Send size={16} />
                {isEnhancing ? 'Enhancing...' : '✈ Generate'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Project Cards */}
        <div style={{
          flex: 2,
          overflow: 'auto'
        }}>
          {activeTab === 'fullstack' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/builder/${project.id}`)}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2d3748'
                    e.target.style.borderColor = '#4b5563'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#1a1a1a'
                    e.target.style.borderColor = '#2d3748'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {project.title}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    'WebkitLineClamp': 3,
                    'WebkitBoxOrient': 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ai' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {[
                { title: 'AI Website Generator', description: 'Generate stunning websites with AI', icon: '🤖' },
                { title: 'UI Components', description: 'Beautiful React components', icon: '🎨' },
                { title: 'Code Templates', description: 'Professional code templates', icon: '📝' },
                { title: 'Design System', description: 'Modern design patterns', icon: '🎯' }
              ].map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => setUserPrompt(suggestion.title)}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2d3748'
                    e.target.style.borderColor = '#4b5563'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#1a1a1a'
                    e.target.style.borderColor = '#2d3748'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{suggestion.icon}</span>
                  {suggestion.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prompt Enhancement Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <h3 style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              padding: '8px 16px'
            }}>
              ✨ Enhanced Prompt
            </h3>
            
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Original:
              </p>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {userPrompt}
              </p>
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Enhanced:
              </p>
              <textarea
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Monaco, Menlo, monospace',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: '1.5'
                }}
                placeholder={isEnhancing ? "Enhancing your prompt..." : "Enhanced prompt will appear here..."}
                disabled={isEnhancing}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  navigate('/builder', { state: { prompt: enhancedPrompt || userPrompt } })
                  setShowModal(false)
                }}
                disabled={isEnhancing || !enhancedPrompt.trim()}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isEnhancing ? 'not-allowed' : 'pointer',
                  opacity: isEnhancing || !enhancedPrompt.trim() ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isEnhancing ? 'Enhancing...' : 'Use Enhanced Prompt'}
              </button>
              <button
                onClick={() => {
                  navigate('/builder', { state: { prompt: userPrompt } })
                  setShowModal(false)
                }}
                style={{
                  background: '#ffffff',
                  color: '#6b7280',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Use Original Instead
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0,
            transform: translateY(-20px)
          }
          to {
            opacity: 1,
            transform: translateY(0)
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage
