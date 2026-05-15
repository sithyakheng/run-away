import Groq from 'groq-sdk' 
import fs from 'fs'
import path from 'path'
 
 const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) 
 
 export const generateCode = async (req, res) => { 
   try { 
     const { prompt } = req.body 
     if (!prompt) return res.status(400).json({ error: 'Prompt is required' }) 
     res.setHeader('Content-Type', 'text/event-stream') 
     res.setHeader('Cache-Control', 'no-cache') 
     res.setHeader('Connection', 'keep-alive') 
     const systemPrompt = `You are an elite web developer. Generate a stunning single-file HTML website. Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown, no code blocks, no explanation. All CSS in a style tag in head. All JS in a script tag before closing body. Always include Google Fonts import, Font Awesome from cdnjs, viewport meta tag. Hero must have a real Unsplash background image relevant to the topic with a dark overlay. Use dark elegant colors. Pick a font pair that fits the topic. Make it look like a 20000 dollar agency built it. Real content no Lorem Ipsum. Include navbar, hero, about, services or features, testimonials, contact form, footer. Every section needs icons. Smooth scroll animations. Mobile responsive.` 
     const stream = await groq.chat.completions.create({ 
       messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], 
       model: 'llama-3.3-70b-versatile', 
       temperature: 0.7, 
       max_tokens: 8000, 
       stream: true 
     }) 
     let html = '' 
     for await (const chunk of stream) { 
       const content = chunk.choices[0]?.delta?.content || '' 
       if (content) { 
         html += content 
         res.write(`data: ${JSON.stringify({ chunk: content })} \n\n`) 
       } 
     } 
     
     const projectId = Date.now().toString() 
     const dir = path.join(process.cwd(), 'generated', projectId) 
     fs.mkdirSync(dir, { recursive: true }) 
     fs.writeFileSync(path.join(dir, 'index.html'), html) 

     res.write(`data: ${JSON.stringify({ done: true, html, projectId })} \n\n`) 
     res.write('data: [DONE] \n\n') 
     res.end() 
   } catch (error) { 
     console.error('Error:', error?.error?.message || error) 
     res.write(`data: ${JSON.stringify({ error: 'Failed to generate code' })} \n\n`) 
     res.end() 
   } 
 } 
 
 export const generateProCode = async (req, res) => { 
   try { 
     const { prompt } = req.body 
     if (!prompt) return res.status(400).json({ error: 'Prompt is required' }) 
     res.setHeader('Content-Type', 'text/event-stream') 
     res.setHeader('Cache-Control', 'no-cache') 
     res.setHeader('Connection', 'keep-alive') 
     const proSystemPrompt = `You are a world-class frontend engineer who builds Awwwards-winning websites. Generate a stunning single-file HTML website. Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown, no code blocks, no explanation. All CSS in a style tag in head. All JS in a script tag before closing body. Always include Google Fonts import, Font Awesome from cdnjs, viewport meta tag. Hero full viewport height with real Unsplash background image with dark overlay, massive headline, 2 CTA buttons. Use glassmorphism cards, smooth parallax, scroll animations, custom cursor, scroll progress bar. Pick elegant dark color palette and premium font pairing that fits the topic. Include navbar with blur, hero, about, features, stats counter, testimonials, pricing if needed, FAQ accordion, contact form, footer. Every button has hover animation. Every card fades in on scroll. Navbar darkens on scroll. Real professional copywriting. Mobile responsive with hamburger menu. This site must look like it costs 50000 dollars.` 
     const stream = await groq.chat.completions.create({ 
       messages: [{ role: 'system', content: proSystemPrompt }, { role: 'user', content: prompt }], 
       model: 'llama-3.3-70b-versatile', 
       temperature: 0.7, 
       max_tokens: 8000, 
       stream: true 
     }) 
     let html = '' 
     for await (const chunk of stream) { 
       const content = chunk.choices[0]?.delta?.content || '' 
       if (content) { 
         html += content 
         res.write(`data: ${JSON.stringify({ chunk: content })} \n\n`) 
       } 
     } 

     const projectId = Date.now().toString() 
     const dir = path.join(process.cwd(), 'generated', projectId) 
     fs.mkdirSync(dir, { recursive: true }) 
     fs.writeFileSync(path.join(dir, 'index.html'), html) 

     res.write(`data: ${JSON.stringify({ done: true, html, projectId })} \n\n`) 
     res.write('data: [DONE] \n\n') 
     res.end() 
   } catch (error) { 
     console.error('Error:', error?.error?.message || error) 
     res.write(`data: ${JSON.stringify({ error: 'Failed to generate pro code' })} \n\n`) 
     res.end() 
   } 
 }