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
 
     const projectId = Date.now().toString() 
     const dir = path.join(process.cwd(), 'generated', projectId) 
     fs.mkdirSync(dir, { recursive: true }) 
 
     const files = [ 
       { 
         name: 'index.html', 
         prompt: `Generate ONLY the HTML for a stunning website about: ${prompt}. Include link tags to styles.css and script.js. No CSS or JS inline. Just clean semantic HTML with all sections: navbar, hero, about, services, testimonials, contact, footer. Return only raw HTML.` 
       }, 
       { 
         name: 'styles.css', 
         prompt: `Generate ONLY the CSS for a stunning website about: ${prompt}. Dark elegant theme, CSS variables in :root, Google Fonts import, Font Awesome icons, navbar styles, hero with Unsplash background image, cards with glassmorphism, animations, hover effects, mobile responsive media queries. Return only raw CSS no style tags.` 
       }, 
       { 
         name: 'script.js', 
         prompt: `Generate ONLY the JavaScript for a website about: ${prompt}. Include: navbar scroll effect, smooth scroll, intersection observer for fade-in animations, counter animation for stats, FAQ accordion, hamburger menu, parallax hero, page loader. Return only raw JS no script tags.` 
       } 
     ] 
 
     for (const file of files) { 
       res.write(`data: ${JSON.stringify({ status: `Generating ${file.name}...` })}\n\n`) 
 
       const stream = await groq.chat.completions.create({ 
         messages: [ 
           { role: 'system', content: 'You are an expert web developer. Return only the requested code, nothing else. No explanations, no markdown, no code blocks.' }, 
           { role: 'user', content: file.prompt } 
         ], 
         model: 'llama-3.3-70b-versatile', 
         temperature: 0.7, 
         max_tokens: 8000, 
         stream: true 
       }) 
 
       let fileContent = '' 
       for await (const chunk of stream) { 
         const content = chunk.choices[0]?.delta?.content || '' 
         if (content) { 
           fileContent += content 
           res.write(`data: ${JSON.stringify({ file: file.name, chunk: content })}\n\n`) 
         } 
       } 
 
       fs.writeFileSync(path.join(dir, file.name), fileContent) 
     } 
 
     const indexHTML = fs.readFileSync(path.join(dir, 'index.html'), 'utf-8') 
     const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf-8') 
     const js = fs.readFileSync(path.join(dir, 'script.js'), 'utf-8') 
     const fullHTML = indexHTML 
       .replace('</head>', `<style>${css}</style></head>`) 
       .replace('</body>', `<script>${js}</script></body>`) 
 
     res.write(`data: ${JSON.stringify({ done: true, html: fullHTML, projectId })}\n\n`) 
     res.write('data: [DONE]\n\n') 
     res.end() 
   } catch (error) { 
     console.error('Error:', error?.error?.message || error) 
     res.write(`data: ${JSON.stringify({ error: 'Failed to generate code' })}\n\n`) 
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
 
     const projectId = Date.now().toString() 
     const dir = path.join(process.cwd(), 'generated', projectId) 
     fs.mkdirSync(dir, { recursive: true }) 
 
     const files = [ 
       { 
         name: 'index.html', 
         prompt: `Generate ONLY the HTML for an Awwwards-winning website about: ${prompt}. Use premium semantic tags. Include link tags to styles.css and script.js. No CSS or JS inline. Include sections: Premium Navbar, Hero with text reveal, About with scroll-triggered images, Services with grid layout, Case studies, Testimonials slider, Stats counter, Pricing cards, FAQ, Contact, Footer. Return only raw HTML.` 
       }, 
       { 
         name: 'styles.css', 
         prompt: `Generate ONLY the CSS for an Awwwards-winning website about: ${prompt}. Ultra-modern dark luxury theme, advanced CSS variables, custom font pairing, complex glassmorphism, grain textures, smooth parallax scroll, scroll progress bar, custom cursor styling, advanced hover animations on every element, mobile-first responsive design. Return only raw CSS no style tags.` 
       }, 
       { 
         name: 'script.js', 
         prompt: `Generate ONLY the JavaScript for an Awwwards-winning website about: ${prompt}. Use GSAP-like smooth scroll logic (pure JS), Intersection Observer for stagger animations, text reveal animations on scroll, parallax background effects, mouse-follow cursor, magnetic buttons, dynamic year in footer, form validation. Return only raw JS no script tags.` 
       } 
     ] 
 
     for (const file of files) { 
       res.write(`data: ${JSON.stringify({ status: `Generating ${file.name}...` })}\n\n`) 
 
       const stream = await groq.chat.completions.create({ 
         messages: [ 
           { role: 'system', content: 'You are a world-class frontend engineer. Return only the requested code, nothing else. No explanations, no markdown, no code blocks.' }, 
           { role: 'user', content: file.prompt } 
         ], 
         model: 'llama-3.3-70b-versatile', 
         temperature: 0.7, 
         max_tokens: 8000, 
         stream: true 
       }) 
 
       let fileContent = '' 
       for await (const chunk of stream) { 
         const content = chunk.choices[0]?.delta?.content || '' 
         if (content) { 
           fileContent += content 
           res.write(`data: ${JSON.stringify({ file: file.name, chunk: content })}\n\n`) 
         } 
       } 
 
       fs.writeFileSync(path.join(dir, file.name), fileContent) 
     } 
 
     const indexHTML = fs.readFileSync(path.join(dir, 'index.html'), 'utf-8') 
     const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf-8') 
     const js = fs.readFileSync(path.join(dir, 'script.js'), 'utf-8') 
     const fullHTML = indexHTML 
       .replace('</head>', `<style>${css}</style></head>`) 
       .replace('</body>', `<script>${js}</script></body>`) 
 
     res.write(`data: ${JSON.stringify({ done: true, html: fullHTML, projectId })}\n\n`) 
     res.write('data: [DONE]\n\n') 
     res.end() 
   } catch (error) { 
     console.error('Error:', error?.error?.message || error) 
     res.write(`data: ${JSON.stringify({ error: 'Failed to generate pro code' })}\n\n`) 
     res.end() 
   } 
 }