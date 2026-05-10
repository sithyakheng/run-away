import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  
  // Initialize auth state
  initializeAuth: async () => {
    set({ loading: true })
    
    try {
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking session:', error)
        set({ user: null, session: null, loading: false })
        return
      }
      
      if (session) {
        set({ 
          user: session.user, 
          session, 
          loading: false 
        })
      } else {
        set({ user: null, session: null, loading: false })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ user: null, session: null, loading: false })
    }
  },
  
  // Set user and session
  setUser: (user, session) => {
    set({ user, session })
  },
  
  // Clear user and session
  clearUser: () => {
    set({ user: null, session: null })
  },
  
  // Sign out
  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, session: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
}))

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  const { setUser } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN' && session) {
    setUser(session.user, session)
  } else if (event === 'SIGNED_OUT') {
    setUser(null, null)
  } else if (event === 'TOKEN_REFRESHED' && session) {
    setUser(session.user, session)
  }
})
