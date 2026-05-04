import React, { useState } from 'react'

function IntegrationsSection() {
  const [connecting, setConnecting] = useState(null)

  const integrations = [
    { id: 'supabase', name: 'Supabase', description: 'Database & Auth', icon: '🗄️', color: 'from-green-500 to-emerald-600' },
    { id: 'stripe', name: 'Stripe', description: 'Payments', icon: '💳', color: 'from-purple-500 to-pink-600' },
    { id: 'sendgrid', name: 'SendGrid', description: 'Email', icon: '📧', color: 'from-blue-500 to-cyan-600' },
    { id: 'github', name: 'GitHub', description: 'Version Control', icon: '🐙', color: 'from-gray-700 to-gray-900' },
    { id: 'figma', name: 'Figma', description: 'Design', icon: '🎨', color: 'from-orange-500 to-red-600' },
    { id: 'vercel', name: 'Vercel', description: 'Hosting', icon: '▲', color: 'from-black to-gray-800' },
    { id: 'slack', name: 'Slack', description: 'Communication', icon: '💬', color: 'from-purple-600 to-pink-600' },
    { id: 'notion', name: 'Notion', description: 'Documentation', icon: '📖', color: 'from-gray-800 to-gray-900' }
  ]

  const handleConnect = async (integrationId) => {
    setConnecting(integrationId)
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(null)
      console.log(`Connected to ${integrationId}`)
    }, 2000)
  }

  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-text-primary mb-8">Integrations</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="card hover-scale cursor-pointer text-center group"
              style={{ width: '200px', height: '160px' }}
            >
              <div className="flex flex-col items-center justify-center h-full p-4">
                {/* Integration Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${integration.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-all-200`}>
                  {integration.icon}
                </div>

                {/* Integration Name */}
                <h4 className="font-semibold text-text-primary text-sm mb-1">
                  {integration.name}
                </h4>

                {/* Integration Description */}
                <p className="text-xs text-text-tertiary mb-4">
                  {integration.description}
                </p>

                {/* Connect Button */}
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={connecting === integration.id}
                  className="btn-primary text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting === integration.id ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Browse More Link */}
        <div className="text-center mt-8">
          <button className="text-primary-accent hover:underline font-medium">
            Browse All Integrations →
          </button>
        </div>
      </div>
    </section>
  )
}

export default IntegrationsSection
