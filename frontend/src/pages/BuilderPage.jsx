import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, RefreshCw, Moon, Link, Bookmark, Share2, Copy, Brackets, ChevronLeft, Play, Code, Eye, Download, Save, Monitor, Tablet, Smartphone } from 'lucide-react'
import { supabase } from '../lib/supabase'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState([])
  const [files, setFiles] = useState({ 
    html: '', 
    css: '', 
    js: '' 
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('preview')
  const [previewMode, setPreviewMode] = useState('desktop')
  const [projectName, setProjectName] = useState('Untitled Project')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [isPro, setIsPro] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)
  const generatedHTMLRef = useRef('')
  const htmlRef = useRef('')
  const cssRef = useRef('')
  const jsRef = useRef('')

  useEffect(() => {
    if (activeTab === 'preview' && iframeRef.current && generatedHTMLRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
      doc.open()
      doc.write(generatedHTMLRef.current)
      doc.close()
    }
  }, [activeTab])

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
    htmlRef.current = ''
    cssRef.current = ''
    jsRef.current = ''
    
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

              if (data.status) {
                setMessages(prev => {
                  const last = prev[prev.length - 1]
                  if (last?.role === 'status') return [...prev.slice(0, -1), { ...last, content: data.status }]
                  return [...prev, { id: Date.now(), role: 'status', content: data.status }]
                })
              }

              if (data.file && data.chunk) {
                if (data.file === 'index.html') {
                  htmlRef.current += data.chunk
                  setFiles(prev => ({ ...prev, html: htmlRef.current }))
                }
                if (data.file === 'styles.css') {
                  cssRef.current += data.chunk
                  setFiles(prev => ({ ...prev, css: cssRef.current }))
                }
                if (data.file === 'script.js') {
                  jsRef.current += data.chunk
                  setFiles(prev => ({ ...prev, js: jsRef.current }))
                }
              }

              if (data.chunk && !data.file) {
                htmlRef.current += data.chunk
                setFiles(prev => ({ ...prev, html: htmlRef.current }))
              }

              if (data.done) {
                console.log('DONE html:', htmlRef.current.length, 'css:', cssRef.current.length, 'js:', jsRef.current.length)
                let combined = ''
                if (data.html) {
                  combined = data.html
                } else {
                  combined = htmlRef.current
                    .replace('</head>', `<style>${cssRef.current}</style></head>`)
                    .replace('</body>', `<script>${jsRef.current}</script></body>`)
                }
                generatedHTMLRef.current = combined
                setGeneratedHTML(combined)
                setActiveTab('preview')
                setTimeout(() => {
                  if (iframeRef.current) {
                    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
                    doc.open()
                    doc.write(combined)
                    doc.close()
                  }
                }, 300)
                setLoading(false)
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: 'Website generated! You can see the preview on the right.' }])
              }

              if (data.error) {
                setError(data.error)
                setLoading(false)
              }
            } catch (e) {}
          }
        }
      }

      setSelectedFile('index.html')
      
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
              <div className="w-full h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
                {/* File Tabs */}
                <div className="flex bg-[#252526] border-b border-[#333] px-2">
                  {[
                    { id: 'index.html', label: 'index.html', icon: 'HTML' },
                    { id: 'styles.css', label: 'styles.css', icon: 'CSS' },
                    { id: 'script.js', label: 'script.js', icon: 'JS' }
                  ].map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file.id)}
                      className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        selectedFile === file.id
                          ? 'border-[var(--color-accent)] text-white bg-[#1e1e1e]'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
                      }`}
                    >
                      <span className={`w-3 h-3 flex items-center justify-center rounded-[2px] text-[8px] font-bold ${
                        file.icon === 'HTML' ? 'bg-orange-500 text-white' : 
                        file.icon === 'CSS' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'
                      }`}>
                        {file.icon[0]}
                      </span>
                      {file.label}
                    </button>
                  ))}
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative group">
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        const content = selectedFile === 'index.html' ? files.html : 
                                      selectedFile === 'styles.css' ? files.css : files.js
                        navigator.clipboard.writeText(content)
                      }}
                      className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-md border border-gray-700 transition-colors flex items-center gap-2 text-xs"
                      title="Copy Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-6 font-mono text-sm text-white leading-relaxed selection:bg-gray-700">
                    <pre>
                      <code>
                        {selectedFile === 'index.html' ? files.html : 
                         selectedFile === 'styles.css' ? files.css : 
                         selectedFile === 'script.js' ? files.js : 
                         '// No code generated yet...'}
                      </code>
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
