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
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#050508',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
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
            color: 'white'
          }}>
            Run Away
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '8px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px' }}>
        {/* Welcome Section */}
        <div style={{
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '8px'
          }}>
            Welcome back, {user?.email || 'User'}!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#a1a1aa'
          }}>
            Continue building amazing apps with AI
          </p>
        </div>

        {/* New Project Button */}
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => createNewProject()}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px'
          }}>
            Your Projects
          </h2>
          
          {projects.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <p style={{ color: 'white', marginBottom: '16px' }}>
                No projects yet. Create your first project to get started!
              </p>
              <button
                onClick={() => createNewProject()}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {projects.map(project => (
                <div
                  key={project.id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#a1a1aa',
                    marginBottom: '16px'
                  }}>
                    {project.description || 'No description'}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => navigate(`/builder/${project.id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
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
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage
