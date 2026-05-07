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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
      <div className="card p-10 rounded-xl w-full max-w-md shadow-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
          Create Account
        </h2>

        <div style={{color: 'yellow', fontSize: '12px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginBottom: '20px'}}>
          URL: {import.meta.env.VITE_SUPABASE_URL || 'MISSING'}
          KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS - length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length : 'MISSING'}
        </div>

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 input text-white"
              placeholder="Enter your full name"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 input text-white"
              placeholder="Enter your email"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 input text-white"
              placeholder="Enter your password"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 text-white rounded-lg text-sm animate-pulse" style={{ backgroundColor: 'var(--color-error)' }}>
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
            className="w-full p-4 btn-primary font-semibold relative overflow-hidden"
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

        <p className="mt-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="cursor-pointer hover:underline"
            style={{ color: 'var(--color-primary-accent)' }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
