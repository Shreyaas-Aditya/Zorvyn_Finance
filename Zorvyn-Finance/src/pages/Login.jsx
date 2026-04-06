import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { supabase } from '../lib/supabase/client'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const nav = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/dashboard'
  const toast = useToast()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (user && loading) {
      nav(redirectTo, { replace: true })
    }
  }, [user, loading, nav, redirectTo])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      })
      
      if (signInError) {
        setError(signInError.message)
        toast.error(signInError.message)
        setLoading(false)
        return
      }

      toast.success('Successfully logged in!')
      // Navigation happens in useEffect when user updates
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred')
      toast.error(err?.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900 dark:bg-black dark:text-white">
      {/* Theme Toggle - Top Right */}
      <div className="absolute right-4 top-4">
        <button
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900 dark:shadow-lg">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Login</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back.</p>

          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-200">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p> : null}

            <button
              disabled={loading}
              type="submit"
              className="h-10 rounded-lg bg-emerald-600 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-200">
            New here?{' '}
            <Link className="text-emerald-700 hover:underline dark:text-emerald-300" to="/signup">
              Create a viewer account
            </Link>
          </p>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Admin accounts must be created in Supabase first.
          </p>

          <Link className="mt-6 inline-flex text-xs text-gray-500 hover:underline dark:text-gray-400" to="/">
            ← Back to landing
          </Link>
        </div>
      </div>
    </div>
  )
}
