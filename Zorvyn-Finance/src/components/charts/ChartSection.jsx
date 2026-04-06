import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatCurrency } from '../../lib/utils'

const PIE_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f97316', '#e11d48', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
      </div>
      {children}
    </div>
  )
}

function formatShortDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
}

export default function ChartSection({ transactions }) {
  const expenseByCategory = Object.values(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 }
        acc[t.category].value += Number(t.amount) || 0
        return acc
      }, {}),
  )
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const sortedByDate = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
  let running = 0
  const balanceTrend = sortedByDate.map((t) => {
    const amt = Number(t.amount) || 0
    running += t.type === 'income' ? amt : -amt
    return { date: t.date, balance: running }
  })

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Balance trend">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceTrend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
              <ReTooltip formatter={(v) => formatCurrency(v)} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
              <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.25} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {balanceTrend.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No data yet. Add transactions to see trends.</p>
        ) : null}
      </Card>

      <Card title="Spending by category">
        <div className="h-64">
          {expenseByCategory.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No expense data to show.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ReTooltip formatter={(v) => formatCurrency(v)} />
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {expenseByCategory.map((entry, idx) => (
                    <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {expenseByCategory.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {expenseByCategory.map((c, idx) => (
              <div key={c.name} className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-xs dark:border-neutral-700">
                <span className="inline-block size-2 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-gray-600 dark:text-gray-300">{c.name}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  )
}
