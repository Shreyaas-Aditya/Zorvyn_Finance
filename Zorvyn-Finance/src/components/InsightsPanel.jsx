import { useMemo } from 'react'
import { formatCurrency, monthKey } from '../lib/utils'

function Card({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:shadow-lg">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{subtitle}</p> : null}
    </div>
  )
}

export default function InsightsPanel({ transactions }) {
  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')

    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + (Number(t.amount) || 0)
      return acc
    }, {})

    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
    const topCategory = top?.[0] ?? '—'
    const topAmount = top?.[1] ?? 0

    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const last = new Date(now)
    last.setMonth(last.getMonth() - 1)
    const lastMonth = monthKey(last)

    const monthTotals = expenses.reduce(
      (acc, t) => {
        const k = monthKey(t.date)
        acc[k] = (acc[k] ?? 0) + (Number(t.amount) || 0)
        return acc
      },
      {},
    )

    const thisMonthTotal = monthTotals[thisMonth] ?? 0
    const lastMonthTotal = monthTotals[lastMonth] ?? 0

    let message = 'Add more transactions to see insights.'
    if (expenses.length) {
      if (thisMonthTotal > lastMonthTotal) message = `You spent more this month than last month.`
      else if (thisMonthTotal < lastMonthTotal) message = `Nice! You spent less this month than last month.`
      else message = `Your spending is the same as last month.`

      if (topCategory !== '—') message += ` Biggest expense category: ${topCategory}.`
    }

    return {
      topCategory,
      topAmount,
      thisMonthTotal,
      lastMonthTotal,
      message,
    }
  }, [transactions])

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Insights</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card title="Highest spending category" value={insights.topCategory} subtitle={formatCurrency(insights.topAmount)} />
        <Card title="Expenses (this month)" value={formatCurrency(insights.thisMonthTotal)} subtitle={`Last month: ${formatCurrency(insights.lastMonthTotal)}`} />
        <Card title="Summary" value={insights.message} />
      </div>
    </section>
  )
}
