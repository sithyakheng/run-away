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

  console.log('ENV CHECK:', {
    url: import.meta.env.VITE_SUPABASE_URL,
    keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length
  })

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!fullName || !email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout. Please check your internet connection and try again.')), 30000)
    })

    try {
      const { data, error } = await Promise.race([
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: null
          }
        }),
        timeoutPromise
      ])

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: '#050508', fontFamily: 'var(--font-body)' }}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
            animation: 'gradientShift 20s ease-in-out infinite'
          }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animation: 'float1 15s ease-in-out infinite' }} />
        <div className="absolute top-40 right-32 w-96 h-96 bg-cyan-600 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animation: 'float2 20s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-8 rounded-2xl" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                Run Away
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px'
            }}>
              Create Account
            </h2>
            <p style={{ fontSize: '16px', color: '#a1a1aa' }}>
              Start building amazing apps today
            </p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="mb-6">
              <label className="block mb-2" style={{ fontSize: '14px', color: '#a1a1aa', fontFamily: 'var(--font-body)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2" style={{ fontSize: '14px', color: '#a1a1aa', fontFamily: 'var(--font-body)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2" style={{ fontSize: '14px', color: '#a1a1aa', fontFamily: 'var(--font-body)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {error && (
              <div className="mb-6 p-4 text-white rounded-lg text-sm animate-pulse" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 012 0 1 1 0 01-2 0z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                fontFamily: 'var(--font-body)',
                animation: 'glow 2s ease-in-out infinite'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 8 8 0 01-8 8 8 8 0 018-8z" />
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center" style={{ fontSize: '14px', color: '#a1a1aa', fontFamily: 'var(--font-body)' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer hover:underline transition-all duration-200"
              style={{ color: '#7c3aed' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { transform: translateX(0%) translateY(0%) scale(1); }
          25% { transform: translateX(-5%) translateY(5%) scale(1.05); }
          50% { transform: translateX(5%) translateY(-5%) scale(1.05); }
          75% { transform: translateX(-3%) translateY(-3%) scale(1.02); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, 20px) scale(1.05); }
          66% { transform: translate(20px, -40px) scale(0.95); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(124, 58, 237, 0.8); }
        }
      `}</style>
    </div>
  )
}

export default SignupPage
