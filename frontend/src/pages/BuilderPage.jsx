import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, RefreshCw, Moon, Link, Bookmark, Share2, Copy, FileCode, FileText, Brackets, ChevronLeft, Play, Code, Eye, Download, Save, Monitor, Tablet, Smartphone } from 'lucide-react'
import { supabase } from '../lib/supabase'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState([])
  const [files, setFiles] = useState({ 
    html: '', 
    css: '', 
    js: '' 
  })
  const [activeFile, setActiveFile] = useState('html')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('preview')
  const [previewMode, setPreviewMode] = useState('desktop')
  const [projectName, setProjectName] = useState('Untitled Project')
  const [isPro, setIsPro] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    // We now use iframeRef.current.src to load the generated site
    // This effect is kept for backwards compatibility or local preview during streaming if needed
    if (iframeRef.current && files.html && !iframeRef.current.src.includes('/generated/')) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
      
      const combinedHTML = files.html
        .replace('</head>', `<style>
          ${files.css || ''}
        </style></head>`)
        .replace('</body>', `<script>${files.js || ''}</script></body>`)

      doc.open()
      doc.write(combinedHTML)
      doc.close()
    }
  }, [files])

  useEffect(() => {
    const locationPrompt = location.state?.prompt
    const dashboardPrompt = location.state?.enhancedPrompt
    const finalPrompt = dashboardPrompt || locationPrompt
    
    if (finalPrompt) {
      setPrompt(finalPrompt)
      setProjectName(finalPrompt.slice(0, 30) + '...')
      generateCode(finalPrompt)
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateCode = async (promptToUse) => {
    if (!promptToUse || !promptToUse.trim()) return
    setLoading(true)
    setError(null)
    setFiles({ 
      html: '', 
      css: '', 
      js: '' 
    })
    setGeneratedCode([])
    
    try {
      console.log('Starting generation for prompt:', promptToUse, 'Pro mode:', isPro)
      const endpoint = isPro ? '/api/ai/generate-pro' : '/api/ai/generate'
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Full error response:', errorData)
        throw new Error(errorData.error?.message || `Failed to start generation: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedRaw = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            if (!dataStr || dataStr === '[DONE]') continue
            
            try {
              const data = JSON.parse(dataStr)
              if (data.chunk) {
                accumulatedRaw += data.chunk
                setFiles(prev => ({ ...prev, html: accumulatedRaw }))
              }
              if (data.done) {
                setFiles({ html: data.html, css: '', js: '' })
                setGeneratedCode([{ name: 'index.html', content: data.html }])
                
                if (iframeRef.current) {
                  const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
                  doc.open()
                  doc.write(data.html)
                  doc.close()
                }
              }
              if (data.error) {
                console.error('AI Error:', data.error)
              }
            } catch (e) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }

      setSelectedFile('index.html')

      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `I've generated the website based on your request. You can see the preview on the right.`
      }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Error generating code:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!chatInput.trim() || loading) return
    const userMessage = { id: Date.now(), role: 'user', content: chatInput }
    setMessages(prev => [...prev, userMessage])
    generateCode(chatInput)
    setChatInput('')
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--color-page-bg)] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-[var(--header-height)] bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost p-2 rounded-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-[var(--color-border)]" />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-ghost p-2 rounded-md">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="btn-ghost p-2 rounded-md">
            <Download className="w-4 h-4" />
          </button>
          <button className="btn-primary flex items-center gap-2 py-1.5 px-4">
            <Save className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Chat */}
        <div className="w-[350px] flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 && !loading && (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-[var(--color-page-bg)] rounded-full flex items-center justify-center mx-auto">
                  <Brackets className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Describe what you want to change or add to your website.
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-page-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-2xl px-4 py-2.5 space-y-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="relative">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Ask AI to edit..."
                className="input w-full min-h-[80px] pr-20 resize-none"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <button 
                  onClick={() => setIsPro(!isPro)} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px', 
                    padding: '5px 10px', fontSize: '11px', fontWeight: '600', 
                    borderRadius: '6px', border: 'none', cursor: 'pointer', 
                    background: isPro ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#e5e5e5', 
                    color: isPro ? '#ffffff' : '#666666', 
                    transition: 'all 0.2s ease' 
                  }} 
                > 
                  ✦ {isPro ? 'PRO ON' : 'PRO'} 
                </button> 
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || loading}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Preview/Code */}
        <div className="flex-1 flex flex-col bg-[var(--color-page-bg)]">
          <div className="h-12 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-[var(--color-page-bg)] p-1 rounded-md border border-[var(--color-border)]">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'preview'
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'code'
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Code
                </button>
              </div>

              {isPro && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm border border-amber-300/30">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pro</span>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="flex bg-[var(--color-page-bg)] p-1 rounded-md border border-[var(--color-border)]">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-1.5 rounded transition-all ${
                      previewMode === 'desktop'
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    title="Desktop"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-1.5 rounded transition-all ${
                      previewMode === 'tablet'
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    title="Tablet"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-1.5 rounded transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    title="Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-ghost p-1.5 rounded-md">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {error && (
              <div className="absolute top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
            {activeTab === 'preview' ? (
              <div className={`w-full h-full flex justify-center items-start overflow-auto transition-colors duration-300 ${
                previewMode !== 'desktop' ? 'bg-[#f0f0f0] p-8' : 'bg-white'
              }`}>
                <div 
                  className="transition-all duration-300 ease-in-out bg-white overflow-hidden shadow-sm"
                  style={{ 
                    width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '390px',
                    height: previewMode === 'desktop' ? '100%' : '100%',
                    border: previewMode === 'desktop' ? 'none' : '1px solid #d1d5db',
                    borderRadius: previewMode === 'desktop' ? '0' : previewMode === 'tablet' ? '12px' : '24px',
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    sandbox="allow-scripts allow-same-origin"
                    title="Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex bg-[#1e1e1e] overflow-hidden">
                {/* File Explorer Sidebar */}
                <div className="w-[180px] bg-[#252526] border-r border-[#333] flex flex-col py-2">
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Files
                  </div>
                  {[
                    { id: 'html', name: 'index.html', icon: <FileCode className="w-4 h-4 text-orange-400" /> },
                    { id: 'css', name: 'styles.css', icon: <FileText className="w-4 h-4 text-blue-400" /> },
                    { id: 'js', name: 'script.js', icon: <Brackets className="w-4 h-4 text-yellow-400" /> }
                  ].map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setActiveFile(file.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                        activeFile === file.id
                          ? 'bg-[#37373d] text-white border-l-2 border-[var(--color-accent)]'
                          : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200 border-l-2 border-transparent'
                      }`}
                    >
                      {file.icon}
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative group">
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(files[activeFile])
                      }}
                      className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-md border border-gray-700 transition-colors flex items-center gap-2 text-xs"
                      title="Copy Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-6 font-mono text-sm text-gray-300 leading-relaxed selection:bg-gray-700">
                    <pre>
                      <code>{files[activeFile] || '// No code generated yet...'}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage
