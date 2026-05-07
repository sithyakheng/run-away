import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
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

  const handleProjectAction = async (action, projectId) => {
    const { supabase } = await import('../lib/supabase')
    switch (action) {
      case 'delete':
        try {
          await supabase.from('projects').delete().eq('id', projectId)
          setProjects(prev => prev.filter(p => p.id !== projectId))
        } catch (error) {
          console.error('Error deleting project:', error)
        }
        break
      default:
        console.log('Unknown action:', action, projectId)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#050508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'float1 20s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
            animation: 'float2 25s ease-in-out infinite'
          }} />
        </div>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid transparent',
            borderTop: '4px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float1 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'float2 25s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float3 18s ease-in-out infinite'
        }} />
      </div>

      {/* Floating glassmorphism navbar */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
            }} />
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#7c3aed',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Run Away
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}>
              {user?.email || 'user@example.com'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Welcome Section */}
        <div style={{
          marginBottom: '80px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: '1.1'
          }}>
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            What are you building today?
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.1s both',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '12px',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total Projects
            </h3>
            <p style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {projects.length}
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.2s both',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '12px',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              This Month
            </h3>
            <p style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {projects.filter(p => {
                const createdAt = new Date(p.created_at)
                const thisMonth = new Date()
                return createdAt.getMonth() === thisMonth.getMonth() && 
                       createdAt.getFullYear() === thisMonth.getFullYear()
              }).length}
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.3s both',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '12px',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total Prompts
            </h3>
            <p style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {projects.reduce((acc, p) => acc + (p.code?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* New Project Button */}
        <div style={{ marginBottom: '80px', animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
          <button
            onClick={() => createNewProject()}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              padding: '24px 48px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 60px rgba(124,58,237,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 0 80px rgba(124,58,237,0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 0 60px rgba(124,58,237,0.4)'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '48px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            Your Projects
          </h2>
          
          {projects.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '80px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{ fontSize: '64px', marginBottom: '32px' }}>🚀</div>
              <h3 style={{
                fontSize: '32px',
                color: 'white',
                marginBottom: '20px',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                No projects yet. Start building!
              </h3>
              <p style={{
                fontSize: '18px',
                color: '#94a3b8',
                marginBottom: '40px',
                fontFamily: "'Inter', sans-serif",
                lineHeight: '1.6'
              }}>
                Create your first project and start building amazing apps with AI
              </p>
              <button
                onClick={() => createNewProject()}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: 'white',
                  padding: '20px 40px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 40px rgba(124,58,237,0.4)',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 0 60px rgba(124,58,237,0.6)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 0 40px rgba(124,58,237,0.4)'
                }}
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '32px'
            }}>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '40px',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    animation: `fadeIn 0.8s ease-out ${0.6 + index * 0.1}s both`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,58,237,0.2)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    {project.name}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#94a3b8',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {project.description || 'No description'}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '16px'
                  }}>
                    <button
                      onClick={() => navigate(`/builder/${project.id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 30px rgba(124,58,237,0.3)',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.boxShadow = '0 0 40px rgba(124,58,237,0.5)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 0 30px rgba(124,58,237,0.3)'
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleProjectAction('delete', project.id)}
                      style={{
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#ef4444'
                        e.target.style.color = 'white'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#ef4444'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -60px) scale(1.1); }
          50% { transform: translate(-30px, 40px) scale(0.9); }
          75% { transform: translate(60px, 20px) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 40px) scale(1.15); }
          66% { transform: translate(30px, -70px) scale(0.85); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 30px) scale(1.08); }
          50% { transform: translate(-40px, -40px) scale(0.92); }
          75% { transform: translate(30px, -50px) scale(1.04); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
