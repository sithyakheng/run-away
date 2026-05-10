import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(' ')

// VoiceRecorder Component
const VoiceRecorder = ({ isRecording, onStartRecording, onStopRecording, visualizerBars = 32 }) => {
  const [time, setTime] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      onStartRecording()
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      onStopRecording(time)
      setTime(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording, time, onStartRecording, onStopRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full transition-all duration-300 py-3',
        isRecording ? 'opacity-100' : 'opacity-0 h-0'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-gray-600">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-gray-400 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ImageViewDialog Component
const ImageViewDialog = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-[90vw] md:max-w-[800px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-all"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        <img
          src={imageUrl}
          alt="Full preview"
          className="w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  )
}

// Main DashboardPromptInput Component
const DashboardPromptInput = forwardRef(({ onSend = () => {}, isLoading = false, placeholder = 'Describe what you want to build...', className }, ref) => {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showThink, setShowThink] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const uploadInputRef = useRef(null)
  const promptBoxRef = useRef(null)

  const handleToggleChange = (value) => {
    if (value === 'search') {
      setShowSearch((prev) => !prev)
      setShowThink(false)
    } else if (value === 'think') {
      setShowThink((prev) => !prev)
      setShowSearch(false)
    }
  }

  const handleCanvasToggle = () => setShowCanvas((prev) => !prev)

  const isImageFile = (file) => file.type.startsWith('image/')

  const processFile = (file) => {
    if (!isImageFile(file)) {
      console.log('Only image files are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large (max 10MB)')
      return
    }
    setFiles([file])
    const reader = new FileReader()
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result })
    reader.readAsDataURL(file)
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => isImageFile(file))
    if (imageFiles.length > 0) processFile(imageFiles[0])
  }, [])

  const handleRemoveFile = (index) => {
    const fileToRemove = files[index]
    if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({})
    setFiles([])
  }

  const openImageModal = (imageUrl) => setSelectedImage(imageUrl)

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          e.preventDefault()
          processFile(file)
          break
        }
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      let messagePrefix = ''
      if (showSearch) messagePrefix = '[Search: '
      else if (showThink) messagePrefix = '[Think: '
      else if (showCanvas) messagePrefix = '[Canvas: '
      const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input
      onSend(formattedInput, files)
      setInput('')
      setFiles([])
      setFilePreviews({})
    }
  }

  const handleStartRecording = () => console.log('Started recording')

  const handleStopRecording = (duration) => {
    console.log(`Stopped recording after ${duration} seconds`)
    setIsRecording(false)
    onSend(`[Voice message - ${duration} seconds]`, [])
  }

  const hasContent = input.trim() !== '' || files.length > 0

  return (
    <>
      <div
        ref={ref || promptBoxRef}
        className={cn(
          'w-full bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 ease-in-out',
          isRecording && 'border-red-300',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* File previews */}
        {files.length > 0 && !isRecording && (
          <div className="flex flex-wrap gap-2 p-4 pb-2 transition-all duration-300">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith('image/') && filePreviews[file.name] && (
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                    onClick={() => openImageModal(filePreviews[file.name])}
                  >
                    <img
                      src={filePreviews[file.name]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile(index)
                      }}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <div
          className={cn(
            'transition-all duration-300',
            isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'
          )}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder={
              showSearch
                ? 'Search the web...'
                : showThink
                ? 'Think deeply...'
                : showCanvas
                ? 'Create on canvas...'
                : placeholder
            }
            className="w-full px-4 py-3 text-base text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 resize-none min-h-[44px]"
            rows={1}
            disabled={isLoading || isRecording}
            style={{
              minHeight: '44px',
              maxHeight: '240px'
            }}
          />
        </div>

        {/* Voice Recorder */}
        {isRecording && (
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        )}

        {/* Action Icons */}
        <div className="flex items-center justify-between gap-2 p-4 pt-2">
          {/* Left Icons */}
          <div
            className={cn(
              'flex items-center gap-2 transition-opacity duration-300',
              isRecording ? 'opacity-0 invisible h-0' : 'opacity-100 visible'
            )}
          >
            {/* Upload Icon */}
            <button
              onClick={() => uploadInputRef.current?.click()}
              className="flex h-8 w-8 text-gray-400 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-600"
              disabled={isRecording}
              title="Upload image"
            >
              <Paperclip className="h-4 w-4 transition-colors" />
              <input
                ref={uploadInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0])
                  if (e.target) e.target.value = ''
                }}
                accept="image/*"
              />
            </button>

            {/* Mode Toggles */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                onClick={() => handleToggleChange('search')}
                className={cn(
                  'rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8',
                  showSearch
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'
                )}
                title="Search mode"
              >
                <motion.div
                  animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                  whileHover={{ rotate: showSearch ? 360 : 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <Globe className={cn('w-4 h-4', showSearch ? 'text-blue-600' : 'text-inherit')} />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs overflow-hidden whitespace-nowrap text-blue-600"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Think */}
              <button
                type="button"
                onClick={() => handleToggleChange('think')}
                className={cn(
                  'rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8',
                  showThink
                    ? 'bg-purple-50 border-purple-200 text-purple-600'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'
                )}
                title="Think mode"
              >
                <motion.div
                  animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                  whileHover={{ rotate: showThink ? 360 : 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <BrainCog className={cn('w-4 h-4', showThink ? 'text-purple-600' : 'text-inherit')} />
                </motion.div>
                <AnimatePresence>
                  {showThink && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs overflow-hidden whitespace-nowrap text-purple-600"
                    >
                      Think
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Canvas */}
              <button
                type="button"
                onClick={handleCanvasToggle}
                className={cn(
                  'rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8',
                  showCanvas
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-600'
                )}
                title="Canvas mode"
              >
                <motion.div
                  animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                  whileHover={{ rotate: showCanvas ? 360 : 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <Code2 className={cn('w-4 h-4', showCanvas ? 'text-orange-600' : 'text-inherit')} />
                </motion.div>
                <AnimatePresence>
                  {showCanvas && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs overflow-hidden whitespace-nowrap text-orange-600"
                    >
                      Canvas
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Send/Record Button */}
          <button
            className={cn(
              'h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center',
              isRecording
                ? 'bg-transparent hover:bg-gray-100 text-red-500 hover:text-red-600'
                : hasContent
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
            )}
            onClick={() => {
              if (isRecording) setIsRecording(false)
              else if (hasContent) handleSubmit()
              else setIsRecording(true)
            }}
            disabled={isLoading && !hasContent}
            title={
              isLoading
                ? 'Stop generation'
                : isRecording
                ? 'Stop recording'
                : hasContent
                ? 'Send message'
                : 'Voice message'
            }
          >
            {isLoading ? (
              <Square className="h-4 w-4 fill-gray-900 animate-pulse" />
            ) : isRecording ? (
              <StopCircle className="h-5 w-5 text-red-500" />
            ) : hasContent ? (
              <ArrowUp className="h-4 w-4 text-white" />
            ) : (
              <Mic className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
})

DashboardPromptInput.displayName = 'DashboardPromptInput'

export { DashboardPromptInput }
