import React from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold mb-6 gradient-text">
        Run Away
      </h1>
      
      <p className="text-2xl text-text-secondary mb-10 max-w-2xl">
        Build Full Stack Apps With Just A Prompt
      </p>
      
      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:scale-105 transition-transform cursor-pointer border-none"
        >
          Get Started
        </button>
        
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 text-lg font-semibold bg-transparent text-white border-2 border-primary rounded-lg hover:bg-primary hover:scale-105 transition-all cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default LandingPage
