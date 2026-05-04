import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TemplatesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const templates = [
    { id: 'landing', name: 'Landing Page', icon: '📄', description: 'Modern landing page with hero section' },
    { id: 'dashboard', name: 'SaaS Dashboard', icon: '📊', description: 'Analytics dashboard with charts' },
    { id: 'ecommerce', name: 'E-commerce Store', icon: '🛒', description: 'Online store with product catalog' },
    { id: 'blog', name: 'Blog Platform', icon: '📝', description: 'Personal blog with articles' },
    { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Creative portfolio showcase' },
    { id: 'startup', name: 'Startup Site', icon: '🚀', description: 'Startup landing page' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Restaurant menu and booking' },
    { id: 'fitness', name: 'Fitness App', icon: '💪', description: 'Fitness tracking dashboard' },
    { id: 'travel', name: 'Travel Blog', icon: '✈️', description: 'Travel blog and gallery' },
    { id: 'agency', name: 'Agency Site', icon: '🏢', description: 'Digital agency website' },
    { id: 'course', name: 'Course Platform', icon: '📚', description: 'Online learning platform' },
    { id: 'event', name: 'Event Page', icon: '🎉', description: 'Event registration page' }
  ]

  const visibleTemplates = 4
  const maxIndex = Math.max(0, templates.length - visibleTemplates)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const handleTemplateClick = (templateId) => {
    navigate(`/builder/new?template=${templateId}`)
  }

  return (
    <section className="px-6 py-12 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-text-primary">Start from a Template</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-tertiary">
              {currentIndex + 1} of {templates.length} templates
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="w-8 h-8 rounded-full bg-surface/50 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className="w-8 h-8 rounded-full bg-surface/50 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex gap-6 transition-transform-300"
            style={{ transform: `translateX(-${currentIndex * 264}px)` }}
          >
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => handleTemplateClick(template.id)}
              >
                <div className="card hover-lift relative overflow-hidden" style={{ width: '240px', height: '200px' }}>
                  {/* Template Preview */}
                  <div className="h-full bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-3">{template.icon}</div>
                      <h4 className="font-semibold text-text-primary text-lg">{template.name}</h4>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all-200 flex items-center justify-center">
                    <button className="btn-primary">
                      Use Template
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-tertiary mt-2 text-center">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Browse All Link */}
        <div className="text-center mt-8">
          <button className="text-primary-accent hover:underline font-medium">
            Browse All Templates →
          </button>
        </div>
      </div>
    </section>
  )
}

export default TemplatesCarousel
