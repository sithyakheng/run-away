import React from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
      <h1 className="text-6xl font-bold mb-6 gradient-text">
        Run Away
      </h1>
      
      <p className="text-2xl mb-10 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
        Build Full Stack Apps With Just A Prompt
      </p>
      
      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-4 text-lg font-semibold text-white rounded-lg hover-scale cursor-pointer border-none btn-primary"
        >
          Get Started
        </button>
        
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 text-lg font-semibold rounded-lg hover-scale cursor-pointer btn-secondary"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default LandingPage
