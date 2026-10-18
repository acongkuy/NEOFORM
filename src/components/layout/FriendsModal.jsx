import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUserPlus, FiUserCheck, FiUserX, FiSend, FiCopy } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getFriends, getFriendsWithProfiles, getPendingRequests, getSentRequests, sendFriendRequest, acceptRequest, declineRequest, removeFriend, getUserProfile } from '../../services/friendService'
import toast from 'react-hot-toast'

export function FriendsModal({ open, onClose }) {
  const { user } = useAuth()
  const [tab, setTab] = useState('requests')
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [sent, setSent] = useState([])
  const [friendInput, setFriendInput] = useState('')
  const [reqProfiles, setReqProfiles] = useState({})
  const [sentProfiles, setSentProfiles] = useState({})

  useEffect(() => {
    if (!open || !user) return
    load()
  }, [open, user])

  const load = async () => {
    setFriends(await getFriendsWithProfiles(user.uid))
    const reqs = await getPendingRequests(user.uid)
    setRequests(reqs)
    const s = await getSentRequests(user.uid)
    setSent(s)
    const ids = [...new Set([...reqs.map(r => r.fromId), ...s.map(r => r.toId)])]
    const profiles = {}
    await Promise.all(ids.map(async id => {
      const p = await getUserProfile(id)
      if (p) profiles[id] = p
    }))
    setReqProfiles(profiles)
    setSentProfiles(profiles)
  }

  const handleSendRequest = async () => {
    const id = friendInput.trim()
    if (!id || id === user.uid) { toast.error('Invalid UID'); return }
    try {
      await sendFriendRequest(user.uid, id)
      toast.success('Request sent!')
      setFriendInput('')
      load()
    } catch (err) { toast.error(err.message || 'Failed to send request') }
  }

  const handleAccept = async (req) => {
    await acceptRequest(req.id, user.uid, req.fromId)
    toast.success('Friend added!')
    load()
  }

  const handleDecline = async (req) => {
    await declineRequest(req.id)
    toast.success('Request declined')
    load()
  }

  const handleRemove = async (f, other) => {
    if (!confirm('Remove friend?')) return
    await removeFriend(f.id)
    const otherDocs = await getFriends(other)
    const match = otherDocs.find(d => d.friendId === user.uid)
    if (match) await removeFriend(match.id)
    toast.success('Friend removed')
    load()
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
              <h2 className="font-black text-lg">Friends</h2>
              <button onClick={onClose} className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white transition-all">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <input value={friendInput} onChange={e => setFriendInput(e.target.value)}
                  placeholder="Paste friend's UID to send request" className="input flex-1 text-sm font-mono" />
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleSendRequest} disabled={!friendInput.trim()}
                  className="px-3 py-2 border-2 border-neo-black bg-neo-yellow font-bold text-sm shadow-neo-sm hover:shadow-neo transition-all disabled:opacity-50 flex items-center gap-1 shrink-0">
                  <FiSend size={14} /> Send
                </motion.button>
              </div>

              <div className="flex border-2 border-neo-black dark:border-gray-600 overflow-hidden">
                {[
                  { id: 'requests', label: `Requests (${requests.length})`, icon: FiUserPlus },
                  { id: 'friends', label: `Friends (${friends.length})`, icon: FiUserCheck },
                  { id: 'sent', label: `Sent (${sent.length})`, icon: FiSend },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold transition-colors ${tab === t.id ? 'bg-neo-yellow dark:bg-neo-blue dark:text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-100'}`}>
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>

              {tab === 'requests' && (
                requests.length === 0
                  ? <p className="text-sm font-bold text-gray-500 text-center py-4">No pending requests</p>
                  : <div className="space-y-2">
                      {requests.map(r => {
                        const p = reqProfiles[r.fromId]
                        return (
                        <div key={r.id} className="border-2 border-neo-black dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {p?.photoURL ? <img src={p.photoURL} className="w-7 h-7 rounded-full border-2 border-neo-black shrink-0" /> : <div className="w-7 h-7 rounded-full border-2 border-neo-black bg-neo-yellow flex items-center justify-center text-xs font-bold shrink-0">?</div>}
                            <span className="text-sm font-bold truncate">{p?.displayName || r.fromId}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleAccept(r)}
                              className="px-2 py-1 border-2 border-neo-black bg-neo-green/10 hover:bg-neo-green hover:text-white font-bold text-xs transition-all">Accept</button>
                            <button onClick={() => handleDecline(r)}
                              className="px-2 py-1 border-2 border-neo-black bg-neo-pink/10 hover:bg-neo-pink hover:text-white font-bold text-xs transition-all">Decline</button>
                          </div>
                        </div>
                      )})}
                    </div>
              )}

              {tab === 'friends' && (
                friends.length === 0
                  ? <p className="text-sm font-bold text-gray-500 text-center py-4">No friends yet</p>
                  : <div className="space-y-2">
                      {friends.map(f => (
                        <div key={f.id} className="border-2 border-neo-black dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {f.friendPhoto ? <img src={f.friendPhoto} className="w-7 h-7 rounded-full border-2 border-neo-black shrink-0" /> : <div className="w-7 h-7 rounded-full border-2 border-neo-black bg-neo-yellow flex items-center justify-center text-xs font-bold shrink-0">?</div>}
                            <span className="text-sm font-bold truncate">{f.friendName}</span>
                          </div>
                          <button onClick={() => handleRemove(f, f.friendId)}
                            className="p-1 border-2 border-neo-black dark:border-neo-pink hover:bg-neo-pink hover:text-white transition-all shrink-0">
                            <FiUserX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
              )}

              {tab === 'sent' && (
                sent.length === 0
                  ? <p className="text-sm font-bold text-gray-500 text-center py-4">No sent requests</p>
                  : <div className="space-y-2">
                      {sent.map(r => {
                        const p = sentProfiles[r.toId]
                        return (
                        <div key={r.id} className="border-2 border-neo-black dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            {p?.photoURL ? <img src={p.photoURL} className="w-7 h-7 rounded-full border-2 border-neo-black shrink-0" /> : <div className="w-7 h-7 rounded-full border-2 border-neo-black bg-neo-yellow flex items-center justify-center text-xs font-bold shrink-0">?</div>}
                            <span className="text-sm font-bold truncate">{p?.displayName || r.toId}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-500">Pending</span>
                        </div>
                      )})}
                    </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function usePendingRequests(user) {
  const [pending, setPending] = useState(false)
  useEffect(() => {
    if (!user) return
    const fn = async () => {
      const reqs = await getPendingRequests(user.uid)
      setPending(reqs.length > 0)
    }
    fn()
    const interval = setInterval(fn, 30000)
    return () => clearInterval(interval)
  }, [user])
  return pending
}
