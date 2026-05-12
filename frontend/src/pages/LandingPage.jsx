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
      backgroundColor: '#050505',
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
        backdropFilter: 'blur(20px)',
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
              fontFamily: "'Space Grotesk', sans-serif",
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

      {/* Hero Section with Topographic Wavy Line */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        overflow: 'hidden'
      }}>
        {/* Topographic Wavy Line SVG */}
        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            transform: 'translateY(-50%)',
            width: '100%',
            height: '200px',
            opacity: 0.3,
            zIndex: 1
          }}
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 C150,50 350,150 600,100 C850,50 1050,150 1200,100"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M0,120 C150,70 350,170 600,120 C850,70 1050,170 1200,120"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M0,80 C150,30 350,130 600,80 C850,30 1050,130 1200,80"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </svg>

        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '1200px',
          padding: '0 40px'
        }}>
          {/* Massive Welcome Heading */}
          <h1 style={{
            fontSize: 'clamp(80px, 12vw, 200px)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '40px',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: '0.8',
            letterSpacing: '-0.05em',
            textShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
            animation: 'fadeInUp 1s ease-out'
          }}>
            Welcome.
          </h1>
          
          {/* Animated typing text */}
          <div style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '600',
            marginBottom: '60px',
            fontFamily: "'Space Grotesk', sans-serif",
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#94a3b8',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}>
            Build {typingText}
            <span style={{
              color: '#7c3aed',
              animation: 'pulse 2s infinite'
            }}>|</span>
          </div>
          
          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 60px',
            position: 'relative',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            <input
              type="text"
              placeholder="Describe your app idea..."
              style={{
                width: '100%',
                padding: '20px 60px 20px 24px',
                fontSize: '18px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '50px',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.4)'
                e.target.style.background = 'rgba(255,255,255,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)'
                e.target.style.boxShadow = 'none'
                e.target.style.background = 'rgba(255,255,255,0.05)'
              }}
            />
            <button
              onClick={() => navigate('/signup')}
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-50%) scale(1.1)'
                e.target.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.6)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(-50%) scale(1)'
                e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.4)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Get Started Button */}
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white',
              padding: '20px 48px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
              fontFamily: "'Inter', sans-serif",
              animation: 'fadeInUp 1s ease-out 0.6s both'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)'
              e.target.style.boxShadow = '0 0 60px rgba(59, 130, 246, 0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)'
              e.target.style.boxShadow = '0 0 40px rgba(59, 130, 246, 0.4)'
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Built with Run Away Showcase Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 40px',
        background: '#050505',
        overflow: 'hidden'
      }}>
        {/* Noise/Grain Texture Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            marginBottom: '80px',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.02em'
          }}>
            Built with Run Away
          </h2>
          
          {/* Collage Layout with Overlapping Cards */}
          <div style={{
            position: 'relative',
            height: '800px',
            margin: '0 auto'
          }}>
            {[
              {
                title: 'E-commerce Store',
                description: 'Modern shopping experience with AI recommendations',
                type: 'laptop',
                position: { top: '0%', left: '10%' },
                rotation: -5,
                zIndex: 3
              },
              {
                title: 'SaaS Dashboard',
                description: 'Analytics platform with real-time data visualization',
                type: 'desktop',
                position: { top: '15%', right: '5%' },
                rotation: 3,
                zIndex: 2
              },
              {
                title: 'Travel Site',
                description: 'Beautiful destination finder with booking system',
                type: 'tablet',
                position: { top: '45%', left: '25%' },
                rotation: -2,
                zIndex: 4
              },
              {
                title: 'Social App',
                description: 'Connect and share with friends worldwide',
                type: 'mobile',
                position: { top: '55%', right: '20%' },
                rotation: 5,
                zIndex: 1
              },
              {
                title: 'Portfolio',
                description: 'Creative showcase for designers and developers',
                type: 'laptop',
                position: { top: '70%', left: '45%' },
                rotation: -3,
                zIndex: 5
              }
            ].map((project, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  ...project.position,
                  transform: `rotate(${project.rotation}deg)`,
                  zIndex: project.zIndex,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = `rotate(${project.rotation}deg) scale(1.05) translateY(-10px)`
                  e.currentTarget.style.zIndex = 10
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = `rotate(${project.rotation}deg) scale(1)`
                  e.currentTarget.style.zIndex = project.zIndex
                }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: project.type === 'mobile' ? '20px' : '16px',
                  padding: project.type === 'mobile' ? '16px' : '24px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  width: project.type === 'mobile' ? '200px' : project.type === 'tablet' ? '280px' : '400px',
                  height: project.type === 'mobile' ? '400px' : project.type === 'tablet' ? '350px' : '250px'
                }}>
                  {/* Mockup Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <div style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px'
                    }} />
                  </div>
                  
                  {/* Mockup Content */}
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    padding: '16px',
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {project.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginBottom: '16px',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: '1.4'
                    }}>
                      {project.description}
                    </div>
                    
                    {/* Sample UI Elements */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{
                        height: '8px',
                        background: 'rgba(124, 58, 237, 0.3)',
                        borderRadius: '4px',
                        width: '80%'
                      }} />
                      <div style={{
                        height: '8px',
                        background: 'rgba(6, 182, 212, 0.3)',
                        borderRadius: '4px',
                        width: '60%'
                      }} />
                      <div style={{
                        height: '8px',
                        background: 'rgba(124, 58, 237, 0.3)',
                        borderRadius: '4px',
                        width: '90%'
                      }} />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                        height: '24px',
                        borderRadius: '6px',
                        flex: 1
                      }} />
                      <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        height: '24px',
                        borderRadius: '6px',
                        width: '40px'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            fontFamily: "'Space Grotesk', sans-serif",
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
                  fontFamily: "'Space Grotesk', sans-serif",
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
            fontFamily: "'Space Grotesk', sans-serif",
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
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  fontFamily: "'Space Grotesk', sans-serif",
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
              fontFamily: "'Space Grotesk', sans-serif",
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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px); }
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
