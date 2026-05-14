import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, RefreshCw, Moon, Link, Bookmark, Share2, Copy, FileCode, FileText, Brackets, ChevronLeft, Play, Code, Eye, Download, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'

function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState([])
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('preview')
  const [projectName, setProjectName] = useState('Untitled Project')
  const navigate = useNavigate()
  const location = useLocation()
  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)
  const [previewKey, setPreviewKey] = useState(0)

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
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse })
      })
      const data = await response.json()
      const files = data.files || []

      const cssFile = files.find(f => f.name === 'styles.css')
      const jsFile = files.find(f => f.name === 'script.js')
      const htmlFile = files.find(f => f.name === 'index.html')

      let combinedHTML = htmlFile?.content || ''
      if (cssFile) combinedHTML = combinedHTML.replace('<link rel="stylesheet" href="styles.css">', `<style>${cssFile.content}</style>`)
      if (jsFile) combinedHTML = combinedHTML.replace('<script src="script.js" defer></script>', `<script>${jsFile.content}</script>`)

      setGeneratedHTML(combinedHTML)
      setGeneratedCode(files)
      setPreviewKey(prev => prev + 1)
      setSelectedFile(htmlFile?.name || null)

      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `I've generated the website based on your request. You can see the preview on the right.`
      }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Error generating code:', error)
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
                className="input w-full min-h-[80px] pr-10 resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || loading}
                className="absolute right-2 bottom-2 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Content: Preview/Code */}
        <div className="flex-1 flex flex-col bg-[var(--color-page-bg)]">
          <div className="h-12 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4 justify-between">
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

            <div className="flex items-center gap-2">
              <button className="btn-ghost p-1.5 rounded-md">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' ? (
              <div className="w-full h-full bg-white shadow-inner">
                <iframe
                  key={previewKey}
                  ref={iframeRef}
                  srcDoc={generatedHTML}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#1e1e1e] overflow-auto p-4 font-mono text-sm text-gray-300">
                <pre>
                  {generatedCode.map(file => (
                    <div key={file.name} className="mb-8">
                      <div className="text-[var(--color-text-muted)] mb-2 text-xs uppercase tracking-wider border-b border-gray-800 pb-1 flex justify-between">
                        <span>{file.name}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(file.content)}
                          className="hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <code>{file.content}</code>
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage
