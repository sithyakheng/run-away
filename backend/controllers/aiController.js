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
COLOR SYSTEM — you have full creative freedom with colors. Use one of these options: 
 
 OPTION A — Use a preset pair exactly as listed: 
 Pair 1: Deep Teal #004E64 + Mist Gray #E0E5E9 — tech, medical, ocean, corporate 
 Pair 2: Rust #8C3B1F + Ivory #FFFFF0 — food, restaurant, earthy, vintage 
 Pair 3: Plum #4B1D3F + Lilac #D6C1E8 — luxury, beauty, fashion, wellness 
 Pair 4: Navy #0A2540 + Powder Blue #C7DDEB — finance, SaaS, law, startup 
 Pair 5: Mocha #4E342E + Latte #D7CCC8 — coffee, cafe, lifestyle, warm luxury 
 
 OPTION B — Mix colors freely from the palette: 
 Available colors: #004E64, #E0E5E9, #8C3B1F, #FFFFF0, #4B1D3F, #D6C1E8, #0A2540, #C7DDEB, #4E342E, #D7CCC8 
 Pick any dark color as background and any light color as accent — even across pairs — if you think it looks better for the topic. 
 
 OPTION C — Use your own color if none of the above fits: 
 If the website topic needs a completely different color (e.g. a neon gaming site, a bright kids site), you may use your own colors. But they must still be elegant, intentional, and professional. 
 
 RULES no matter which option you pick: 
 - Always one dark background, one light accent, white body text 
 - Always define colors as CSS variables in :root 
 - Never use more than 3 main colors in one site 
 - No random clashing colors ever 

- Use Google Fonts — import a premium font like Playfair Display, Inter, or DM Sans
- Use Font Awesome 6 from cdnjs for icons
- Hero section: full viewport height, dark background, large bold headline, subtle gradient overlay, CTA button
- Glassmorphism cards where appropriate: backdrop-filter: blur(10px), semi-transparent backgrounds
- Smooth scroll animations using Intersection Observer
- Sticky navbar that gets a blur/dark background on scroll
- Sections: Hero, About, Services/Rooms/Features, Testimonials, Contact, Footer
- Real professional copywriting — no Lorem Ipsum
- Mobile responsive with media queries
- Subtle micro-animations on hover (transform, opacity transitions)
- The site must look like it was built by a $15,000 agency

BACKGROUND & VISUAL RULES: 
- Hero section must always have a real background image using Unsplash URLs like: background-image: url('https://images.unsplash.com/photo-XXXXXXXXX?w=1600&q=80') — pick a relevant high quality photo that matches the website topic (hotel, restaurant, portfolio, etc) 
- Always add a dark overlay on top of hero images: background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)) 
- Use background-size: cover and background-position: center on hero 
- Other sections should have subtle background colors derived from the primary background color — use CSS variables for consistency
- Cards must have background: rgba(255,255,255,0.05) with border: 1px solid rgba(255,255,255,0.1) and border-radius: 12px 
- Add box-shadow: 0 8px 32px rgba(0,0,0,0.3) to cards 
- Testimonial section should have a different subtle background 
- Footer should be very dark with subtle top border 
  
TYPOGRAPHY RULES: 
- Hero headline must be at least 64px font size 
- Use letter-spacing: -0.02em on large headings 
- Subheadings use the accent color 
- Body text color should be white or very close to it for readability on dark backgrounds 
  
ANIMATION RULES: 
- Add a subtle parallax effect on the hero background using JavaScript scroll event 
- Cards fade in from below using Intersection Observer with translateY(30px) to translateY(0)

TECHNICAL RULES:
- Include <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside the <head>.
- All CSS inside a single <style> tag.
- All JavaScript inside a single <script> tag.
- Return ONLY the raw HTML code starting with <!DOCTYPE html>.
- Do not include any explanations or markdown code blocks.

ADVANCED SECTIONS — include the right ones based on website type: 
 
 For ALL websites always include: 
 - Sticky navbar with logo + links + CTA button 
 - Hero with background image, headline, subheadline, 2 CTA buttons 
 - About section with image placeholder (use gradient div) + text 
 - Testimonials: 3 cards with star rating, quote, name, title, avatar placeholder 
 - Contact section with a styled form: name, email, message, submit button 
 - Footer: logo, 3 columns of links, copyright, social icons 
 
 For BUSINESS / CORPORATE websites also add: 
 - Stats section: 4 numbers with labels (e.g. 500+ Clients, 10 Years Experience) 
 - Team section: 4 cards with avatar, name, role 
 - Partners/logos section: row of blurred placeholder logos 
 
 For SAAS / TECH / STARTUP websites also add: 
 - Features section: icon + title + description in a 3 column grid 
 - Pricing section: 3 tiers (Free, Pro, Enterprise) with feature lists and CTA buttons, highlight the middle tier 
 - FAQ section: accordion style, at least 5 questions, toggle open/close with JS 
 
 For RESTAURANT / FOOD websites also add: 
 - Menu section: categorized items with name, description, price 
 - Gallery section: 6 image placeholders using gradient divs with overlay text 
 - Reservation form: date, time, guests, name, phone 
 
 For PORTFOLIO websites also add: 
 - Skills section: animated progress bars 
 - Projects grid: 6 project cards with title, tech stack tags, hover overlay with links 
 - Experience timeline: vertical timeline with company, role, dates, description 
 
 For ECOMMERCE websites also add: 
 - Featured products grid: image placeholder, name, price, rating stars, Add to Cart button 
 - Categories section: 4 category cards with icons 
 - Sale banner: full width strip with countdown timer using JS 
 
 SMART CONTENT RULES: 
 - Read the user prompt carefully and write ALL content specifically for that business 
 - Invent a realistic brand name if none is given 
 - Write a compelling hero headline that speaks directly to the target customer 
 - Write real benefit-driven copy for every section — no filler text 
 - Testimonials must sound human and specific to the industry 
 - Pricing tiers must have realistic feature lists for that type of product 
 - FAQ questions must be real questions that customers in that industry actually ask 
 
 ADVANCED ANIMATION RULES: 
 - Hero: text slides up on load with opacity 0 to 1, transform translateY(40px) to 0, 0.8s ease 
 - Navbar: on scroll past 50px add blur and darken background smoothly 
 - Number stats: count up animation from 0 to final number when scrolled into view 
 - FAQ accordion: smooth max-height transition for open/close 
 - Progress bars: animate width from 0 to final % when scrolled into view 
 - Pricing cards: middle tier slightly larger with a glowing border using box-shadow 
 - Hover effects on ALL interactive elements: buttons, cards, nav links, social icons 
 - Page loader: simple fade out loader div that disappears after 0.5s 
 
 WEBSITE TYPE DETECTION: 
 - Read the user prompt and automatically detect what type of site to build 
 - hotel/resort/airbnb = hospitality 
 - restaurant/cafe/food/bar = food 
 - agency/portfolio/freelance/designer = portfolio 
 - shop/store/ecommerce/products = ecommerce 
 - app/saas/software/platform/tool = saas 
 - clinic/hospital/doctor/medical = medical 
 - gym/fitness/yoga/wellness = fitness 
 - law/legal/attorney/firm = professional 
 - Each type gets its own relevant sections, content, and color pair 
 
 QUALITY RULES: 
 - The site must look like it was built by a $20,000 agency 
 - Every section must have enough content to feel complete and real 
 - Spacing must be generous — never cramped 
 - Every button must have a hover state 
 - Images use Unsplash URLs relevant to the topic — pick real photo IDs not placeholders 
 - The finished HTML must be at minimum 800 lines long

 LAYOUT TEMPLATES — you must pick exactly ONE template from this list based on the website type and topic. Each template defines the page structure and section order. 
 
 T01 — Classic Top Nav (general business): TopNav → FullHero → About → Services3Grid → Testimonials → Contact → Footer 
 T02 — Centered Minimal (saas/app): CenteredNav → SplitHero(text left, image right) → LogoBar → Features3Col → Pricing3Tier → FAQ → Footer 
 T03 — Bold Magazine (blog/news): TopNav → FullWidthHero → LatestPosts4Grid → CategoryRow → FeaturedArticle → Newsletter → Footer 
 T04 — Left Sidebar Layout (portfolio): FixedLeftSidebar(nav+avatar+links) → MainContent(ProjectsGrid → About → Skills → Contact) 
 T05 — Right Sidebar Layout (blog): TopNav → MainContent(left 70% articles) + Sidebar(right 30% bio+tags+popular) → Footer 
 T06 — Fullscreen Scroll (luxury/hotel): FullscreenHero → FullscreenAbout → FullscreenRooms → FullscreenTestimonials → FullscreenContact → Footer 
 T07 — Split Screen Hero (startup): LeftHalf(dark bg, headline, CTA) + RightHalf(mockup image) → Features → Pricing → Footer 
 T08 — Diagonal Sections (creative agency): TopNav → DiagonalHero → DiagonalAbout → DiagonalWork → DiagonalContact → Footer (each section angled with clip-path) 
 T09 — Card Dashboard (saas): TopNav → StatsRow4Cards → FeaturesGrid → Testimonials → Pricing → Footer 
 T10 — Fullwidth Video Hero (event/conference): VideoHero(autoplay muted loop bg) → Speakers4Grid → Schedule → Sponsors → Footer 
 T11 — Minimal White (design studio): MinimalNav → LargeTypographyHero → WorkGrid(masonry) → About → Contact → Footer 
 T12 — Dark Immersive (gaming/tech): FullscreenDarkHero(particles bg) → Features → Leaderboard/Stats → CTA → Footer 
 T13 — Horizontal Scroll Hero (fashion): TopNav → HorizontalScrollGallery → CollectionGrid → About → Newsletter → Footer 
 T14 — Zigzag Layout (product): TopNav → Hero → ZigzagFeatures(alternating image+text left/right) → Pricing → Footer 
 T15 — Sticky Side Nav (documentation): FixedLeftNav(links) → DocContent(right side, sections with headings) → Footer 
 T16 — Timeline Layout (history/about): TopNav → Hero → VerticalTimeline → Team → Values → Contact → Footer 
 T17 — Masonry Gallery (photography): MinimalNav → MasonryGallery(fullwidth) → About → Services → BookingForm → Footer 
 T18 — One Page Scroll (personal brand): FixedNav → Hero → About → Skills → Portfolio → Testimonials → Contact (all sections fullheight) 
 T19 — E-commerce Standard (shop): TopNav+SearchBar → HeroBanner → CategoryRow → ProductGrid → FeaturedProduct → Reviews → Footer 
 T20 — Restaurant Classic (food): TopNav → FullHero(food image) → Menu(tabbed) → Gallery6Grid → Reservation → Testimonials → Footer 
 T21 — SaaS Long Form (conversion): TopNav → Hero+SocialProof → Problem → Solution → Features → HowItWorks3Steps → Testimonials → Pricing → FAQ → FinalCTA → Footer 
 T22 — Portfolio Fullscreen (creative): SplitFullscreen(left fixed text, right scrolling projects) → About → Contact → Footer 
 T23 — Agency Bold (marketing): LargeNav → HeroWithStats → ServicesHorizontalScroll → CaseStudies → Team → Contact → Footer 
 T24 — Medical Clean (clinic/health): TopNav → Hero → Services4Grid → Doctors3Grid → HowItWorks → Testimonials → AppointmentForm → Footer 
 T25 — Real Estate (property): TopNav → SearchHero(search bar overlay) → FeaturedListings → MapSection → AgentsGrid → Testimonials → Footer 
 T26 — Fitness Bold (gym): DarkTopNav → VideoHero → Programs3Grid → Trainers → Transformation(before/after) → Pricing → Footer 
 T27 — Law Firm Professional (legal): TopNav → SplitHero(dark left, image right) → PracticeAreas → Attorneys → CaseResults(stats) → Contact → Footer 
 T28 — Education Clean (school/course): TopNav → Hero → CourseGrid → Instructors → HowItWorks → Testimonials → Pricing → Footer 
 T29 — Non-profit Emotional (charity): TopNav → EmotionalHero(large image+story) → ImpactStats → Programs → Volunteer → Donate → Footer 
 T30 — Tech Product (hardware/device): TopNav → CinematicHero(product centered) → Specs → Features → ComparisonTable → Reviews → Buy → Footer 
 T31 — Music Artist (band/musician): DarkNav → FullscreenHero(artist photo) → LatestRelease → TourDates → Merch → Bio → Contact → Footer 
 T32 — Travel Agency (tours): TopNav → SearchHero → FeaturedDestinations → PopularTours → Testimonials → Newsletter → Footer 
 T33 — Crypto/Web3 (blockchain): DarkNav → AnimatedHero(gradient mesh) → Stats4Cards → HowItWorks → Tokenomics → Roadmap → FAQ → Footer 
 T34 — Interior Design (home decor): MinimalNav → LargePortfolioHero → ProjectsGrid(masonry) → Services → Process4Steps → Contact → Footer 
 T35 — Wedding (event planning): ElegantNav → RomanticHero → OurStory → Gallery → Venue → RSVP → Registry → Footer 
 T36 — Podcast/Media (show): TopNav → HeroWithPlayer → LatestEpisodes → GuestGrid → Reviews → Subscribe → Footer 
 T37 — Job Board (careers): TopNav+SearchBar → HeroBanner → FeaturedJobs → Categories → Companies → HowItWorks → Footer 
 T38 — Dashboard App (tool): TopNav → SidebarLeft(nav) + MainArea(StatsCards → Charts → RecentActivity) → Footer 
 T39 — Bakery/Cafe (artisan food): WarmNav → CozyHero → Specials3Cards → Menu → Gallery → About → Order → Footer 
 T40 — NFT/Art Gallery (digital art): DarkNav → FullscreenGalleryHero → FeaturedArtworks → Artists → HowToBuy3Steps → FAQ → Footer 
 
 TEMPLATE SELECTION RULES: 
 - Read the user prompt and pick the ONE template that best fits the topic and industry 
 - Follow the section order exactly as listed in the template 
 - Never skip sections listed in the chosen template 
 - Adapt section content to the specific topic but keep the structure 
 - If unsure between two templates pick the one with more sections 
 
 QUALITY RULES: 
 - The site must look like it was built by a $20,000 agency 
 - Every section must have enough content to feel complete and real 
 - Spacing must be generous — never cramped 
 - Every button must have a hover state 
 - Images use Unsplash URLs relevant to the topic — pick real photo IDs not placeholders 
 - The finished HTML must be at minimum 800 lines long`

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