import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Connecting to Supabase:', supabaseUrl)

// Custom fetch with timeout
const customFetch = (url, options = {}) => {
  const timeout = 10000 // 10 second timeout
  
  return Promise.race([
    fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeout)
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ])
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flow: 'implicit' // Use implicit flow for better compatibility
  },
  global: {
    fetch: customFetch
  },
  db: {
    schema: 'public'
  }
})
