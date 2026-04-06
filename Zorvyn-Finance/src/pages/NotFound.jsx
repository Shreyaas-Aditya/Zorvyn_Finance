import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-2xl font-semibold">404</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Page not found.</p>
        <Link to="/" className="text-sm text-emerald-700 hover:underline dark:text-emerald-300">
          Go home
        </Link>
      </div>
    </div>
  )
}
