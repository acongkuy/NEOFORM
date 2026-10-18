import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUser, FiCopy } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/config'
import toast from 'react-hot-toast'

export function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '')
  const [saving, setSaving] = useState(false)

  const handleSaveUrl = async () => {
    if (!photoUrl.trim()) return
    setSaving(true)
    try {
      await updateProfile(auth.currentUser, { photoURL: photoUrl.trim() })
      toast.success('Profile photo updated!')
    } catch (err) { toast.error(err.message) }
    setSaving(false)
  }

  const handleRemove = async () => {
    setPhotoUrl('')
    try {
      await updateProfile(auth.currentUser, { photoURL: '' })
      toast.success('Profile photo removed')
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
          <FiArrowLeft size={18} />
        </button>
        <motion.h1 initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="text-2xl font-black">Settings</motion.h1>
      </div>

      <motion.section initial={{ opacity: 0, rotateX: 90 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 17 }} className="card p-6 space-y-4">
        <h2 className="font-bold text-lg">Appearance</h2>
        <div className="flex gap-2">
          {['light', 'dark'].map(t => (
            <motion.button key={t} whileTap={{ rotate: 5 }} onClick={() => setTheme(t)}
              className={`px-4 py-2 border-2 border-neo-black font-bold uppercase tracking-wide transition-all duration-100
                ${theme === t ? 'bg-neo-yellow dark:bg-gray-800 dark:border-neo-yellow text-neo-black shadow-neo' : 'bg-white dark:bg-gray-800 dark:border-neo-blue text-neo-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-neo-sm'}`}>
              {t}
            </motion.button>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, rotateX: 90 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 17 }} className="card p-6 space-y-4">
        <h2 className="font-bold text-lg">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-neo-black rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 flex-shrink-0">
            {photoUrl
              ? <img src={photoUrl} className="w-full h-full object-cover" />
              : <FiUser size={24} className="text-gray-400" />}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                placeholder="Paste image URL or Gravatar link" className="input flex-1 text-sm" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSaveUrl} disabled={saving || !photoUrl.trim()}
                className="px-3 py-2 border-2 border-neo-black bg-neo-yellow font-bold text-sm shadow-neo-sm hover:shadow-neo transition-all disabled:opacity-50">
                {saving ? '...' : 'Save'}
              </motion.button>
            </div>
            {photoUrl && (
              <button onClick={handleRemove} className="text-xs font-bold text-neo-pink underline">Remove</button>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, rotateX: 90 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 17 }} className="card p-6 space-y-4">
        <h2 className="font-bold text-lg">Account</h2>
        <div className="text-sm font-bold text-neo-black dark:text-gray-100 space-y-1">
          <p>Email: {user?.email}</p>
          <p>Name: {user?.displayName || 'Not set'}</p>
          <p>UID: <code className="text-xs bg-neo-yellow dark:bg-gray-800 dark:border-neo-green border-2 border-neo-black px-2 py-0.5">{user?.uid}</code>
            <button onClick={() => { navigator.clipboard.writeText(user?.uid); toast.success('UID copied!') }}
              className="ml-2 p-1 border-2 border-neo-black dark:border-neo-blue hover:bg-neo-blue hover:text-white transition-all align-middle">
              <FiCopy size={12} />
            </button>
          </p>
        </div>
      </motion.section>
    </div>
  )
}
