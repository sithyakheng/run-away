import groq from '../lib/groqClient.js'

export const generateCode = async (req, res) => {
  try {
    const { prompt, projectId } = req.body

    if (!prompt) {
      return res.status(400).json({
        error: {
          message: 'Prompt is required'
        }
      })
    }

    const systemPrompt = `You are an expert web developer AI assistant. Generate complete, functional web applications based on user prompts.

Rules:
1. Return valid HTML, CSS, and JavaScript code
2. Create responsive, modern designs
3. Include all necessary CSS and JavaScript inline
4. Make it fully functional without external dependencies
5. Use semantic HTML5 elements
6. Add smooth transitions and hover effects
7. Ensure mobile responsiveness
8. Return ONLY the code without explanations

Format your response as JSON:
{
  "code": "Complete HTML with inline CSS and JavaScript",
  "response": "Brief description of what was generated"
}

Example:
{
  "code": "<!DOCTYPE html>...",
  "response": "Generated a modern portfolio website"
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new Error('No response from AI model')
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(response)
    } catch (error) {
      // Fallback if JSON parsing fails
      parsedResponse = {
        code: response,
        response: 'Generated web application code'
      }
    }

    res.status(200).json(parsedResponse)

  } catch (error) {
    console.error('AI Generation Error:', error)
    
    res.status(500).json({
      error: {
        message: 'Failed to generate code. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message 
        })
      }
    })
  }
}
