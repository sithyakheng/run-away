import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#7c3aed',
            marginBottom: '8px'
          }}>
            Run Away
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <span style={{ color: 'white' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{
                color: '#7c3aed',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
