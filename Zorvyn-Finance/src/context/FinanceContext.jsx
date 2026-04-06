import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadRole, loadTheme, loadTransactions, saveRole, saveTheme, saveTransactions } from '../lib/storage'
import { seedTransactions } from '../lib/mockData'

const FinanceContext = createContext(null)

function uid() {
  return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function FinanceProvider({ children }) {
  const [role, setRole] = useState(() => loadRole() ?? 'viewer')
  const [theme, setTheme] = useState(() => loadTheme() ?? 'light')
  const [transactions, setTransactions] = useState(() => loadTransactions() ?? seedTransactions)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all | income | expense
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' }) // date|amount

  useEffect(() => saveRole(role), [role])
  useEffect(() => saveTheme(theme), [theme])
  useEffect(() => saveTransactions(transactions), [transactions])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    let list = [...transactions]

    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter)
    if (categoryFilter !== 'all') list = list.filter((t) => t.category === categoryFilter)

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((t) => {
        const hay = `${t.category} ${t.type} ${t.note ?? ''} ${t.amount} ${t.date}`.toLowerCase()
        return hay.includes(q)
      })
    }

    const dirMul = sort.dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      if (sort.key === 'amount') return (Number(a.amount) - Number(b.amount)) * dirMul
      // date
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dirMul
    })

    return list
  }, [transactions, typeFilter, categoryFilter, search, sort])

  const totals = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of transactions) {
      const amt = Number(t.amount) || 0
      if (t.type === 'income') income += amt
      else if (t.type === 'expense') expenses += amt
    }
    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }, [transactions])

  function addTransaction(payload) {
    const tx = { id: uid(), ...payload }
    setTransactions((prev) => [tx, ...prev])
    return tx
  }

  function updateTransaction(id, patch) {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const value = {
    role,
    setRole,
    theme,
    setTheme,

    transactions,
    setTransactions,
    filteredTransactions,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,

    categories,
    totals,

    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
