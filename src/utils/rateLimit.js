const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

export function checkRateLimit(key) {
  try {
    const raw = localStorage.getItem(`rl:${key}`)
    if (!raw) return { allowed: true, remaining: MAX_ATTEMPTS, wait: 0 }
    const { count, start } = JSON.parse(raw)
    const elapsed = Date.now() - start
    if (elapsed > WINDOW_MS) return { allowed: true, remaining: MAX_ATTEMPTS, wait: 0 }
    return { allowed: count < MAX_ATTEMPTS, remaining: MAX_ATTEMPTS - count, wait: WINDOW_MS - elapsed }
  } catch { return { allowed: true, remaining: MAX_ATTEMPTS, wait: 0 } }
}

export function recordAttempt(key) {
  try {
    const raw = localStorage.getItem(`rl:${key}`)
    const now = Date.now()
    if (!raw) { localStorage.setItem(`rl:${key}`, JSON.stringify({ count: 1, start: now })); return }
    const { count, start } = JSON.parse(raw)
    localStorage.setItem(`rl:${key}`, JSON.stringify({ count: (now - start > WINDOW_MS) ? 1 : count + 1, start }))
  } catch { /* ignore */ }
}
