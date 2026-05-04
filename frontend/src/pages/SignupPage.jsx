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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface p-10 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block mb-3 text-text-secondary">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform cursor-pointer border-none"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-text-secondary">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-primary cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
