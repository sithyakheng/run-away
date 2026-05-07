import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [typingText, setTypingText] = useState('')
  const navigate = useNavigate()

  const typingTexts = ['Landing Pages.', 'Dashboards.', 'Full Stack Apps.']
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const currentFullText = typingTexts[currentTextIndex]
    const typingSpeed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting && typingText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && typingText === '') {
        setIsDeleting(false)
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length)
      } else {
        setTypingText(currentFullText.slice(0, isDeleting ? typingText.length - 1 : typingText.length + 1))
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typingText, isDeleting, currentTextIndex])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#050508', fontFamily: 'var(--font-body)' }}>
      {/* Animated gradient background with floating orbs */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(124, 58, 237, 0.2) 0%, transparent 50%)',
            animation: 'gradientShift 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animation: 'float1 15s ease-in-out infinite' }} />
        <div className="absolute top-40 right-32 w-96 h-96 bg-cyan-600 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animation: 'float2 20s ease-in-out infinite' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animation: 'float3 18s ease-in-out infinite' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
              Run Away
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                fontFamily: 'var(--font-body)'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: '700',
                lineHeight: '1.1',
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Build Apps With Just A Prompt
            </h1>
            
            <div style={{ 
              fontSize: 'clamp(24px, 4vw, 36px)', 
              fontWeight: '600', 
              color: '#ffffff',
              marginBottom: '24px',
              fontFamily: 'var(--font-heading)',
              minHeight: '48px'
            }}>
              {typingText}
              <span className="animate-pulse" style={{ color: '#7c3aed' }}>|</span>
            </div>
            
            <p style={{
              fontSize: '20px',
              color: '#a1a1aa',
              marginBottom: '48px',
              maxWidth: '600px',
              margin: '0 auto 48px',
              fontFamily: 'var(--font-body)'
            }}>
              Describe what you want and Run Away builds it instantly using AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                  fontFamily: 'var(--font-body)',
                  animation: 'glow 2s ease-in-out infinite'
                }}
              >
                Start Building Free
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(124, 58, 237, 0.5)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-body)'
                }}
              >
                See Demo
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div 
              className="rounded-lg overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>// AI Prompt</div>
                    <div className="text-sm text-white mb-4" style={{ fontFamily: 'monospace' }}>
                      Create a modern landing page with hero section...
                    </div>
                    <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>// Generated Code</div>
                    <div className="text-xs text-green-400" style={{ fontFamily: 'monospace' }}>
                      &lt;div className="hero"&gt;<br/>
                      &nbsp;&nbsp;&lt;h1&gt;Welcome&lt;/h1&gt;<br/>
                      &lt;/div&gt;
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-lg" style={{ 
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div className="text-center text-white text-xs">Preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            Everything you need to build
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'AI-Powered',
                description: 'Describe your app in natural language and watch it come to life'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Generate full-stack applications in seconds, not hours'
              },
              {
                icon: '🎨',
                title: 'Modern Design',
                description: 'Beautiful, responsive designs that work on every device'
              },
              {
                icon: '🔧',
                title: 'Full Stack',
                description: 'Frontend, backend, and database - all included'
              },
              {
                icon: '☁️',
                title: 'Cloud Ready',
                description: 'Deploy instantly to Vercel, Netlify, or your favorite platform'
              },
              {
                icon: '🔄',
                title: 'Iterate Fast',
                description: 'Make changes and see results in real-time'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '16px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#a1a1aa',
                  fontFamily: 'var(--font-body)'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            How it works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe',
                description: 'Tell us what you want to build in plain English'
              },
              {
                step: '02',
                title: 'Generate',
                description: 'AI creates your full-stack application instantly'
              },
              {
                step: '03',
                title: 'Deploy',
                description: 'Share your app with the world in one click'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold mb-4" style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '16px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#a1a1aa',
                  fontFamily: 'var(--font-body)'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
              Run Away
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#71717a', fontFamily: 'var(--font-body)' }}>
            Build anything, anywhere, anytime
          </p>
        </div>
      </footer>

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
        
        @keyframes float3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(25px, 25px) scale(1.08); }
          66% { transform: translate(-25px, -25px) scale(0.92); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(124, 58, 237, 0.8); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
