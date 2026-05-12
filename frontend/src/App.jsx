import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import { CpuArchitecture } from './components/ui/cpu-architecture'
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
        <div style={{
          background: '#0a0a0f',
          color: 'white',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          gap: '16px',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{color: '#7c3aed', fontSize: '48px', margin: 0}}>Run Away</h1>
          <p style={{color: '#94a3b8', fontSize: '18px'}}>Something went wrong</p>
          <p style={{color: '#ef4444', fontSize: '14px', maxWidth: '400px'}}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
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
    // Check session on mount
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

    // Listen to auth state changes
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0f',
        color: 'white',
        gap: '24px'
      }}>
        <div style={{
          width: '200px',
          height: '100px'
        }}>
          <CpuArchitecture />
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: '#94a3b8',
          fontFamily: 'Inter, sans-serif'
        }}>
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
      <div style={{
        background: '#0a0a0f',
        color: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        gap: '16px'
      }}>
        <h1 style={{color: '#7c3aed', fontSize: '48px', margin: 0}}>Run Away</h1>
        <p style={{color: '#94a3b8'}}>App needs configuration</p>
        <button
          onClick={() => window.open('https://github.com/sithyakheng/run-away#environment-setup', '_blank')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
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
