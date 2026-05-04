import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUserData() {
      try {
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
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  const createNewProject = async () => {
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: 'New Project',
          description: 'Created on dashboard',
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
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-3 gradient-text">
              Dashboard
            </h1>
            <p className="text-text-secondary text-lg">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-surface p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Projects
          </h2>
          
          <button
            onClick={createNewProject}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:scale-105 transition-transform cursor-pointer border-none mb-6"
          >
            New Project
          </button>

          {projects.length === 0 ? (
            <p className="text-text-secondary text-center py-12">
              No projects yet. Create your first project to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/builder/${project.id}`)}
                  className="bg-background p-6 rounded-lg cursor-pointer hover:bg-border hover:scale-105 transition-all border border-border"
                >
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {project.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {project.description}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
