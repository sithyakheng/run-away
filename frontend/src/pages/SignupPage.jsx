import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (error) {
        console.log("Signup error:", error.message)
      } else {
        console.log("Signup success!", data)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Signup catch error:', err)
      setError('Connection failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (password.length === 0) return 0
    if (password.length < 6) return 25
    if (password.length < 10) return 50
    if (password.length < 14) return 75
    return 100
  }

  const passwordStrength = getPasswordStrength(password)

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

      {/* Glassmorphism card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px rgba(124,58,237,0.15)',
        animation: 'fadeIn 0.8s ease-out',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            Join Run Away
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            Start building for free
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Full Name"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              width: '100%',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed'
              e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)'
              e.target.style.background = 'rgba(255,255,255,0.08)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)'
              e.target.style.boxShadow = 'none'
              e.target.style.background = 'rgba(255,255,255,0.05)'
            }}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              width: '100%',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed'
              e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)'
              e.target.style.background = 'rgba(255,255,255,0.08)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)'
              e.target.style.boxShadow = 'none'
              e.target.style.background = 'rgba(255,255,255,0.05)'
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
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              width: '100%',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed'
              e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)'
              e.target.style.background = 'rgba(255,255,255,0.08)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)'
              e.target.style.boxShadow = 'none'
              e.target.style.background = 'rgba(255,255,255,0.05)'
            }}
          />

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                height: '4px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${passwordStrength}%`,
                  background: passwordStrength < 50 ? '#ef4444' : passwordStrength < 75 ? '#f59e0b' : '#10b981',
                  transition: 'all 0.3s ease',
                  borderRadius: '2px'
                }} />
              </div>
              <p style={{
                fontSize: '12px',
                color: passwordStrength < 50 ? '#ef4444' : passwordStrength < 75 ? '#f59e0b' : '#10b981',
                fontFamily: "'Inter', sans-serif"
              }}>
                {passwordStrength < 50 ? 'Weak password' : passwordStrength < 75 ? 'Medium strength' : 'Strong password'}
              </p>
            </div>
          )}

          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
              outline: 'none',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 0 60px rgba(124,58,237,0.6)'
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 0 40px rgba(124,58,237,0.4)'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Terms */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '12px',
          color: '#64748b',
          fontFamily: "'Inter', sans-serif"
        }}>
          By signing up you agree to our{' '}
          <span style={{ color: '#7c3aed', cursor: 'pointer' }}>Terms</span>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <span style={{
            padding: '0 16px',
            color: '#64748b',
            fontSize: '14px',
            fontFamily: "'Inter', sans-serif"
          }}>
            or continue with
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(255,255,255,0.08)'
          }} />
        </div>

        {/* Google sign in */}
        <button
          onClick={() => {
            // TODO: Implement Google OAuth
            console.log('Google OAuth not implemented yet')
          }}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <span style={{ color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{
                color: '#7c3aed',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => e.target.style.color = '#8b5cf6'}
              onMouseOut={(e) => e.target.style.color = '#7c3aed'}
            >
              Login
            </span>
          </span>
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
      `}</style>
    </div>
  )
}

export default SignupPage
