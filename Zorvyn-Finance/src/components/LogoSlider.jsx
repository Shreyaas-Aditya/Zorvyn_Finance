import { useEffect, useRef } from 'react'
import { cn } from '../lib/utils'

/**
 * Logo Slider Component
 * Infinite auto-scrolling logo carousel with smooth animation
 */
export function LogoSlider({ logos = [], speed = 30, direction = 'left', className }) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    if (!scrollerRef.current) return

    // Duplicate logos for seamless infinite scroll
    const scrollerInner = scrollerRef.current.querySelector('[data-scroller-inner]')
    if (!scrollerInner) return

    const scrollerContent = Array.from(scrollerInner.children)
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true)
      duplicatedItem.setAttribute('aria-hidden', 'true')
      scrollerInner.appendChild(duplicatedItem)
    })
  }, [])

  // Default logos if none provided
  const defaultLogos = [
    { name: 'Supabase', color: 'from-green-400 to-green-600' },
    { name: 'React', color: 'from-blue-400 to-blue-600' },
    { name: 'Tailwind', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Vite', color: 'from-purple-400 to-purple-600' },
    { name: 'Recharts', color: 'from-orange-400 to-orange-600' },
  ]

  const logoList = logos.length > 0 ? logos : defaultLogos

  return (
    <div className={cn('w-full overflow-hidden py-8', className)}>
      <div
        ref={scrollerRef}
        className={cn('scroller relative max-w-7xl', direction === 'right' && '[&>[data-scroller-inner]]:flex-row-reverse')}
      >
        <div
          data-scroller-inner
          className="flex w-max animate-scroll gap-6"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
          }}
        >
          {logoList.map((logo, idx) => (
            <div
              key={idx}
              className="group relative flex h-20 w-32 items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
            >
              {logo.image ? (
                <img src={logo.image} alt={logo.name || 'Partner logo'} className="max-h-12 max-w-full object-contain" />
              ) : (
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                    logo.color || 'from-emerald-400 to-emerald-600',
                  )}
                >
                  <span className="text-xs font-bold">{logo.name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }

        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  )
}
