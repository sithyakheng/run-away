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

    const systemPrompt = `You are a world-class web developer at a top agency like Awwwards. Generate a stunning, professional website as a SINGLE self-contained HTML file.

CRITICAL RULES:
- ALL CSS must be inside a <style> tag in the <head>.
- ALL JavaScript must be inside a <script> tag just before the closing </body> tag.
- NO external file references for CSS or JS (no styles.css, no script.js).
- NEVER use href="/" or any path-based links.
- ALL links must use href="#section-id" only.
- Every section must have a matching id attribute.
- Return ONLY the raw HTML code. Do NOT wrap it in JSON. Do NOT include markdown code blocks (no \`\`\`html).

DESIGN REQUIREMENTS:
- Import Google Fonts with link tag in HTML
- Import Font Awesome 6 from cdnjs in HTML
- Use CSS variables for theming inside the <style> tag
- Modern gradients, glassmorphism, animations
- Mobile responsive with media queries
- Hero section with stunning typography
- Scroll reveal animations using Intersection Observer in the <script> tag
- Sticky navbar with blur effect on scroll in the <script> tag
- Smooth scroll behavior
- Professional realistic content no Lorem Ipsum
- Make it look like a $10,000 agency website`

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