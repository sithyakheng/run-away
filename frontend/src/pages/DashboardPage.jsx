import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [userPrompt, setUserPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return
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
            content: `You are a professional prompt engineer. Take this simple prompt and enhance it into a detailed professional prompt for building a stunning website. Return ONLY the enhanced prompt, nothing else, no quotes, no explanation.\n\nUser prompt: "${userPrompt}"` 
          }],
          max_tokens: 500
        })
      })
      const data = await response.json()
      const enhanced = data.choices[0].message.content
      setEnhancedPrompt(enhanced)
      setShowModal(true)
    } catch (error) {
      navigate('/builder', { state: { prompt: userPrompt } })
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #eee' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Run Away</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>{supabase.auth.getUser?.()?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px', paddingBottom: '40px' }}>
        <span style={{ background: '#e8f4ff', color: '#0070f3', borderRadius: '20px', padding: '4px 16px', fontSize: '13px', marginBottom: '24px' }}>NEW</span>
        <h1 style={{ fontSize: '48px', fontWeight: '800', textAlign: 'center', marginBottom: '12px', maxWidth: '700px' }}>
          Don't just think it. Run Away with it.
        </h1>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
          Transform your ideas into reality with AI-powered development
        </p>

        <div style={{ width: '100%', maxWidth: '700px', border: '1px solid #ddd', borderRadius: '16px', padding: '16px', background: '#fafafa' }}>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
            placeholder="Describe what you want to build..."
            style={{ width: '100%', minHeight: '100px', border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', resize: 'none', fontFamily: 'sans-serif' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={handleGenerate}
              disabled={isEnhancing || !userPrompt.trim()}
              style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '15px', cursor: 'pointer', opacity: isEnhancing ? 0.7 : 1 }}
            >
              {isEnhancing ? '✨ Enhancing...' : '✈ Generate'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['AI Company Showcase', 'AI Personal Brand Site', 'AI SaaS Waitlist Site'].map(p => (
            <button key={p} onClick={() => setUserPrompt(p)} style={{ border: '1px solid #ddd', borderRadius: '20px', padding: '8px 16px', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '8px' }}>✨ Enhanced Prompt</h2>
            <p style={{ color: '#999', fontSize: '13px', marginBottom: '16px' }}>Original: {userPrompt}</p>
            <textarea
              value={enhancedPrompt}
              onChange={(e) => setEnhancedPrompt(e.target.value)}
              style={{ width: '100%', minHeight: '150px', border: '1px solid #ddd', borderRadius: '10px', padding: '12px', fontSize: '14px', fontFamily: 'sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate('/builder', { state: { prompt: userPrompt } })}
                style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', background: '#fff' }}
              >
                Use Original Instead
              </button>
              <button
                onClick={() => navigate('/builder', { state: { prompt: enhancedPrompt } })}
                style={{ background: '#0070f3', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer' }}
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
