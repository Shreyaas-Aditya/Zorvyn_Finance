import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { listTransactions, createTransaction as apiCreate, updateTransaction as apiUpdate, deleteTransaction as apiDelete } from '../lib/supabase/db'
import { useAuth } from './AuthContext'

const TransactionsContext = createContext(null)

export function TransactionsProvider({ children }) {
  const { user, role } = useAuth()
  const isAdmin = role === 'admin'

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI state
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' })

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!user?.id) {
        setTransactions([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const rows = await listTransactions(user.id)
        if (mounted) setTransactions(rows)
      } catch (e) {
        if (mounted) setError(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [user?.id])

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
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  async function refresh() {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const rows = await listTransactions(user.id)
      setTransactions(rows)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  async function addTransaction(payload) {
    if (!isAdmin) throw new Error('FORBIDDEN')
    const row = await apiCreate({ ...payload, user_id: user.id })
    setTransactions((prev) => [row, ...prev])
    return row
  }

  async function updateTransaction(id, patch) {
    if (!isAdmin) throw new Error('FORBIDDEN')
    const row = await apiUpdate(id, patch)
    setTransactions((prev) => prev.map((t) => (t.id === id ? row : t)))
    return row
  }

  async function deleteTransaction(id) {
    if (!isAdmin) throw new Error('FORBIDDEN')
    await apiDelete(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const value = {
    transactions,
    filteredTransactions,
    categories,
    totals,

    loading,
    error,

    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,

    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider')
  return ctx
}
