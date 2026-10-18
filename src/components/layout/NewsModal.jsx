import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { getAllNews, getLastReadAt, markNewsRead } from '../../services/newsService'
import { useAuth } from '../../context/AuthContext'

export function NewsModal({ open, onClose }) {
  const { user } = useAuth()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !user) return
    setLoading(true)
    getAllNews().then(data => {
      setNews(data)
      setLoading(false)
      markNewsRead(user.uid)
    })
  }, [open, user])

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
              <h2 className="font-black text-lg">What's New</h2>
              <button onClick={onClose} className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white transition-all">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-center font-bold py-8">Loading...</p>
              ) : news.length === 0 ? (
                <p className="text-center font-bold text-gray-500 py-8">No news yet</p>
              ) : news.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-2 border-neo-black dark:border-gray-700 p-4">
                  <h3 className="font-bold">{item.title}</h3>
                  {item.body && <p className="text-sm mt-2 whitespace-pre-wrap">{item.body}</p>}
                  <p className="text-xs font-bold text-gray-500 mt-2">{item.createdAt?.toDate?.()?.toLocaleDateString() || ''}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function useHasUnread(user) {
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const fn = async () => {
      const all = await getAllNews()
      if (cancelled) return
      if (all.length === 0) { setHasUnread(false); return }
      const lastRead = await getLastReadAt(user.uid)
      if (cancelled) return
      const newest = all[0]
      const newsTime = newest.createdAt?.toDate?.() || new Date(0)
      setHasUnread(!lastRead || newsTime > lastRead)
    }
    fn()
    const interval = setInterval(fn, 30000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [user])

  return hasUnread
}