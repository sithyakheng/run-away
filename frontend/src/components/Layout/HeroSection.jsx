import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection({ onCreateProject }) {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const templates = [
    { id: 'landing', label: 'Landing Page', icon: '📄' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { id: 'blog', label: 'Blog', icon: '📝' }
  ]

  const handleBuild = () => {
    if (prompt.trim()) {
      onCreateProject(prompt)
    }
  }

  const handlePlan = () => {
    // Plan functionality - could open a planning modal
    console.log('Planning:', prompt)
  }

  const handleTemplateClick = (templateId) => {
    navigate(`/builder/new?template=${templateId}`)
  }

  return (
    <section className="gradient-hero relative overflow-hidden" style={{ minHeight: '40vh' }}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-secondary-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl font-bold text-text-primary mb-6" style={{ fontSize: '48px', fontWeight: 700 }}>
          What will you build today?
        </h2>
        
        <p className="text-lg text-text-secondary mb-12 max-w-2xl" style={{ fontSize: '18px' }}>
          Create stunning websites and apps by describing your vision to AI.
        </p>

        {/* Main Input Area */}
        <div className="w-full max-w-4xl mb-8">
          <div className="relative bg-surface/80 backdrop-blur-sm rounded-2xl border border-primary-accent/50 focus-within:border-primary-accent focus-within:shadow-lg focus-within:shadow-primary-accent/20 transition-all-200">
            <div className="flex items-center">
              {/* Add Context Button */}
              <button className="p-4 text-text-tertiary hover:text-text-primary transition-all-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuild()}
                placeholder="Describe your website or app idea..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary px-4 py-4 focus:outline-none text-lg"
                style={{ fontSize: '16px' }}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-2 p-2">
                <button
                  onClick={handlePlan}
                  className="btn-secondary px-6 py-3 text-sm font-medium"
                >
                  Plan
                </button>
                <button
                  onClick={handleBuild}
                  disabled={!prompt.trim()}
                  className="btn-primary px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Build Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Templates */}
        <div className="w-full max-w-4xl">
          <p className="text-sm text-text-tertiary mb-4">Quick start templates:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
                className="flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border rounded-lg text-sm text-text-primary hover:bg-surface/70 hover:border-primary-accent hover-scale cursor-pointer transition-all-200"
              >
                <span>{template.icon}</span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
