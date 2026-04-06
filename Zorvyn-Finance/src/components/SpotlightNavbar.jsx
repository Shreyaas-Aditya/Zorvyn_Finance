import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Spotlight Navbar Component
 * A modern, glassmorphism-style navigation bar with spotlight effect on hover
 */
export function SpotlightNavbar({ logo, navItems = [], rightSection, className }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm dark:border-gray-700 dark:bg-gray-900/80'
          : 'border-b border-gray-200/40 bg-white/50 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/50',
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight effect - creates a subtle radial gradient that follows mouse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.06), transparent 40%)`,
        }}
      />

      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        {logo || (
          <Link to="/" className="relative z-10 flex items-center gap-2 transition hover:opacity-90">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20">
              <span className="text-sm font-bold">Z</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Zorvyn Finance</span>
          </Link>
        )}

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item, idx) => {
            if (item.onClick) {
              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={item.onClick}
                  className="group relative cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                </a>
              )
            }
            return (
              <Link
                key={idx}
                to={item.href}
                className="group relative text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          })}
        </div>

        {/* Right Section (CTA buttons, etc) & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex md:items-center md:gap-2">{rightSection}</div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95 md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {navItems.map((item, idx) => {
              if (item.onClick) {
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={(e) => {
                      item.onClick(e)
                      setIsMobileMenuOpen(false)
                    }}
                    className="block cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-100"
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={idx}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-100"
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">{rightSection}</div>
          </div>
        </div>
      )}
    </header>
  )
}
