import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { supabase } from '../lib/supabase/client'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const nav = useNavigate()
  const toast = useToast()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (user && loading) {
      nav('/dashboard', { replace: true })
    }
  }, [user, loading, nav])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Viewer-only signup: role is always viewer on creation.
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        toast.error(signUpError.message)
        setLoading(false)
        return
      }

      // IMPORTANT:
      // We do NOT directly insert into profiles from the client.
      // A Supabase DB trigger should create a profiles row on new auth user.
      // That trigger should default role='viewer'.

      // If email confirmation is enabled, session could be null.
      if (data?.session) {
        toast.success('Account created successfully!')
        // Navigation happens in useEffect when user updates
      } else {
        toast.info('Please check your email to confirm your account.')
        setLoading(false)
        setTimeout(() => {
          nav('/login', { replace: true })
        }, 1500)
      }
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
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Create viewer account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">Sign up as Viewer (read-only access).</p>

          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-200">Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-200">Email</span>
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
              {loading ? 'Creating…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-200">
            Already have an account?{' '}
            <Link className="text-emerald-700 hover:underline dark:text-emerald-300" to="/login">
              Login
            </Link>
          </p>

          <Link className="mt-6 inline-flex text-xs text-gray-500 hover:underline dark:text-gray-400" to="/">
            ← Back to landing
          </Link>
        </div>
      </div>
    </div>
  )
}
