import groq from '../lib/groqClient.js'

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

    const systemPrompt = `You are an elite web designer who builds stunning, modern websites. Generate a complete single-file HTML website.

DESIGN RULES — follow these exactly:
- Use dark elegant color palettes: deep blacks (#0a0a0a, #111111), rich whites (#f5f5f5, #ffffff), and ONE tasteful accent color that fits the brand (gold for luxury, emerald for nature, blue for tech, etc)
- NO bright random colors. NO blue/yellow combos. NO childish gradients
- Use Google Fonts — import a premium font like Playfair Display, Inter, or DM Sans
- Use Font Awesome 6 from cdnjs for icons
- Hero section: full viewport height, dark background, large bold headline, subtle gradient overlay, CTA button
- Glassmorphism cards where appropriate: backdrop-filter: blur(10px), semi-transparent backgrounds
- Smooth scroll animations using Intersection Observer
- Sticky navbar that gets a blur/dark background on scroll
- Sections: Hero, About, Services/Rooms/Features, Testimonials, Contact, Footer
- Real professional copywriting — no Lorem Ipsum
- Mobile responsive with media queries
- CSS variables for all colors defined in :root
- Subtle micro-animations on hover (transform, opacity transitions)
- The site must look like it was built by a $15,000 agency

TECHNICAL RULES:
- All CSS inside a single`

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

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI Generation Error:', error)
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate code' })}\n\n`)
    res.end()
  }
}