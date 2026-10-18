import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="text-center card p-8">
        <motion.h1 initial={{ scale: 0.5, rotate: -5 }} animate={{ scale: 1, rotate: 0, y: [0, -5, 0] }} transition={{ duration: 0.5, y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
          className="text-7xl font-black text-neo-yellow" style={{ textShadow: '4px 4px 0px #1A1A1A' }}>404</motion.h1>
        <p className="text-xl font-bold mt-2 mb-6">Page not found</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2"><FiHome size={16} /> Go Home</Link>
      </div>
    </div>
  )
}
