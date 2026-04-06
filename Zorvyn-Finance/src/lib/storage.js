const LS_TRANSACTIONS_KEY = 'zorvyn.finance.transactions.v1'
const LS_ROLE_KEY = 'zorvyn.finance.role.v1'
const LS_THEME_KEY = 'zorvyn.finance.theme.v1'

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(LS_TRANSACTIONS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(LS_TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export function loadRole() {
  const role = localStorage.getItem(LS_ROLE_KEY)
  return role === 'admin' || role === 'viewer' ? role : null
}

export function saveRole(role) {
  localStorage.setItem(LS_ROLE_KEY, role)
}

export function loadTheme() {
  const theme = localStorage.getItem(LS_THEME_KEY)
  return theme === 'dark' || theme === 'light' ? theme : null
}

export function saveTheme(theme) {
  localStorage.setItem(LS_THEME_KEY, theme)
}
