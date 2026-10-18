import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neo-black/60" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`relative ${sizes[size]} w-full card p-6 max-h-[90vh] overflow-y-auto z-10`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black">{title}</h2>
              <button onClick={onClose} className="p-1.5 border-2 border-neo-black bg-white hover:bg-neo-pink hover:text-white shadow-neo-sm transition-all"><FiX size={20} /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
