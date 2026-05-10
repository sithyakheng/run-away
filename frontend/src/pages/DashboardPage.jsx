import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardPromptInput } from '../components/ui/dashboard-prompt-input'

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

  const handleGenerate = (message, files = []) => {
    // Remove mode prefixes if present
    let cleanPrompt = message
    if (message.startsWith('[Search: ')) {
      cleanPrompt = message.slice(9, -1) // Remove [Search: prefix and closing ]
    } else if (message.startsWith('[Think: ')) {
      cleanPrompt = message.slice(8, -1) // Remove [Think: prefix and closing ]
    } else if (message.startsWith('[Canvas: ')) {
      cleanPrompt = message.slice(9, -1) // Remove [Canvas: prefix and closing ]
    }
    
    if (cleanPrompt.trim()) {
      navigate('/builder', { state: { prompt: cleanPrompt.trim() } })
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

        {/* Clean AI Prompt Input */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          position: 'relative'
        }}>
          <DashboardPromptInput
            onSend={handleGenerate}
            placeholder="Describe what you want to build..."
            className="w-full"
          />
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
