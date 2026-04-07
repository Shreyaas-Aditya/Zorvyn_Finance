import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Spotlight Navbar Component
 * A modern, glassmorphism-style navigation bar with spotlight effect on hover
 */
export function SpotlightNavbar({ logo, navItems = [], activeItem, rightSection, className }) {
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
    <div className="sticky top-0 z-50 w-full px-4 pt-4">
      <header
        className={cn(
          'group relative mx-auto max-w-6xl rounded-2xl transition-all duration-300',
          isScrolled
            ? 'border border-white/20 bg-white/70 backdrop-blur-2xl shadow-xl shadow-black/5 dark:border-white/10 dark:bg-black/70 dark:shadow-white/5'
            : 'border border-white/30 bg-white/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:border-white/10 dark:bg-black/60 dark:shadow-white/5',
          className,
        )}
        onMouseMove={handleMouseMove}
      >
        {/* Glassmorphism inner glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5" />
        
        {/* Spotlight effect - creates a subtle radial gradient that follows mouse */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.08), transparent 40%)`,
          }}
        />

        <nav className="relative flex w-full items-center justify-between px-4 py-3">
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
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = activeItem && item.href && item.href.slice(1) === activeItem
            
            if (item.onClick) {
              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    'group relative inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  {Icon && <Icon className="size-4" />}
                  {item.label}
                  {!isActive && (
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                  )}
                </a>
              )
            }
            return (
              <Link
                key={idx}
                to={item.href}
                className={cn(
                  'group relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                )}
              >
                {Icon && <Icon className="size-4" />}
                {item.label}
                {!isActive && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                )}
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
          <div className="relative rounded-b-2xl border-t border-white/20 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-black/80 md:hidden">
            {/* Glassmorphism effect for mobile menu */}
            <div className="pointer-events-none absolute inset-0 rounded-b-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/5" />
            <div className="relative space-y-1 px-4 py-4">
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isActive = activeItem && item.href && item.href.slice(1) === activeItem
              
              if (item.onClick) {
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={(e) => {
                      item.onClick(e)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-100'
                    )}
                  >
                    {Icon && <Icon className="size-4" />}
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={idx}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-100'
                  )}
                >
                  {Icon && <Icon className="size-4" />}
                  {item.label}
                </Link>
              )
            })}
              <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">{rightSection}</div>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
