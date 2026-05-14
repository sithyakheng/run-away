import React, { useState, useRef, useEffect, useCallback, forwardRef, createContext, useContext } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(' ')

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 10px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-text-muted);
  }
`

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

// Textarea Component
const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none',
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] shadow-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Dialog Components
const Dialog = DialogPrimitive.Root
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-xl',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[var(--color-hover)] p-2 hover:bg-[var(--color-border)] transition-all">
        <X className="h-4 w-4 text-[var(--color-text-secondary)]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-medium leading-none tracking-tight text-[var(--color-text-primary)]', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Button Component
const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-[var(--color-accent)] text-white hover:opacity-90',
    outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-hover)] text-[var(--color-text-primary)]',
    ghost: 'bg-transparent hover:bg-[var(--color-hover)] text-[var(--color-text-secondary)]',
  }
  const sizeClasses = {
    default: 'h-9 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-6',
    icon: 'h-8 w-8 rounded-md',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-md',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

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
        <span className="font-mono text-sm text-[var(--color-text-secondary)]">{formatTime(time)}</span>
      </div>
      <div className="w-full h-8 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-[var(--color-border)] animate-pulse"
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
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-none bg-transparent shadow-none p-0 overflow-hidden">
        <div className="relative w-full aspect-square flex items-center justify-center bg-black/5 rounded-xl overflow-hidden">
          <img src={imageUrl} alt="Uploaded file" className="max-w-full max-h-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// PromptInputBox Context
const PromptInputBoxContext = createContext(null)

const usePromptInputBox = () => {
  const context = useContext(PromptInputBoxContext)
  if (!context) {
    throw new Error('usePromptInputBox must be used within a PromptInputBoxProvider')
  }
  return context
}

export const PromptInputBox = forwardRef(
  (
    {
      onSend,
      isLoading = false,
      placeholder = 'How can I help you today?',
      className,
      showUpload = true,
      showVoice = true,
      showGlobe = true,
      showBrain = true,
      showCode = true,
      ...props
    },
    ref
  ) => {
    const [input, setInput] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [attachments, setAttachments] = useState([])
    const [previewImage, setPreviewImage] = useState(null)
    const [webSearchEnabled, setWebSearchEnabled] = useState(false)
    const [deepReasoningEnabled, setDeepReasoningEnabled] = useState(false)
    const [codeInterpreterEnabled, setCodeInterpreterEnabled] = useState(false)
    const textareaRef = useRef(null)
    const fileInputRef = useRef(null)

    const adjustTextareaHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
      }
    }, [])

    useEffect(() => {
      adjustTextareaHeight()
    }, [input, adjustTextareaHeight])

    const handleInputChange = (e) => {
      setInput(e.target.value)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const handleSend = () => {
      if ((input.trim() || attachments.length > 0) && !isLoading) {
        onSend(input, attachments)
        setInput('')
        setAttachments([])
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    }

    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files || [])
      const newAttachments = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      }))
      setAttachments((prev) => [...prev, ...newAttachments])
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeAttachment = (id) => {
      setAttachments((prev) => {
        const item = prev.find((a) => a.id === id)
        if (item) URL.revokeObjectURL(item.url)
        return prev.filter((a) => a.id !== id)
      })
    }

    const handleVoiceStart = () => {
      console.log('Recording started...')
    }

    const handleVoiceStop = (duration) => {
      console.log(`Recording stopped. Duration: ${duration}s`)
      setIsRecording(false)
    }

    return (
      <TooltipProvider>
        <div
          className={cn(
            'relative w-full transition-all duration-300 rounded-xl border bg-[var(--color-surface)] shadow-sm',
            isFocused ? 'border-[var(--color-text-muted)]' : 'border-[var(--color-border)]',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <PromptInputBoxContext.Provider
            value={{
              input,
              setInput,
              isRecording,
              setIsRecording,
              attachments,
              setAttachments,
              webSearchEnabled,
              setWebSearchEnabled,
              deepReasoningEnabled,
              setDeepReasoningEnabled,
              codeInterpreterEnabled,
              setCodeInterpreterEnabled,
            }}
          >
            <div className="flex flex-col w-full">
              {/* Voice Recorder Overlay */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <VoiceRecorder
                      isRecording={isRecording}
                      onStartRecording={handleVoiceStart}
                      onStopRecording={handleVoiceStop}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attachments Preview */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 p-3 pb-0"
                  >
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="group relative h-12 w-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-hover)] overflow-hidden"
                      >
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover cursor-pointer"
                            onClick={() => setPreviewImage(file.url)}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Paperclip className="h-4 w-4 text-[var(--color-text-secondary)]" />
                          </div>
                        )}
                        <button
                          onClick={() => removeAttachment(file.id)}
                          className="absolute -right-1 -top-1 rounded-full bg-white border border-[var(--color-border)] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="h-3 w-3 text-[var(--color-text-primary)]" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Input Area */}
              <div className="flex items-end p-2 gap-1">
                {showUpload && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file</TooltipContent>
                  </Tooltip>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="min-h-[44px] py-2.5"
                />

                <div className="flex items-center gap-1 mb-1">
                  {showVoice && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'text-[var(--color-text-secondary)] transition-all',
                            isRecording && 'text-red-500 bg-red-50'
                          )}
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isRecording ? 'Stop recording' : 'Voice input'}</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className={cn(
                          'rounded-full transition-all duration-300',
                          input.trim() || attachments.length > 0
                            ? 'bg-[var(--color-accent)] text-white scale-100'
                            : 'bg-[var(--color-hover)] text-[var(--color-text-muted)] scale-90'
                        )}
                        onClick={handleSend}
                        disabled={isLoading || (!input.trim() && attachments.length === 0)}
                      >
                        {isLoading ? (
                          <StopCircle className="h-5 w-5 animate-pulse" />
                        ) : (
                          <ArrowUp className="h-5 w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Bottom Actions Area */}
              <div className="flex items-center justify-between p-2 pt-0 border-t border-[var(--color-border)]/50">
                <div className="flex items-center gap-1">
                  {showGlobe && (
                    <ActionButton
                      icon={<Globe className="h-3.5 w-3.5" />}
                      label="Web Search"
                      active={webSearchEnabled}
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                    />
                  )}
                  {showBrain && (
                    <ActionButton
                      icon={<BrainCog className="h-3.5 w-3.5" />}
                      label="Deep Reasoning"
                      active={deepReasoningEnabled}
                      onClick={() => setDeepReasoningEnabled(!deepReasoningEnabled)}
                    />
                  )}
                  {showCode && (
                    <ActionButton
                      icon={<Code2 className="h-3.5 w-3.5" />}
                      label="Code Interpreter"
                      active={codeInterpreterEnabled}
                      onClick={() => setCodeInterpreterEnabled(!codeInterpreterEnabled)}
                    />
                  )}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] px-2 font-medium">
                  Press Enter to send
                </div>
              </div>
            </div>
          </PromptInputBoxContext.Provider>
        </div>

        <ImageViewDialog imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      </TooltipProvider>
    )
  }
)
PromptInputBox.displayName = 'PromptInputBox'

const ActionButton = ({ icon, label, active, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all border',
          active
            ? 'bg-[var(--color-accent)]/5 border-[var(--color-accent)]/20 text-[var(--color-accent)]'
            : 'bg-transparent border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]'
        )}
      >
        {icon}
        <span>{label}</span>
      </button>
    </TooltipTrigger>
    <TooltipContent side="bottom">{label}</TooltipContent>
  </Tooltip>
)
