import { Wallet, TrendingDown, TrendingUp, LayoutDashboard, Receipt, Lightbulb, BarChart3 } from 'lucide-react'
import { SpotlightNavbar } from '../components/SpotlightNavbar'
import SummaryCard from '../components/SummaryCard'
import ChartSection from '../components/charts/ChartSection'
import InsightsPanel from '../components/InsightsPanel'
import TransactionTable from '../components/transactions/TransactionTable'
import { useTransactions } from '../context/TransactionsContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Dashboard() {
  const { totals, transactions, loading, error } = useTransactions()
  const { profile, role, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const nav = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')

  async function handleSignOut() {
    await signOut()
    nav('/login', { replace: true })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 100 // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
  }

  const navItems = [
    { 
      label: 'Overview', 
      href: '#overview',
      icon: LayoutDashboard,
      onClick: (e) => { e.preventDefault(); scrollToSection('overview') }
    },
    { 
      label: 'Analytics', 
      href: '#analytics',
      icon: BarChart3,
      onClick: (e) => { e.preventDefault(); scrollToSection('analytics') }
    },
    { 
      label: 'Insights', 
      href: '#insights',
      icon: Lightbulb,
      onClick: (e) => { e.preventDefault(); scrollToSection('insights') }
    },
    { 
      label: 'Transactions', 
      href: '#transactions',
      icon: Receipt,
      onClick: (e) => { e.preventDefault(); scrollToSection('transactions') }
    },
  ]

  const logo = (
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
  )

  const rightSection = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-white text-gray-900 dark:bg-black dark:text-white">
      <SpotlightNavbar 
        logo={logo} 
        navItems={navItems}
        activeItem={activeSection}
        rightSection={rightSection} 
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your data is stored securely in Supabase.</p>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
            Failed to load transactions. {error.message ?? String(error)}
          </div>
        ) : null}

        <section id="overview" className="mt-6 scroll-mt-24 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard title="Total Balance" value={totals.balance} subtitle="Income - Expenses" icon={Wallet} />
          <SummaryCard title="Total Income" value={totals.income} tone="income" subtitle="All time" icon={TrendingUp} />
          <SummaryCard title="Total Expenses" value={totals.expenses} tone="expense" subtitle="All time" icon={TrendingDown} />
        </section>

        <section id="analytics" className="mt-4 scroll-mt-24">
          <ChartSection transactions={transactions} />
        </section>

        <section id="insights" className="mt-4 scroll-mt-24">
          <InsightsPanel transactions={transactions} />
        </section>

        <section id="transactions" className="mt-4 scroll-mt-24">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-400 dark:shadow-lg">
              Loading transactions…
            </div>
          ) : (
            <TransactionTable />
          )}
        </section>
      </main>
    </div>
  )
}
