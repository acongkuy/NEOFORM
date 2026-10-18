import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLogOut, FiSettings, FiSun, FiMoon, FiUser, FiMenu, FiSmartphone, FiHeart, FiAlertCircle, FiHelpCircle, FiBell, FiUsers, FiDownload } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { logoutUser } from '../../firebase/auth'
import { HelpModal } from './HelpModal'
import { NewsModal, useHasUnread } from './NewsModal'
import { FriendsModal, usePendingRequests } from './FriendsModal'
import { ImportModal, useUnimportedCount } from './ImportModal'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [newsOpen, setNewsOpen] = useState(false)
  const [friendsOpen, setFriendsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const hasUnread = useHasUnread(user)
  const hasPending = usePendingRequests(user)
  const importCount = useUnimportedCount(user)
  const menuRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => { await logoutUser(); navigate('/login') }

  return (
    <nav className="bg-neo-yellow border-b-2 border-neo-black sticky top-0 z-40 dark:bg-gray-900 dark:border-neo-pink">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tight text-neo-black dark:text-gray-100">
            <motion.span initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} className="inline-block"
              style={{ animationDelay: '0s' }}>N</motion.span>
            <motion.span initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} className="inline-block"
              style={{ animationDelay: '0.05s' }}>E</motion.span>
            <motion.span initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} className="inline-block"
              style={{ animationDelay: '0.1s' }}>O</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block"
              style={{ animationDelay: '0.15s' }}>F</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block"
              style={{ animationDelay: '0.2s' }}>O</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block"
              style={{ animationDelay: '0.25s' }}>R</motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block"
              style={{ animationDelay: '0.3s' }}>M</motion.span>
          </Link>
        {user && (
          <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue dark:text-gray-100 shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue dark:text-gray-100 shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <FiMenu size={18} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: 0.95 }} transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-neo-black dark:border-neo-blue shadow-neo z-50 origin-top-right">
                    <a href="/neoform.apk" download onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <FiSmartphone size={16} /> Download App
                    </a>
                    <button onClick={() => { setMenuOpen(false); setFriendsOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <span className="relative">
                        <FiUsers size={16} />
                        {hasPending && <span className="absolute -top-1 -right-1 w-2 h-2 bg-neo-pink rounded-full" />}
                      </span> Friends
                    </button>
                    <button onClick={() => { setMenuOpen(false); setImportOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <span className="relative">
                        <FiDownload size={16} />
                        {importCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-neo-pink text-white text-[9px] font-bold rounded-full flex items-center justify-center">{importCount}</span>}
                      </span> Import
                    </button>
                    <button onClick={() => { setMenuOpen(false); setNewsOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <span className="relative">
                        <FiBell size={16} />
                        {hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-neo-pink rounded-full" />}
                      </span> What's New
                    </button>
                    <button onClick={() => { setMenuOpen(false); setHelpOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <FiHelpCircle size={16} /> Help
                    </button>
                    <Link to="/settings" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <FiSettings size={16} /> Settings
                    </Link>
                    <Link to="/keynotes" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <FiHeart size={16} /> Keynotes
                    </Link>
                    <a href="https://gravatar.com/chunsky" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
                      <FiAlertCircle size={16} /> Report
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-purple hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                {user.photoURL ? <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" /> : <FiUser size={16} />}
                <span className="text-sm font-bold hidden sm:inline">{user.displayName || user.email}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: 0.95 }} transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border-2 border-neo-black dark:border-neo-purple shadow-neo z-50 origin-top-right p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border-2 border-neo-black" /> : <div className="w-10 h-10 rounded-full border-2 border-neo-black bg-neo-yellow flex items-center justify-center"><FiUser size={18} /></div>}
                      <div className="min-w-0">
                        <p className="font-black text-sm truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs font-bold text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { setProfileOpen(false); handleLogout() }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white shadow-neo-sm hover:shadow-neo transition-all text-sm font-bold text-red-500 dark:text-neo-pink">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <NewsModal open={newsOpen} onClose={() => setNewsOpen(false)} />
      <FriendsModal open={friendsOpen} onClose={() => setFriendsOpen(false)} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </nav>
  )
}
