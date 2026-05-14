import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import { CpuArchitecture } from './components/ui/cpu-architecture'
import { DemoOne } from './components/ui/demo'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import BuilderPage from './pages/BuilderPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <h1 className="text-4xl font-medium tracking-tight text-[var(--color-text-primary)]">Run Away</h1>
          <div className="space-y-2">
            <p className="text-lg text-[var(--color-text-secondary)]">Something went wrong</p>
            <p className="text-sm text-red-500 max-w-md mx-auto">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error checking session:', error)
          setUser(null)
          setLoading(false)
          return
        }
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center space-y-8">
        <div className="w-48 h-24">
          <CpuArchitecture />
        </div>
        <div className="text-sm font-medium text-[var(--color-text-secondary)]">
          Initializing...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-[var(--color-page-bg)] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h1 className="text-4xl font-medium tracking-tight text-[var(--color-text-primary)]">Run Away</h1>
        <p className="text-[var(--color-text-secondary)]">App needs configuration</p>
        <button
          onClick={() => window.open('https://github.com/sithyakheng/run-away#environment-setup', '_blank')}
          className="btn-primary"
        >
          Configure App
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin-demo" element={<DemoOne />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder" 
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
