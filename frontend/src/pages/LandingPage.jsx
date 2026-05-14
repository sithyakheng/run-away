import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Zap, Paintbrush, ArrowRight } from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[var(--color-page-bg)] min-h-screen w-full relative selection:bg-black/10 selection:text-black">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--color-border)] text-[12px] font-medium text-[var(--color-text-secondary)] shadow-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-black"></span>
          Now in Public Beta
        </div>

        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 text-[var(--color-text-primary)] text-center">
          Run Away
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto text-center font-normal">
          Build stunning websites in seconds with the power of AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
          <button 
            onClick={() => navigate('/signup')}
            className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
          >
            Start building for free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="btn-secondary px-8 py-4 text-lg"
          >
            Sign in
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Rocket className="w-6 h-6" />}
            title="AI-Powered"
            description="Describe your vision in natural language and watch it come to life instantly."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Lightning Fast"
            description="From idea to production-ready code in seconds, not hours or days."
          />
          <FeatureCard 
            icon={<Paintbrush className="w-6 h-6" />}
            title="Minimal Design"
            description="Clean, modern, and professional designs that work on every device."
          />
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-text-muted)] transition-all shadow-sm">
    <div className="w-12 h-12 bg-[var(--color-page-bg)] rounded-lg flex items-center justify-center mb-6 text-[var(--color-text-primary)]">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-3 text-[var(--color-text-primary)]">{title}</h3>
    <p className="text-[var(--color-text-secondary)] leading-relaxed">
      {description}
    </p>
  </div>
)

export default LandingPage
