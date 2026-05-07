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
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid transparent',
            borderTop: '4px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'white' }}>Loading your workspace...</p>
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
      {/* Animated floating orbs */}
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
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float1 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float2 25s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          animation: 'float3 18s ease-in-out infinite'
        }} />
      </div>

      {/* Floating glassmorphism navbar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 40px',
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
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)'
          }} />
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#7c3aed'
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
            fontSize: '14px'
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
              transition: 'all 0.3s ease'
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

      {/* Main Content */}
      <div style={{ 
        padding: '60px 40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Welcome Section */}
        <div style={{
          marginBottom: '60px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px'
          }}>
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#94a3b8'
          }}>
            What are you building today?
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.1s both'
          }}>
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '8px'
            }}>
              Total Projects
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white'
            }}>
              {projects.length}
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.2s both'
          }}>
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '8px'
            }}>
              This Month
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white'
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
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.8s ease-out 0.3s both'
          }}>
            <h3 style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '8px'
            }}>
              Total Prompts
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white'
            }}>
              {projects.reduce((acc, p) => acc + (p.code?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* New Project Button */}
        <div style={{ marginBottom: '60px', animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
          <button
            onClick={() => createNewProject()}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '32px'
          }}>
            Your Projects
          </h2>
          
          {projects.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '60px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>🚀</div>
              <h3 style={{
                fontSize: '24px',
                color: 'white',
                marginBottom: '16px'
              }}>
                No projects yet. Start building!
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#94a3b8',
                marginBottom: '32px'
              }}>
                Create your first project and start building amazing apps with AI
              </p>
              <button
                onClick={() => createNewProject()}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 30px rgba(124,58,237,0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 0 40px rgba(124,58,237,0.6)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 0 30px rgba(124,58,237,0.4)'
                }}
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '32px'
            }}>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '32px',
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
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '12px'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }}>
                    {project.description || 'No description'}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => navigate(`/builder/${project.id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 20px rgba(124,58,237,0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.boxShadow = '0 0 30px rgba(124,58,237,0.5)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)'
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
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
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
          25% { transform: translate(30px, -40px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(40px, 10px) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.15); }
          66% { transform: translate(20px, -50px) scale(0.85); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, 20px) scale(1.08); }
          50% { transform: translate(-30px, -30px) scale(0.92); }
          75% { transform: translate(20px, -40px) scale(1.04); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
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
