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

BACKGROUND & VISUAL RULES: 
- Hero section must always have a real background image using Unsplash URLs like: background-image: url('https://images.unsplash.com/photo-XXXXXXXXX?w=1600&q=80') — pick a relevant high quality photo that matches the website topic (hotel, restaurant, portfolio, etc) 
- Always add a dark overlay on top of hero images: background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)) 
- Use background-size: cover and background-position: center on hero 
- Other sections should have subtle background colors, not plain white or plain black — use very dark grays (#0f0f0f, #111, #1a1a1a) alternating with slightly lighter (#181818, #1e1e1e) 
- Cards must have background: rgba(255,255,255,0.05) with border: 1px solid rgba(255,255,255,0.1) and border-radius: 12px 
- Add box-shadow: 0 8px 32px rgba(0,0,0,0.3) to cards 
- Testimonial section should have a different subtle background 
- Footer should be very dark #080808 with subtle top border 
  
TYPOGRAPHY RULES: 
- Hero headline must be at least 64px font size 
- Use letter-spacing: -0.02em on large headings 
- Subheadings use the accent color 
- Body text color should be #a0a0a0 not pure white 
  
ANIMATION RULES: 
- Add a subtle parallax effect on the hero background using JavaScript scroll event 
- Cards fade in from below using Intersection Observer with translateY(30px) to translateY(0)

TECHNICAL RULES:
- All CSS inside a single <style> tag.
- All JavaScript inside a single <script> tag.
- Return ONLY the raw HTML code starting with <!DOCTYPE html>.
- Do not include any explanations or markdown code blocks.`

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