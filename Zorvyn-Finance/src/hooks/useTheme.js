import { useEffect, useState } from 'react'
import { loadTheme, saveTheme } from '../lib/storage'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return 'light'
    
    // Load from localStorage or default to light
    const saved = loadTheme()
    return saved || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove both classes first to ensure clean state
    root.classList.remove('dark', 'light')
    
    // Add the appropriate class
    if (theme === 'dark') {
      root.classList.add('dark')
    }
    
    // Save to localStorage
    saveTheme(theme)
  }, [theme])

  return { theme, setTheme }
}
