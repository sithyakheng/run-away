import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PromptInputBox } from '../components/ui/ai-prompt-box'
import { LogOut, Rocket, Clock, Layout, Plus } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [userPrompt, setUserPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleGenerate = async (messagePrompt) => {
    const promptToUse = messagePrompt || userPrompt
    if (!promptToUse.trim()) return
    setIsEnhancing(true)
    
    // Direct navigate to builder with prompt for now
    navigate('/builder', { state: { prompt: promptToUse } })
    setIsEnhancing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const suggestions = [
    { emoji: '🏨', label: 'Hotel Website' },
    { emoji: '🛒', label: 'E-commerce Store' },
    { emoji: '💼', label: 'Portfolio' },
    { emoji: '🚀', label: 'SaaS Landing' },
    { emoji: '🍕', label: 'Restaurant' }
  ]

  const recentProjects = [
    { name: 'E-commerce Dashboard', date: '2 hours ago' },
    { name: 'Portfolio Website', date: 'Yesterday' },
    { name: 'Restaurant Landing', date: '3 days ago' }
  ]

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)]">
      {/* Navbar */}
      <nav className="h-[var(--header-height)] bg-[var(--color-surface)] border-b border-[var(--color-border)] px-8 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-medium text-lg tracking-tight">
          <Rocket className="w-5 h-5" />
          <span>Run Away</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-[var(--color-text-secondary)]">{user?.email}</span>
          <button 
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-2 px-3 py-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[12px] font-medium text-[var(--color-text-secondary)] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Powered by Groq AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-[var(--color-text-primary)]">
            What will you build today?
          </h1>
          
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            Turn your ideas into stunning websites in seconds with our AI-powered builder.
          </p>

          <div className="max-w-2xl mx-auto pt-4">
            <PromptInputBox
              onSend={(message) => handleGenerate(message)}
              isLoading={isEnhancing}
              placeholder="Describe what you want to build..."
              className="shadow-md"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleGenerate(s.label)}
                className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-text-secondary)]" />
              Recent Projects
            </h2>
            <button className="btn-ghost text-sm font-medium">View all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((project, i) => (
              <div
                key={i}
                className="card group p-5 space-y-4 cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="aspect-video rounded-md bg-[var(--color-page-bg)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-text-muted)] transition-colors">
                  <Layout className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-[var(--color-text-primary)] group-hover:underline underline-offset-4">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Edited {project.date}
                  </p>
                </div>
              </div>
            ))}
            <button className="card border-dashed flex flex-col items-center justify-center p-5 space-y-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors">
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">New Project</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
