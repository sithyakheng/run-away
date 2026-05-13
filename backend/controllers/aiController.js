import groq from '../lib/groqClient.js'

export const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ error: { message: 'Prompt is required' } })
    }

    const systemPrompt = `You are a world-class web developer at a top agency like Awwwards. Generate a stunning, professional website split into 3 separate files.

CRITICAL NAVIGATION RULES:
- NEVER use href="/" or any path-based links
- ALL links must use href="#section-id" only
- Every section must have a matching id attribute

Return ONLY a valid JSON object in this exact format:
{
  "files": [
    {
      "name": "index.html",
      "content": "<!DOCTYPE html>...</html>"
    },
    {
      "name": "styles.css",
      "content": "/* CSS here */"
    },
    {
      "name": "script.js",
      "content": "// JS here"
    }
  ],
  "description": "Brief description of what was built"
}

For the HTML file, link to styles.css and script.js like this:
<link rel="stylesheet" href="styles.css">
<script src="script.js" defer></script>

DESIGN REQUIREMENTS:
- Import Google Fonts with link tag in HTML
- Import Font Awesome 6 from cdnjs in HTML
- Use CSS variables for theming in styles.css
- Modern gradients, glassmorphism, animations
- Mobile responsive with media queries
- Hero section with stunning gradient
- Scroll reveal animations using Intersection Observer in script.js
- Sticky navbar with blur effect on scroll in script.js
- Smooth scroll behavior
- Professional realistic content no Lorem Ipsum
- Make it look like a $10,000 agency website`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from AI model')

    let parsedResponse
    try {
      parsedResponse = JSON.parse(response)
    } catch (error) {
      parsedResponse = {
        files: [{ name: 'index.html', content: response }],
        description: 'Generated website'
      }
    }

    res.status(200).json(parsedResponse)
  } catch (error) {
    console.error('AI Generation Error:', error)
    res.status(500).json({ error: { message: 'Failed to generate code. Please try again.' } })
  }
}