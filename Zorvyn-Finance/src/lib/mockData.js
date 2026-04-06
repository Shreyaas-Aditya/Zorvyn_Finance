import { formatDateInput } from './utils'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return formatDateInput(d)
}

export const defaultCategories = [
  'Salary',
  'Freelance',
  'Food',
  'Rent',
  'Transport',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Health',
]

export const seedTransactions = [
  { id: 't1', date: daysAgo(18), amount: 3200, category: 'Salary', type: 'income', note: 'March salary' },
  { id: 't2', date: daysAgo(16), amount: 180, category: 'Food', type: 'expense', note: 'Groceries' },
  { id: 't3', date: daysAgo(14), amount: 950, category: 'Rent', type: 'expense', note: 'Monthly rent' },
  { id: 't4', date: daysAgo(12), amount: 65, category: 'Transport', type: 'expense', note: 'Fuel' },
  { id: 't5', date: daysAgo(10), amount: 220, category: 'Shopping', type: 'expense', note: 'Essentials' },
  { id: 't6', date: daysAgo(8), amount: 520, category: 'Freelance', type: 'income', note: 'Side project' },
  { id: 't7', date: daysAgo(6), amount: 90, category: 'Utilities', type: 'expense', note: 'Internet' },
  { id: 't8', date: daysAgo(4), amount: 45, category: 'Entertainment', type: 'expense', note: 'Movies' },
  { id: 't9', date: daysAgo(2), amount: 35, category: 'Food', type: 'expense', note: 'Lunch' },
]
