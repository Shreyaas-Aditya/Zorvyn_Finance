import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { getOrCreateProfile } from '../lib/supabase/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let timeoutId = null

    async function init() {
      try {
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Failed to get session:', sessionError)
          if (mounted) {
            setSession(null)
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        if (!mounted) return
        
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        // Fetch profile if we have a user
        if (currentSession?.user?.id) {
          try {
            const userName = currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0]
            const p = await getOrCreateProfile(currentSession.user.id, userName)
            if (mounted) {
              setProfile(p)
              console.log('Auth: Profile loaded successfully, role:', p.role)
            }
          } catch (err) {
            console.error('Failed to load/create profile:', err)
            if (mounted) setProfile(null)
          }
        } else {
          console.log('Auth: No user session found')
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          console.log('Auth: Initialization complete')
        }
      }
    }

    // Safety timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth: Loading timeout - forcing completion')
        setLoading(false)
      }
    }, 5000)

    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      console.log('Auth: State change event:', event)
      
      if (!mounted) return

      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      
      if (nextSession?.user?.id) {
        try {
          const userName = nextSession.user.user_metadata?.name || nextSession.user.email?.split('@')[0]
          const p = await getOrCreateProfile(nextSession.user.id, userName)
          if (mounted) {
            setProfile(p)
            console.log('Auth: Profile updated, role:', p.role)
          }
        } catch (err) {
          console.error('Failed to load/create profile on auth change:', err)
          if (mounted) setProfile(null)
        }
      } else {
        if (mounted) setProfile(null)
      }
    })

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    return {
      session,
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      signOut: async () => {
        console.log('🚪 Signing out...')
        await supabase.auth.signOut()
        console.log('✅ Signed out successfully')
      },
    }
  }, [session, user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
