import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { helpContent } from '../../data/helpContent'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Indonesia' },
]

export function HelpModal({ open, onClose }) {
  const [lang, setLang] = useState('id')
  const [expanded, setExpanded] = useState(null)
  const content = helpContent[lang]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neo-black/60" onClick={onClose} />
          <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-lg max-h-[80vh] bg-white dark:bg-gray-900 border-2 border-neo-black shadow-neo z-10 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-2 border-neo-black dark:border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="font-black text-lg">{content.title}</h2>
              <div className="flex items-center gap-2">
                <div className="flex border-2 border-neo-black dark:border-gray-600 overflow-hidden">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => setLang(l.code)}
                      className={`px-2 py-1 text-xs font-bold transition-colors ${lang === l.code ? 'bg-neo-yellow dark:bg-neo-blue dark:text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-100'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
                <button onClick={onClose} className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white transition-all">
                  <FiX size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {content.sections.map((s, i) => (
                <div key={i} className="border-2 border-neo-black dark:border-gray-700 overflow-hidden">
                  <button onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-neo-yellow/30 dark:hover:bg-gray-700 font-bold text-sm text-left transition-colors">
                    {s.title}
                    {expanded === i ? <FiChevronUp size={16} className="shrink-0" /> : <FiChevronDown size={16} className="shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-4 py-3 text-sm border-t-2 border-neo-black dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        {s.body}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
