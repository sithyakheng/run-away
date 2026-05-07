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
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#050508',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Animated gradient background with floating orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.6,
          background: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(124, 58, 237, 0.2) 0%, transparent 50%)',
          animation: 'gradientShift 20s ease-in-out infinite'
        }} />
        
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '80px',
          width: '288px',
          height: '288px',
          backgroundColor: '#9333ea',
          borderRadius: '50%',
          opacity: 0.2,
          filter: 'blur(24px)',
          animation: 'float1 15s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '160px',
          right: '128px',
          width: '384px',
          height: '384px',
          backgroundColor: '#0891b2',
          borderRadius: '50%',
          opacity: 0.2,
          filter: 'blur(24px)',
          animation: 'float2 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          backgroundColor: '#9333ea',
          borderRadius: '50%',
          opacity: 0.2,
          filter: 'blur(24px)',
          animation: 'float3 18s ease-in-out infinite'
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'relative',
        zIndex: 20,
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '24px',
        paddingBottom: '24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
            }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              Run Away
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            transition: 'all 1s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)'
          }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              Build Apps With Just A Prompt
            </h1>
            
            <div style={{ 
              fontSize: 'clamp(24px, 4vw, 36px)', 
              fontWeight: '600', 
              color: '#ffffff',
              marginBottom: '24px',
              fontFamily: "'Space Grotesk', sans-serif",
              minHeight: '48px'
            }}>
              {typingText}
              <span style={{ color: '#7c3aed', animation: 'pulse 2s infinite' }}>|</span>
            </div>
            
            <p style={{
              fontSize: '20px',
              color: '#a1a1aa',
              marginBottom: '48px',
              maxWidth: '600px',
              margin: '0 auto 48px',
              fontFamily: "'Inter', sans-serif"
            }}>
              Describe what you want and Run Away builds it instantly using AI
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                  fontFamily: "'Inter', sans-serif",
                  animation: 'glow 2s ease-in-out infinite'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Start Building Free
              </button>
              
              <button
                onClick={() => navigate('/login')}
                style={{
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '2px solid rgba(124, 58, 237, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                See Demo
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div style={{
            marginTop: '80px',
            maxWidth: '896px',
            margin: '0 auto'
          }}>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
                  gap: '24px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontFamily: 'monospace' }}>
                      // AI Prompt
                    </div>
                    <div style={{ fontSize: '14px', color: '#ffffff', marginBottom: '16px', fontFamily: 'monospace' }}>
                      Create a modern landing page with hero section...
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontFamily: 'monospace' }}>
                      // Generated Code
                    </div>
                    <div style={{ fontSize: '12px', color: '#34d399', fontFamily: 'monospace' }}>
                      &lt;div className="hero"&gt;<br/>
                      &nbsp;&nbsp;&lt;h1&gt;Welcome&lt;/h1&gt;<br/>
                      &lt;/div&gt;
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '128px',
                      height: '128px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '12px' }}>
                        Preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            Everything you need to build
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
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
                style={{
                  padding: '32px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
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
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            How it works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
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
                description: 'Share your app with world in one click'
              }
            ].map((step, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '60px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
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
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingTop: '48px',
        paddingBottom: '48px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)'
            }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              Run Away
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#71717a', fontFamily: "'Inter', sans-serif" }}>
            Build anything, anywhere, anytime
          </p>
        </div>
      </footer>

      {/* Custom animations */}
      <style>{`
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default LandingPage

export default LandingPage
