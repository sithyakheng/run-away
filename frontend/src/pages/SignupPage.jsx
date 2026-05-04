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
    setError('')
    setLoading(true)

    if (!supabase) {
      setError('Supabase is not configured. Please check your environment variables.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      navigate('/dashboard')
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
            <div className="mb-6 p-3 text-white rounded-lg text-sm" style={{ backgroundColor: 'var(--color-error)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 btn-primary font-semibold"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
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
