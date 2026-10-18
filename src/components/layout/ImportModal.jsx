import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDownload } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getReceivedForms, getUserProfile, markSharedFormImported } from '../../services/friendService'
import { createForm } from '../../services/formService'
import toast from 'react-hot-toast'

export function ImportModal({ open, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !user) return
    load()
  }, [open, user])

  const load = async () => {
    setLoading(true)
    const all = await getReceivedForms(user.uid)
    const unimported = all.filter(f => !f.imported)
    setForms(unimported)
    const ids = [...new Set(unimported.map(f => f.fromId))]
    const map = {}
    await Promise.all(ids.map(async id => {
      const p = await getUserProfile(id)
      if (p) map[id] = p
    }))
    setProfiles(map)
    setLoading(false)
  }

  const handleImport = async (form) => {
    try {
      const docRef = await createForm({
        userId: user.uid,
        title: form.title || 'Untitled',
        description: form.description || '',
        questions: form.questions || [],
        settings: form.settings || {}
      })
      await markSharedFormImported(form.id)
      setForms(prev => prev.filter(f => f.id !== form.id))
      toast.success('Form imported!')
      navigate(`/edit/${docRef.id}`)
      onClose()
    } catch { toast.error('Failed to import form') }
  }

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
              <h2 className="font-black text-lg">Import from Friends</h2>
              <button onClick={onClose} className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white transition-all">
                <FiX size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-center font-bold py-8">Loading...</p>
              ) : forms.length === 0 ? (
                <p className="text-center font-bold text-gray-500 py-8">No incoming forms</p>
              ) : forms.map((f, i) => {
                const p = profiles[f.fromId]
                return (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-2 border-neo-black dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      {p?.photoURL ? <img src={p.photoURL} className="w-8 h-8 rounded-full border-2 border-neo-black" /> : <div className="w-8 h-8 rounded-full border-2 border-neo-black bg-neo-yellow flex items-center justify-center text-xs font-bold">?</div>}
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{p?.displayName || f.fromId}</p>
                        <p className="font-bold text-xs truncate">{f.title || 'Untitled'}</p>
                      </div>
                    </div>
                    {f.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{f.notes}</p>}
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleImport(f)}
                      className="px-3 py-1.5 border-2 border-neo-black bg-neo-green/10 hover:bg-neo-green hover:text-white font-bold text-sm transition-all flex items-center gap-1">
                      <FiDownload size={14} /> Import
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function useUnimportedCount(user) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!user) return
    const fn = async () => {
      const all = await getReceivedForms(user.uid)
      setCount(all.filter(f => !f.imported).length)
    }
    fn()
    const interval = setInterval(fn, 30000)
    return () => clearInterval(interval)
  }, [user])
  return count
}
