import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi'
import { RenderQuestion } from '../forms/RenderQuestion'

export function Preview({ title, description, questions }) {
  const [device, setDevice] = useState('desktop')
  const devices = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { id: 'desktop', icon: FiMonitor },
          { id: 'tablet', icon: FiTablet },
          { id: 'mobile', icon: FiSmartphone }
        ].map((d, i) => (
          <motion.button key={d.id} initial={{ opacity: 0, rotate: -180 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 14 }} onClick={() => setDevice(d.id)}
            className={`p-2 border-2 border-neo-black dark:border-neo-blue transition-all ${device === d.id ? 'bg-neo-yellow dark:bg-gray-800 shadow-neo-sm' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-neo-sm'}`}>
            <d.icon size={18} />
          </motion.button>
        ))}
      </div>

      <motion.div layout initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} className={`mx-auto ${devices[device]} card p-6 space-y-4`}>
        {title && <h1 className="text-2xl font-black">{title}</h1>}
        {description && <p className="font-bold">{description}</p>}
        {questions.map((q, i) => (
          <RenderQuestion key={q.id} question={{ ...q, preview: true }} />
        ))}
        {questions.length === 0 && <p className="text-center font-bold py-8">No questions yet</p>}
      </motion.div>
    </div>
  )
}
