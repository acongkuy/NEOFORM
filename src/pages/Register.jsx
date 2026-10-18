import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiClock } from 'react-icons/fi'
import { registerUser, loginWithGoogle } from '../firebase/auth'
import { checkRateLimit, recordAttempt } from '../utils/rateLimit'
import toast from 'react-hot-toast'

const COOLDOWN_KEY = 'neoform_reg_cooldown'
const COOLDOWN_MS = 10 * 60 * 1000

function checkCooldown() {
  try {
    const raw = localStorage.getItem(COOLDOWN_KEY)
    if (!raw) return { ok: true }
    const elapsed = Date.now() - Number(raw)
    if (elapsed > COOLDOWN_MS) return { ok: true }
    return { ok: false, remaining: Math.ceil((COOLDOWN_MS - elapsed) / 60000) }
  } catch { return { ok: true } }
}

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState({ active: false, wait: 0 })
  const navigate = useNavigate()

  const cooldown = checkCooldown()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    const cd = checkCooldown()
    if (!cd.ok) { toast.error('Please wait ' + cd.remaining + 'm before creating another account'); return }
    const rl = checkRateLimit('register:' + email.toLowerCase().trim())
    if (!rl.allowed) { setLocked({ active: true, wait: rl.wait }); toast.error('Too many attempts. Try again later.'); return }
    setLoading(true)
    try {
      await registerUser(email, password, name)
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
      toast.success('Account created!')
      navigate('/')
    } catch (err) {
      recordAttempt('register:' + email.toLowerCase().trim())
      toast.error(err.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    try { await loginWithGoogle(); toast.success('Signed in with Google'); navigate('/') }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neo-bg dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-10 left-10 w-28 h-28 rounded-full border-2 border-neo-black bg-neo-blue/20 dark:bg-neo-blue/10"
          animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-20 right-8 w-24 h-24 border-2 border-neo-black bg-neo-pink/20 dark:bg-neo-pink/10 -rotate-12"
          animate={{ y: [0, 10, 0], rotate: [-12, 10, -12] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
        <motion.div className="absolute top-40 right-40 w-14 h-14 border-2 border-neo-black bg-neo-yellow/20 dark:bg-neo-yellow/10 rotate-45"
          animate={{ y: [0, -10, 0], rotate: [45, 80, 45] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-40 left-12 w-5 h-5 rounded-full border-2 border-neo-black bg-neo-green"
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.9, 0.3] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }} />
        <motion.div className="absolute top-1/3 right-6 w-3 h-14 border-2 border-neo-black bg-neo-orange/40"
          animate={{ y: [0, -6, 0], rotate: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-neo-yellow dark:bg-gray-800 border-2 border-neo-black dark:border-neo-yellow px-4 py-1 rotate-1 mb-3">
            <h1 className="text-2xl font-black tracking-tight">NEOFORM</h1>
          </div>
          <p className="text-neo-black dark:text-gray-100 font-bold mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold mb-1 block">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black" size={16} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="input pl-10" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black" size={16} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input pl-10" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black" size={16} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="input pl-10" placeholder="At least 6 characters" />
            </div>
          </div>
          {!cooldown.ok && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/40 border-2 border-yellow-500 text-yellow-800 dark:text-yellow-200 text-sm font-bold rounded-none">
              <FiClock size={16} /> You can create another account in {cooldown.remaining}m
            </div>
          )}
          {locked.active && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/40 border-2 border-red-500 text-red-700 dark:text-red-300 text-sm font-bold rounded-none">
              <FiClock size={16} /> Too many attempts. Try again in {Math.ceil(locked.wait / 60000)}m.
            </div>
          )}
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading || locked.active || !cooldown.ok}
            className="btn-primary w-full">{loading ? 'Creating account...' : 'Create Account'}</motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-neo-black dark:border-gray-600" /></div>
          <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-sm font-bold text-neo-black dark:text-gray-100">or</span></div>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleGoogle}
          className="btn w-full bg-white dark:bg-gray-800 dark:border-neo-blue dark:text-gray-100 hover:bg-gray-50 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign up with Google
        </motion.button>
        <p className="text-sm font-bold text-center mt-3 px-3 py-2 border-2 border-neo-black bg-red-600 dark:bg-red-800 text-white text-neo-black rounded-none shadow-neo-sm">
          Mohon maaf, jika anda menggunakan aplikasi mobile, hanya support login email & password.🙏😥
        </p>

        <p className="text-center text-sm font-bold text-neo-black dark:text-gray-100 mt-6">
          Already have an account? <Link to="/login" className="text-neo-blue underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
