import { useEffect, useMemo, useState } from 'react'
import { cn, formatDateInput } from '../../lib/utils'

const emptyForm = {
  date: formatDateInput(new Date()),
  amount: '',
  category: 'General',
  type: 'expense',
  note: '',
}

export default function TransactionModal({ open, onOpenChange, mode, initialTx, categories, onSave }) {
  const mergedCategories = useMemo(() => {
    const list = Array.isArray(categories) && categories.length ? categories : ['General', 'Food', 'Rent', 'Salary']
    return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b))
  }, [categories])

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialTx) {
      setForm({
        date: (initialTx.date ?? '').slice(0, 10),
        amount: String(initialTx.amount ?? ''),
        category: initialTx.category ?? 'General',
        type: initialTx.type ?? 'expense',
        note: initialTx.note ?? '',
      })
    } else {
      setForm({ ...emptyForm, category: mergedCategories[0] ?? 'General' })
    }
  }, [open, mode, initialTx, mergedCategories])

  if (!open) return null

  function close() {
    onOpenChange(false)
  }

  function submit(e) {
    e.preventDefault()

    const amount = Number(form.amount)
    
    // Validation
    if (!form.date) {
      alert('Please select a date')
      return
    }
    if (!form.amount || form.amount.trim() === '') {
      alert('Please enter an amount')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0')
      return
    }
    if (!form.category || form.category.trim() === '') {
      alert('Please select a category')
      return
    }

    onSave({
      date: new Date(form.date).toISOString(),
      amount,
      category: form.category,
      type: form.type,
      note: form.note?.trim() || '',
    })

    close()
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      <div className="absolute inset-0 flex items-end justify-center p-4 sm:items-center">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {mode === 'edit' ? 'Edit transaction' : 'New transaction'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-200">Admin only.</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-xs text-gray-500 dark:text-gray-200">Date *</span>
              <input
                type="date"
                required
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-xs text-gray-500 dark:text-gray-200">Amount *</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-xs text-gray-500 dark:text-gray-200">Type *</span>
              <select
                required
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-xs text-gray-500 dark:text-gray-200">Category *</span>
              <select
                required
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {mergedCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-xs text-gray-500 dark:text-gray-200">Note</span>
              <input
                type="text"
                placeholder="Optional note"
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />
            </label>

            <div className="mt-1 flex items-center justify-end gap-2 sm:col-span-2">
              <button
                type="button"
                onClick={close}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn('h-10 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition', 'bg-emerald-600 hover:bg-emerald-700')}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
