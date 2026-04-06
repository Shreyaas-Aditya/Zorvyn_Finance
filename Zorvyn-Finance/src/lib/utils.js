// Utility for conditionally joining classNames
// If clsx and tailwind-merge are installed, this can be enhanced
export function cn(...classes) {
  // Basic implementation - filters out falsy values and joins
  return classes.filter(Boolean).join(' ')
}

// Alternative enhanced version if clsx/tailwind-merge are available:
// import { clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'
// export function cn(...inputs) {
//   return twMerge(clsx(inputs))
// }

export function formatCurrency(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number)
}

export function formatDateInput(date) {
  // Returns YYYY-MM-DD
  const d = typeof date === 'string' ? new Date(date) : date
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function monthKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
