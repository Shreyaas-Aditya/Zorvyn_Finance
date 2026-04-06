import { Link } from 'react-router-dom'
import { BarChart3, Shield, Sparkles, Moon, Sun } from 'lucide-react'
import { SpotlightNavbar } from '../components/SpotlightNavbar'
import { LogoSlider } from '../components/LogoSlider'
import { useTheme } from '../hooks/useTheme'

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  )
}

export default function Landing() {
  const { theme, setTheme } = useTheme()
  
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '/login' },
  ]

  const rightSection = (
    <>
      <button
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
      <Link
        to="/login"
        className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="inline-flex h-9 items-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
      >
        Get Started
      </Link>
    </>
  )

  const handleFeaturesClick = (e) => {
    e.preventDefault()
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900 dark:bg-black dark:text-white">
      <SpotlightNavbar
        navItems={navItems.map(item => 
          item.label === 'Features' 
            ? { ...item, onClick: handleFeaturesClick } 
            : item
        )} 
        rightSection={rightSection} 
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Sparkles className="size-3" />
              Simple. Secure. Insightful.
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
              A clean finance dashboard to track what matters.
            </h1>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Track expenses, visualize trends, and get quick insights. Powered by Supabase Auth + Database.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex h-10 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-md transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:shadow-lg dark:hover:bg-neutral-800"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-black">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$9,420</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Income</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$3,720</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/30">
                <p className="text-xs text-rose-700 dark:text-rose-300">Expenses</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">$1,130</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-black">
                <BarChart3 className="size-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Line + pie charts with Recharts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-black">
                <Shield className="size-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Role-based access</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Viewer read-only, Admin can manage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12" id="features">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Everything you need in a small, fast dashboard.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Feature icon={BarChart3} title="Track & visualize" desc="Balance trend + spending categories at a glance." />
            <Feature icon={Sparkles} title="Insights" desc="Automatic monthly comparisons and top categories." />
            <Feature icon={Shield} title="Secure auth" desc="Supabase Auth, protected routes, RBAC in UI." />
          </div>
        </section>

        {/* Logo Slider Section */}
        <section className="mt-16">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Built with modern technologies</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Powered by industry-leading tools and frameworks</p>
          </div>
          <LogoSlider
            logos={[
              { name: 'React', color: 'from-cyan-400 to-blue-500' },
              { name: 'Supabase', color: 'from-green-400 to-emerald-600' },
              { name: 'Tailwind', color: 'from-sky-400 to-cyan-500' },
              { name: 'Vite', color: 'from-purple-400 to-violet-600' },
              { name: 'Recharts', color: 'from-orange-400 to-amber-600' },
              { name: 'Lucide', color: 'from-rose-400 to-pink-600' },
            ]}
            speed={20}
          />
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 text-center text-xs text-gray-500 dark:border-neutral-800 dark:text-gray-400">
        Zorvyn Finance — built with React + Supabase
      </footer>
    </div>
  )
}
