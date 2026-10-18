export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export function formatDate(timestamp) {
  if (!timestamp) return ''
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
