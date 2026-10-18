import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { resetPassword } from '../firebase/auth'
import toast from 'react-hot-toast'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try { await resetPassword(email); setSent(true); toast.success('Reset email sent!') }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neo-bg dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-16 left-12 w-24 h-24 rounded-full border-2 border-neo-black bg-neo-green/20 dark:bg-neo-green/10"
          animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-24 right-16 w-20 h-20 rounded-full border-2 border-neo-black bg-neo-orange/20 dark:bg-neo-orange/10"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative z-10">
        <Link to="/login" className="flex items-center gap-1 text-sm font-bold text-neo-blue underline mb-6"><FiArrowLeft size={14} /> Back to login</Link>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black">Reset Password</h1>
          <p className="text-neo-black dark:text-gray-100 font-bold mt-1">{sent ? 'Check your email for the reset link' : "Enter your email and we'll send you a reset link"}</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black" size={16} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input pl-10" placeholder="you@example.com" />
            </div>
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="btn-primary w-full">Send Reset Link</motion.button>
          </form>
        ) : (
          <Link to="/login" className="btn-primary block text-center">Back to Login</Link>
        )}
      </motion.div>
    </div>
  )
}
