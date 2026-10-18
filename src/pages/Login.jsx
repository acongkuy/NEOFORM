import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { loginUser, loginWithGoogle } from '../firebase/auth'
import toast from 'react-hot-toast'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await loginUser(email, password); toast.success('Welcome back!'); navigate('/') }
    catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try { await loginWithGoogle(); toast.success('Signed in with Google'); navigate('/') }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neo-bg dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-8 left-8 w-32 h-32 rounded-full border-2 border-neo-black bg-neo-yellow/20 dark:bg-neo-yellow/10"
          animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-16 right-12 w-24 h-24 border-2 border-neo-black bg-neo-pink/20 dark:bg-neo-pink/10 rotate-12"
          animate={{ y: [0, 10, 0], rotate: [12, 30, 12] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
        <motion.div className="absolute top-36 right-36 w-16 h-16 border-2 border-neo-black bg-neo-blue/20 dark:bg-neo-blue/10 rotate-45"
          animate={{ y: [0, -10, 0], rotate: [45, 90, 45] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-32 left-16 w-6 h-6 rounded-full border-2 border-neo-black bg-neo-green"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} />
        <motion.div className="absolute top-1/2 left-6 w-3 h-12 border-2 border-neo-black bg-neo-orange/40"
          animate={{ y: [0, -8, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
        <motion.div className="absolute top-20 right-1/4 w-10 h-10 border-2 border-neo-black bg-white dark:bg-gray-800"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-neo-yellow dark:bg-gray-800 border-2 border-neo-black dark:border-neo-yellow px-4 py-1 -rotate-1 mb-3">
            <h1 className="text-2xl font-black tracking-tight">NEOFORM</h1>
          </div>
          <p className="text-neo-black dark:text-gray-100 font-bold mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="input pl-10 pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-black">
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-bold text-neo-blue underline">Forgot password?</Link>
          </div>
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-neo-black dark:border-gray-600" /></div>
          <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-sm font-bold text-neo-black dark:text-gray-100">or</span></div>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleGoogle}
          className="btn w-full bg-white dark:bg-gray-800 dark:border-neo-blue dark:text-gray-100 hover:bg-gray-50 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </motion.button>
        <p className="text-sm font-bold text-center mt-3 px-3 py-2 border-2 border-neo-black bg-red-600 dark:bg-red-800 text-white text-neo-black rounded-none shadow-neo-sm">
          Mohon maaf, jika anda menggunakan aplikasi mobile, hanya support login email & password.🙏😥
        </p>

        <p className="text-center text-sm font-bold text-neo-black dark:text-gray-100 mt-6">
          Don't have an account? <Link to="/register" className="text-neo-blue underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
