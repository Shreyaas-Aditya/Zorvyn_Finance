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
    
    // Force loading to false after 5 seconds max
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - forcing completion')
        setLoading(false)
      }
    }, 5000)

    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        
        setSession(data.session)
        setUser(data.session?.user ?? null)

        if (data.session?.user?.id) {
          try {
            const userName = data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0]
            const p = await getOrCreateProfile(data.session.user.id, userName)
            if (mounted) setProfile(p)
          } catch (err) {
            console.error('Failed to load/create profile:', err)
            if (mounted) setProfile(null)
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
      } finally {
        if (mounted) {
          clearTimeout(timeout)
          setLoading(false)
        }
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user?.id) {
        try {
          const userName = nextSession.user.user_metadata?.name || nextSession.user.email?.split('@')[0]
          const p = await getOrCreateProfile(nextSession.user.id, userName)
          setProfile(p)
        } catch (err) {
          console.error('Failed to load/create profile:', err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      sub.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    return {
      session,
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      signOut: () => supabase.auth.signOut(),
    }
  }, [session, user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
