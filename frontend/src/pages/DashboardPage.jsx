import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PromptInputBox } from '../components/ui/ai-prompt-box'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [userPrompt, setUserPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleGenerate = async (messagePrompt) => {
    const promptToUse = messagePrompt || userPrompt
    if (!promptToUse.trim()) return
    setIsEnhancing(true)
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: `Enhance this prompt for building a website: "${promptToUse}". Return ONLY the enhanced prompt.` 
          }],
          max_tokens: 500
        })
      })
      const data = await response.json()
      const enhanced = data.choices[0].message.content
      setEnhancedPrompt(enhanced)
      setShowModal(true)
    } catch (error) {
      navigate('/builder', { state: { prompt: promptToUse } })
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const suggestions = [
    { emoji: '🏨', label: 'Hotel Website' },
    { emoji: '🛒', label: 'E-commerce Store' },
    { emoji: '💼', label: 'Portfolio' },
    { emoji: '🚀', label: 'SaaS Landing' },
    { emoji: '🍕', label: 'Restaurant' }
  ]

  const recentProjects = [
    { name: 'E-commerce Dashboard', date: '2 hours ago' },
    { name: 'Portfolio Website', date: 'Yesterday' },
    { name: 'Restaurant Landing', date: '3 days ago' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '20px', color: '#fff' }}>
          🚀 Run Away
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>{supabase.auth.getUser?.()?.email}</span>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.2)', 
              borderRadius: '8px', 
              padding: '8px 20px', 
              cursor: 'pointer', 
              color: '#fff',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseOut={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px', paddingBottom: '60px', padding: '0 20px' }}>
        {/* Glowing Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px',
          background: 'rgba(139, 92, 246, 0.15)', 
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#a78bfa', 
          borderRadius: '20px', 
          padding: '6px 16px', 
          fontSize: '13px', 
          marginBottom: '32px',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
        }}>
          ✨ Powered by Groq AI
        </div>

        {/* Gradient Heading */}
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: '800', 
          textAlign: 'center', 
          marginBottom: '16px', 
          maxWidth: '900px',
          background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.1'
        }}>
          What will you build today?
        </h1>

        {/* Subtitle */}
        <p style={{ 
          color: '#666', 
          marginBottom: '48px', 
          fontSize: '18px',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Turn your ideas into stunning websites in seconds
        </p>

        {/* Prompt Input Area */}
        <div style={{ width: '100%', maxWidth: '700px', marginBottom: '32px' }}>
          <PromptInputBox
            onSend={(message) => handleGenerate(message)}
            isLoading={isEnhancing}
            placeholder="Describe what you want to build..."
          />
        </div>

        {/* Quick Suggestions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setUserPrompt(s.label)}
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '25px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#ccc',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
                e.target.style.background = 'rgba(139, 92, 246, 0.1)'
                e.target.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)'
                e.target.style.color = '#fff'
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.15)'
                e.target.style.background = 'rgba(255,255,255,0.03)'
                e.target.style.boxShadow = 'none'
                e.target.style.color = '#ccc'
              }}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Projects Section */}
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 20px' }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '24px' 
          }}>
            Recent Projects
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px' 
          }}>
            {recentProjects.map((project, i) => (
              <div
                key={i}
                style={{
                  background: '#111',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '24px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Thumbnail Placeholder */}
                <div style={{
                  width: '100%',
                  height: '120px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                  <span style={{ color: '#444', fontSize: '32px' }}>📐</span>
                </div>

                {/* Project Info */}
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '8px' 
                }}>
                  {project.name}
                </h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                  {project.date}
                </p>

                {/* Open Button */}
                <button style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#a78bfa',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(139, 92, 246, 0.2)'
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(139, 92, 246, 0.1)'
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                }}
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Prompt Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000, 
          backdropFilter: 'blur(8px)' 
        }}>
          <div style={{ 
            background: '#15151a', 
            borderRadius: '20px', 
            padding: '40px', 
            maxWidth: '600px', 
            width: '90%', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '8px', 
              fontSize: '24px',
              fontWeight: '700' 
            }}>
              ✨ Enhanced Prompt
            </h2>
            <p style={{ 
              color: '#666', 
              fontSize: '13px', 
              marginBottom: '24px' 
            }}>
              Original: {userPrompt}
            </p>
            
            <textarea
              value={enhancedPrompt}
              onChange={(e) => setEnhancedPrompt(e.target.value)}
              style={{ 
                width: '100%', 
                minHeight: '180px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                fontSize: '14px', 
                fontFamily: 'system-ui, sans-serif', 
                resize: 'vertical', 
                boxSizing: 'border-box',
                background: '#0a0a0f',
                color: '#fff',
                outline: 'none'
              }}
            />
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '24px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => navigate('/builder', { state: { prompt: userPrompt } })}
                style={{ 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  borderRadius: '10px', 
                  padding: '12px 24px', 
                  cursor: 'pointer', 
                  background: 'transparent',
                  color: '#888',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.target.style.color = '#fff'
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.target.style.color = '#888'
                }}
              >
                Use Original
              </button>
              <button
                onClick={() => navigate('/builder', { state: { prompt: enhancedPrompt } })}
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '12px 24px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)'
                }}
              >
                Use Enhanced ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
