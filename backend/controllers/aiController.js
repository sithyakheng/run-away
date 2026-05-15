import groq from '../lib/groqClient.js'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const commonRules = `ICON LIBRARIES: 
- Font Awesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Bootstrap Icons: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
- Lucide: <script src="https://unpkg.com/lucide@latest"></script>

FONT SYSTEM: 
Use Google Fonts. Pick a Display font for headings (e.g., Playfair Display, Space Grotesk, Syne) and a Body font for UI (e.g., Inter, Outfit, Poppins).

LOGO: Create a styled text-based logo in the navbar using the display font and an icon.`


function parseMultiFile(raw) {
  const htmlMatch = raw.match(/===HTML===\n([\s\S]*?)(?====CSS===|$)/)
  const cssMatch = raw.match(/===CSS===\n([\s\S]*?)(?====JS===|$)/)
  const jsMatch = raw.match(/===JS===\n([\s\S]*?)$/)
  
  return {
    html: htmlMatch ? htmlMatch[1].trim() : '',
    css: cssMatch ? cssMatch[1].trim() : '',
    js: jsMatch ? jsMatch[1].trim() : ''
  }
}

export const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body
    console.log('generateCode called with prompt:', prompt)
    if (!prompt) {
      return res.status(400).json({ error: { message: 'Prompt is required' } })
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const systemPrompt = `You are an elite web designer. Generate a stunning, modern 3-file website.
Always return output with these exact delimiters:
===HTML===
(index.html linking to styles.css and script.js)
===CSS===
(styles.css with CSS variables, responsive design, and glassmorphism)
===JS===
(script.js for animations and interactions)

DESIGN RULES:
- Use a dark theme: dark background, light accent color, white body text.
- Hero section: Fullscreen, high-quality Unsplash background image with dark overlay, bold typography.
- Layout: Sticky navbar, Hero, About, Features/Services, Testimonials, Contact, Footer.
- Styling: Generous spacing, hover effects, subtle animations (Intersection Observer for fade-ins).
- Content: Real professional copy, no Lorem Ipsum.
${commonRules}`


    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000,
      stream: true
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullResponse += content
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`)
      }
    }

    const files = parseMultiFile(fullResponse)
    const projectId = uuidv4()
    const projectDir = path.join(process.cwd(), 'generated', projectId)
    
    fs.mkdirSync(projectDir, { recursive: true })
    fs.writeFileSync(path.join(projectDir, 'index.html'), files.html)
    fs.writeFileSync(path.join(projectDir, 'styles.css'), files.css)
    fs.writeFileSync(path.join(projectDir, 'script.js'), files.js)

    res.write('data: ' + JSON.stringify({ done: true, projectId, files }) + '\n\n')
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI Generation Error:', error)
    console.error('Full error:', JSON.stringify(error, null, 2))
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate code' })}\n\n`)
    res.end()
  }
}

export const generateProCode = async (req, res) => {
  try {
    const { prompt } = req.body
    console.log('generateProCode called with prompt:', prompt)
    if (!prompt) {
      return res.status(400).json({ error: { message: 'Prompt is required' } })
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const proSystemPrompt = `You are an award-winning UI/UX designer. Generate a world-class 3-file website.
Always return output with these exact delimiters:
===HTML===
===CSS===
===JS===

UPGRADED RULES:
- Advanced Layouts: Bento grids, horizontal scroll sections, or staggered masonry.
- Premium Feel: Custom CSS cursor, scroll progress bar, glassmorphism (:blur), and SVG section dividers.
- Animations: Text split-animate-in, parallax backgrounds, and smooth page transitions.
- Quality: Pixel-perfect spacing, high-end Unsplash imagery, and complex micro-interactions.
${commonRules}`

    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: proSystemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000,
      stream: true
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullResponse += content
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`)
      }
    }

    const files = parseMultiFile(fullResponse)
    const projectId = uuidv4()
    const projectDir = path.join(process.cwd(), 'generated', projectId)
    
    fs.mkdirSync(projectDir, { recursive: true })
    fs.writeFileSync(path.join(projectDir, 'index.html'), files.html)
    fs.writeFileSync(path.join(projectDir, 'styles.css'), files.css)
    fs.writeFileSync(path.join(projectDir, 'script.js'), files.js)

    res.write('data: ' + JSON.stringify({ done: true, projectId, files }) + '\n\n')
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI PRO Generation Error:', error)
    console.error('Full error:', JSON.stringify(error, null, 2))
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate pro code' })}\n\n`)
    res.end()
  }
}
