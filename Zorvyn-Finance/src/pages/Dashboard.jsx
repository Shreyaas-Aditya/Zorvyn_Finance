import { Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import ChartSection from '../components/charts/ChartSection'
import InsightsPanel from '../components/InsightsPanel'
import TransactionTable from '../components/transactions/TransactionTable'
import { useTransactions } from '../context/TransactionsContext'

export default function Dashboard() {
  const { totals, transactions, loading, error } = useTransactions()

  return (
    <div className="min-h-dvh bg-white text-gray-900 dark:bg-black dark:text-white">
      <Navbar />

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
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-md dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:shadow-lg">
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
