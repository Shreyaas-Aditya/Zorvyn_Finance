import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import Navbar from './components/Navbar'
import SummaryCard from './components/SummaryCard'
import ChartSection from './components/charts/ChartSection'
import TransactionTable from './components/transactions/TransactionTable'
import InsightsPanel from './components/InsightsPanel'
import { useFinance } from './context/FinanceContext'
import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const { totals, transactions } = useFinance()
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">Finance Dashboard</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Track income, expenses, and trends. Data is stored locally in your browser.
            </p>
          </div>

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard title="Total Balance" value={totals.balance} subtitle="Income - Expenses" icon={Wallet} />
            <SummaryCard title="Total Income" value={totals.income} tone="income" subtitle="All time" icon={TrendingUp} />
            <SummaryCard title="Total Expenses" value={totals.expenses} tone="expense" subtitle="All time" icon={TrendingDown} />
          </section>

          <section className="mt-4">
            <ChartSection transactions={transactions} />
          </section>

          <section className="mt-4">
            <InsightsPanel transactions={transactions} />
          </section>

          <section className="mt-4">
            <TransactionTable />
          </section>

          <footer className="mt-8 pb-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Built with React + Tailwind. Viewer role is read-only; switch to Admin to manage transactions.
          </footer>
        </main>
      </div>
    </>
  )
}

export default App
