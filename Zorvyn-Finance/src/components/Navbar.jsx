import { LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

export default function Navbar() {
  const { profile, role, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const nav = useNavigate()

  async function handleSignOut() {
    await signOut()
    nav('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-black/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <span className="text-sm font-semibold">Z</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Zorvyn Finance</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile?.name ? profile.name : 'Dashboard'} {role ? `• ${role}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm shadow-sm transition',
              'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800',
            )}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
