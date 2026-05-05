import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #3b82f6 50%, #a855f7 75%, #6366f1 100%)',
            animation: 'gradientShift 8s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 
          className="text-6xl md:text-7xl font-bold mb-6 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            animation: 'textGradient 3s ease-in-out infinite'
          }}
        >
          Run Away
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 max-w-2xl text-gray-300">
          Build Full Stack Apps With Just A Prompt
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 text-lg font-semibold text-white rounded-lg hover-scale cursor-pointer border-none transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              animation: 'glow 2s ease-in-out infinite'
            }}
          >
            Start Building Free
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 text-lg font-semibold rounded-lg hover-scale cursor-pointer transition-all duration-300"
            style={{
              background: 'transparent',
              border: '2px solid #8b5cf6',
              color: '#8b5cf6'
            }}
          >
            Login
          </button>
        </div>

        {/* Features section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div 
            className="p-6 rounded-xl backdrop-blur-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2 text-white">AI Powered</h3>
            <p className="text-gray-300 text-sm">Describe your app and watch it get built</p>
          </div>
          
          <div 
            className="p-6 rounded-xl backdrop-blur-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-white">Full Stack Ready</h3>
            <p className="text-gray-300 text-sm">HTML CSS JS generated instantly</p>
          </div>
          
          <div 
            className="p-6 rounded-xl backdrop-blur-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2 text-white">Save and Share</h3>
            <p className="text-gray-300 text-sm">Save projects and share with anyone</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <h4 className="text-2xl font-bold mb-2" style={{ color: '#8b5cf6' }}>Run Away</h4>
        <p className="text-gray-400 text-sm">Build anything, anywhere, anytime</p>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { transform: translateX(0%) scale(1); }
          25% { transform: translateX(-10%) scale(1.1); }
          50% { transform: translateX(0%) scale(1); }
          75% { transform: translateX(10%) scale(1.1); }
        }
        
        @keyframes textGradient {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(20px) translateX(-20px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(139, 92, 246, 0.8); }
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

export default LandingPage
