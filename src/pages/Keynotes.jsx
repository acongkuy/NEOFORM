import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiHeart } from 'react-icons/fi'

export function Keynotes() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neo-bg dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-8 left-12 w-32 h-32 rounded-full border-2 border-neo-black bg-neo-yellow/20 dark:bg-neo-yellow/10"
          animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-16 right-8 w-24 h-24 border-2 border-neo-black bg-neo-pink/20 dark:bg-neo-pink/10 rotate-12"
          animate={{ y: [0, 10, 0], rotate: [12, 30, 12] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
        <motion.div className="absolute top-36 right-32 w-16 h-16 border-2 border-neo-black bg-neo-blue/20 dark:bg-neo-blue/10 rotate-45"
          animate={{ y: [0, -12, 0], rotate: [45, 80, 45] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-36 left-16 w-5 h-5 rounded-full border-2 border-neo-black bg-neo-green"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} />
        <motion.div className="absolute top-1/4 right-1/4 w-4 h-12 border-2 border-neo-black bg-neo-orange/40"
          animate={{ y: [0, -6, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative z-10 text-center">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <FiHeart size={48} className="mx-auto mb-4 text-neo-pink" />
        </motion.div>
        <h1 className="text-2xl font-black mb-4">Keynotes</h1>
        <p className="font-bold text-neo-black dark:text-gray-100 text-lg leading-relaxed">
          Halooo makasih semuanyaa yang udah pake project ini dan support aku ❤️
        </p>
        <button onClick={() => navigate(-1)}
          className="mt-6 btn-primary inline-flex items-center gap-2">
          <FiArrowLeft size={16} /> Back
        </button>
      </motion.div>
    </div>
  )
}
