import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paperclip, Settings, Code, Mic, Send } from 'lucide-react'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fullstack')
  const [prompt, setPrompt] = useState('')
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

  const handleGenerate = () => {
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt: prompt.trim() } })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const createNewProject = async (prompt = '') => {
    const { supabase } = await import('../lib/supabase')
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: prompt || 'New Project',
          description: prompt || 'Created on dashboard',
          code: '',
          status: 'draft'
        })
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        navigate(`/builder/${data[0].id}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
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
          <p style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grey dot grid pattern background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      {/* Minimalist navbar */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '16px 40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            fontFamily: 'Inter, sans-serif'
          }}>
            Run Away
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              color: '#6b7280',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}>
              {user?.email || 'user@example.com'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.backgroundColor = '#f9fafb'
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 40px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* NEW announcement pill */}
        <div style={{
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '24px',
          border: '1px solid #bae6fd',
          fontFamily: 'Inter, sans-serif'
        }}>
          NEW
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '16px',
          fontFamily: 'Georgia, serif',
          lineHeight: '1.2',
          textAlign: 'center'
        }}>
          Don't just think it. Run Away with it.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '48px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          Transform your ideas into reality with AI-powered development
        </p>

        {/* Multi-tab layout */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '2px',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '12px'
          }}>
            {[
              { id: 'fullstack', label: 'Full Stack App', icon: '🌐' },
              { id: 'mobile', label: 'Mobile App', icon: '📱' },
              { id: 'website', label: 'Website', icon: '🌍' },
              { id: 'extension', label: 'Chrome Extension', icon: '🔧' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Beautiful Lovable.dev-style Prompt Input */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          position: 'relative'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef'
          }}>
            {/* Textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              style={{
                width: '100%',
                minHeight: '120px',
                maxHeight: '400px',
                padding: '16px',
                border: '2px solid #2d3748',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                lineHeight: '1.5',
                resize: 'none',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#1a202c',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4a5568'
                e.target.style.boxShadow = '0 0 0 3px rgba(74, 85, 104, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3748'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Action Buttons Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              gap: '12px'
            }}>
              {/* Left Side Icons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                {/* Attach File */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#64748b'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.borderColor = '#cbd5e1'
                    e.target.style.color = '#475569'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>

                {/* Settings */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#64748b'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.borderColor = '#cbd5e1'
                    e.target.style.color = '#475569'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}
                  title="Settings"
                >
                  <Settings size={18} />
                </button>

                {/* Code View */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#64748b'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.borderColor = '#cbd5e1'
                    e.target.style.color = '#475569'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}
                  title="Code view"
                >
                  <Code size={18} />
                </button>

                {/* Mic */}
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#64748b'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.borderColor = '#cbd5e1'
                    e.target.style.color = '#475569'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.color = '#64748b'
                  }}
                  title="Voice input"
                >
                  <Mic size={18} />
                </button>
              </div>

              {/* Right Side Send Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: prompt.trim() ? '#1a202c' : '#e2e8f0',
                  color: prompt.trim() ? '#ffffff' : '#a0aec0',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: prompt.trim() ? '0 2px 8px rgba(26, 32, 44, 0.15)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (prompt.trim()) {
                    e.target.style.backgroundColor = '#2d3748'
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 4px 12px rgba(26, 32, 44, 0.25)'
                  }
                }}
                onMouseOut={(e) => {
                  if (prompt.trim()) {
                    e.target.style.backgroundColor = '#1a202c'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 8px rgba(26, 32, 44, 0.15)'
                  }
                }}
              >
                <Send size={16} />
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Quick action suggestions */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          marginTop: '32px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { title: 'AI Company Showcase', icon: '🏢' },
              { title: 'AI Personal Brand Site', icon: '👤' },
              { title: 'AI SaaS Waitlist Site', icon: '📋' }
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion.title)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb'
                  e.target.style.borderColor = '#d1d5db'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.borderColor = '#e5e7eb'
                }}
              >
                <span style={{ fontSize: '16px' }}>{suggestion.icon}</span>
                {suggestion.title}
              </button>
            ))}
            
            {/* Refresh/sync icon */}
            <button style={{
              width: '40px',
              height: '40px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '16px' }}>🔄</span>
            </button>
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

export default DashboardPage
