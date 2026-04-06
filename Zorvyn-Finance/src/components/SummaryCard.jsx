import { cn, formatCurrency } from '../lib/utils'

export default function SummaryCard({ title, value, subtitle, tone = 'neutral', icon: Icon }) {
  const toneClasses = {
    neutral: 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800',
    income: 'bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/40',
    expense: 'bg-rose-50/60 dark:bg-rose-900/20 border-rose-200/60 dark:border-rose-800/40',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:shadow-lg',
        toneClasses[tone] ?? toneClasses.neutral,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </p>
          {subtitle ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{subtitle}</p> : null}
        </div>
        {Icon ? (
          <div className="grid size-10 place-items-center rounded-xl bg-gray-900/5 text-gray-700 dark:bg-white/5 dark:text-gray-300">
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
