import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import HeroSection from '../components/Layout/HeroSection'
import ProjectsGrid from '../components/Layout/ProjectsGrid'
import TemplatesCarousel from '../components/Layout/TemplatesCarousel'
import IntegrationsSection from '../components/Layout/IntegrationsSection'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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

  const createNewProject = async (prompt = '') => {
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
    switch (action) {
      case 'duplicate':
        // Duplicate project logic
        console.log('Duplicating project:', projectId)
        break
      case 'delete':
        // Delete project logic
        try {
          await supabase.from('projects').delete().eq('id', projectId)
          setProjects(prev => prev.filter(p => p.id !== projectId))
        } catch (error) {
          console.error('Error deleting project:', error)
        }
        break
      case 'favorite':
        // Favorite project logic
        console.log('Favoriting project:', projectId)
        break
      case 'share':
        // Share project logic
        console.log('Sharing project:', projectId)
        break
      case 'rename':
        // Rename project logic
        console.log('Renaming project:', projectId)
        break
      case 'move':
        // Move project logic
        console.log('Moving project:', projectId)
        break
      case 'archive':
        // Archive project logic
        console.log('Archiving project:', projectId)
        break
      default:
        console.log('Unknown action:', action, projectId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-primary-accent)' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}>
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto">
          <HeroSection onCreateProject={createNewProject} />
          <ProjectsGrid 
            projects={projects}
            onCreateProject={() => createNewProject()}
            onProjectAction={handleProjectAction}
          />
          <TemplatesCarousel />
          <IntegrationsSection />
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
