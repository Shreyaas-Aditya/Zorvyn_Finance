import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTransactions } from '../../context/TransactionsContext'
import { useToast } from '../../context/ToastContext'
import { cn, formatCurrency } from '../../lib/utils'
import TransactionModal from './TransactionModal'

function ThButton({ active, dir, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide',
        active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-200',
      )}
    >
      <span>{children}</span>
      {active ? dir === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : null}
    </button>
  )
}

export default function TransactionTable() {
  const { role } = useAuth()
  const {
    filteredTransactions,
    categories,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()
  const toast = useToast()

  const isAdmin = role === 'admin'

  const [modalOpen, setModalOpen] = useState(false)
  const [editTxId, setEditTxId] = useState(null)

  const editTx = useMemo(() => filteredTransactions.find((t) => t.id === editTxId) ?? null, [filteredTransactions, editTxId])

  function openNew() {
    setEditTxId(null)
    setModalOpen(true)
  }

  function openEdit(id) {
    setEditTxId(id)
    setModalOpen(true)
  }

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'desc' }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  async function onSave(formPayload) {
    if (!isAdmin) {
      toast.error('Only admins can modify transactions')
      return
    }
    
    try {
      if (editTxId) {
        await updateTransaction(editTxId, formPayload)
        toast.success('Transaction updated successfully')
      } else {
        await addTransaction(formPayload)
        toast.success('Transaction added successfully')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save transaction')
    }
  }

  async function onDelete(id) {
    if (!isAdmin) {
      toast.error('Only admins can delete transactions')
      return
    }
    
    const yes = confirm('Delete this transaction?')
    if (!yes) return
    
    try {
      await deleteTransaction(id)
      toast.success('Transaction deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete transaction')
    }
  }

  function exportCsv() {
    const rows = filteredTransactions
    const header = ['Date', 'Amount', 'Category', 'Type', 'Note']
    const csv = [header.join(',')]
    for (const t of rows) {
      const line = [t.date, t.amount, t.category, t.type, (t.note ?? '').replaceAll('"', '""')]
        .map((v) => `"${String(v ?? '')}"`)
        .join(',')
      csv.push(line)
    }

    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    
    toast.success('Transactions exported to CSV')
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Transactions</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-200">
            Search, filter and sort your activity. {isAdmin ? 'Admin can manage transactions.' : 'Viewer is read-only.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Export CSV
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={openNew}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="size-4" />
              Add
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category, note, amount..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3">
                  <ThButton active={sort.key === 'date'} dir={sort.dir} onClick={() => toggleSort('date')}>
                    Date
                  </ThButton>
                </th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">
                  <ThButton active={sort.key === 'amount'} dir={sort.dir} onClick={() => toggleSort('amount')}>
                    Amount
                  </ThButton>
                </th>
                <th className="px-4 py-3">Note</th>
                {isAdmin ? <th className="px-4 py-3 text-right">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-200">
                    No transactions found. {isAdmin ? 'Add one to get started.' : ''}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="bg-white transition hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{t.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                          t.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
                        )}
                      >
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={cn('whitespace-nowrap px-4 py-3 font-medium', t.type === 'income' ? 'text-emerald-600' : 'text-rose-600')}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="max-w-[18rem] truncate px-4 py-3 text-gray-600 dark:text-gray-200" title={t.note ?? ''}>
                      {t.note || '—'}
                    </td>
                    {isAdmin ? (
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(t.id)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                          >
                            <Pencil className="size-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(t.id)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                          >
                            <Trash2 className="size-3 text-rose-500" /> Delete
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={editTxId ? 'edit' : 'create'}
        initialTx={editTx}
        categories={categories}
        onSave={onSave}
      />
    </section>
  )
}
