import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const [typingText, setTypingText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const navigate = useNavigate()

  const texts = ['Landing Pages.', 'Dashboards.', 'Full Stack Apps.']

  useEffect(() => {
    const currentText = texts[textIndex]
    const typingSpeed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting && typingText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && typingText === '') {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
      } else {
        setTypingText(currentText.slice(0, isDeleting ? typingText.length - 1 : typingText.length + 1))
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [typingText, isDeleting, textIndex])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float1 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'float2 25s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float3 18s ease-in-out infinite'
        }} />
      </div>

      {/* Navbar with frosted glass effect */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
            }} />
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#7c3aed',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Run Away
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '15px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => e.target.style.color = '#7c3aed'}
              onMouseOut={(e) => e.target.style.color = 'white'}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '15px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.5)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.3)'
              }}
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
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '120px 40px 80px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: '700',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontFamily: "'Space Grotesk', sans-serif",
          lineHeight: '1.1'
        }}>
          Build Apps With Just A Prompt
        </h1>
        
        <div style={{
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: '600',
          marginBottom: '32px',
          fontFamily: "'Space Grotesk', sans-serif',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {typingText}
          <span style={{
            color: '#7c3aed',
            animation: 'pulse 2s infinite'
          }}>|</span>
        </div>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '64px',
          color: '#94a3b8',
          maxWidth: '700px',
          margin: '0 auto 64px',
          lineHeight: '1.6',
          fontFamily: "'Inter', sans-serif"
        }}>
          Describe what you want and Run Away builds it instantly using AI
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              color: 'white',
              border: 'none',
              padding: '18px 36px',
              fontSize: '18px',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '600'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 0 60px rgba(124, 58, 237, 0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 0 40px rgba(124, 58, 237, 0.4)'
            }}
          >
            Start Building Free
          </button>
          
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(124, 58, 237, 0.5)',
              padding: '18px 36px',
              fontSize: '18px',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '600'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'rgba(124, 58, 237, 0.8)'
              e.target.style.transform = 'translateY(-3px)'
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(124, 58, 237, 0.5)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            See Demo
          </button>
        </div>

        {/* Animated Mockup */}
        <div style={{
          marginTop: '100px',
          maxWidth: '900px',
          margin: '100px auto 0',
          animation: 'fadeIn 1s ease-out 0.5s both'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Browser header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <div style={{
                flex: 1,
                height: '20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                marginLeft: '16px'
              }} />
            </div>
            
            {/* Content */}
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    AI Prompt
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#e2e8f0',
                    marginBottom: '24px',
                    fontFamily: 'monospace',
                    lineHeight: '1.6'
                  }}>
                    Create a modern landing page<br/>
                    with hero section, features, and<br/>
                    contact form using React
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Generated Code
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#10b981',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    {'<'}div className="hero"{'>'}<br/>
                    &nbsp;&nbsp;{'<'}h1{'>'}Welcome{'<'}/h1{'>'}<br/>
                    &nbsp;&nbsp;{'<'}button{'>'}Get Started{'<'}/button{'>'}<br/>
                    {'<'}/div{'>'}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '16px',
                      color: '#94a3b8',
                      marginBottom: '16px'
                    }}>
                      Live Preview
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '16px',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                      Welcome
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      Get Started
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 40px',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: '80px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            Everything you need to build
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
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
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '40px',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  lineHeight: '1.6',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: '80px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            How it works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
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
                description: 'Share your app with the world in one click'
              }
            ].map((step, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '72px',
                  fontWeight: '700',
                  marginBottom: '24px',
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
                  fontSize: '28px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  lineHeight: '1.6',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 40px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
            }} />
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#7c3aed',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Run Away
            </span>
          </div>
          <p style={{ 
            fontSize: '16px', 
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            Build anything, anywhere, anytime
          </p>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -60px) scale(1.1); }
          50% { transform: translate(-30px, 40px) scale(0.9); }
          75% { transform: translate(60px, 20px) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 40px) scale(1.15); }
          66% { transform: translate(30px, -70px) scale(0.85); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 30px) scale(1.08); }
          50% { transform: translate(-40px, -40px) scale(0.92); }
          75% { transform: translate(30px, -50px) scale(1.04); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
