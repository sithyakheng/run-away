import React from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050508',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#050508'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)'
          }} />
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white'
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
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 40px',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '700',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          maxWidth: '800px'
        }}>
          Build Apps With Just A Prompt
        </h1>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '48px',
          color: '#a1a1aa',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Describe what you want and Run Away builds it instantly using AI
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              cursor: 'pointer',
              borderRadius: '8px'
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
              padding: '16px 32px',
              fontSize: '18px',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            See Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
