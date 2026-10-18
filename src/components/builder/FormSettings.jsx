import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiUser, FiClipboard, FiSend, FiDownload } from 'react-icons/fi'
import { getFriends, getFriendsWithProfiles, shareFormToFriend, getReceivedForms } from '../../services/friendService'
import toast from 'react-hot-toast'

const SHAPE_OPTIONS = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'cross', label: 'Cross' },
  { value: 'line', label: 'Line' },
  { value: 'dot', label: 'Dot' },
]

let shapeIdCounter = 1

export function FormSettings({ settings, onChange, onPaste, formData, userId, onImportForm }) {
  const [clipboard, setClipboard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('neoform_clipboard')) }
    catch { return null }
  })
  const [friends, setFriends] = useState([])
  const [received, setReceived] = useState([])
  const [selectedFriend, setSelectedFriend] = useState('')
  const [shareNotes, setShareNotes] = useState('')

  useEffect(() => {
    if (userId) {
      getFriendsWithProfiles(userId).then(setFriends)
      getReceivedForms(userId).then(setReceived)
    }
  }, [userId])

  const handleSend = async () => {
    if (!selectedFriend) { toast.error('Select a friend'); return }
    try {
      await shareFormToFriend(userId, selectedFriend, formData, shareNotes)
      toast.success('Form sent to friend!')
      setSelectedFriend(''); setShareNotes('')
    } catch { toast.error('Failed to send form') }
  }

  const update = (key, val) => onChange({ ...settings, [key]: val })
  const deco = settings.decorations || {}
  const shapes = deco.shapes || []
  const updateDeco = (key, val) => onChange({ ...settings, decorations: { ...deco, [key]: val } })

  const addShape = () => {
    const newShape = { id: Date.now(), type: 'circle', color: '#FFD43B' }
    updateDeco('shapes', [...shapes, newShape])
  }

  const updateShape = (id, key, val) => {
    updateDeco('shapes', shapes.map(s => s.id === id ? { ...s, [key]: val } : s))
  }

  const removeShape = (id) => {
    updateDeco('shapes', shapes.filter(s => s.id !== id))
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-6 mb-6 space-y-4">
      <h3 className="font-black uppercase tracking-wide">Form Settings</h3>
      {clipboard && (
        <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => { onPaste?.(clipboard); setClipboard(null) }}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-neo-black dark:border-neo-green bg-neo-green/10 hover:bg-neo-green hover:text-white font-bold text-sm transition-all">
          <FiClipboard size={16} /> Paste Copied Form ({clipboard.questions?.length || 0} questions)
        </motion.button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold">Theme Color</label>
          <input type="color" value={settings.themeColor || '#FFD43B'} onChange={e => update('themeColor', e.target.value)}
            className="input h-10 p-1" />
        </div>
        <div>
          <label className="text-sm font-bold">Background</label>
          <input type="color" value={settings.background || '#FFFDF7'} onChange={e => update('background', e.target.value)}
            className="input h-10 p-1" />
        </div>
        <div>
          <label className="text-sm font-bold">Success Message</label>
          <input value={settings.successMessage || ''} onChange={e => update('successMessage', e.target.value)}
            placeholder="Thank you!" className="input" />
        </div>
        <div>
          <label className="text-sm font-bold">Logo URL</label>
          <input value={settings.logo || ''} onChange={e => update('logo', e.target.value)}
            placeholder="https://..." className="input" />
        </div>
        <div>
          <label className="text-sm font-bold flex items-center gap-1"><FiUser size={14} /> Small Photo</label>
          <input value={settings.smallPhoto || ''} onChange={e => update('smallPhoto', e.target.value)}
            placeholder="https://..." className="input" />
        </div>
        <div>
          <label className="text-sm font-bold">Drive Folder Link</label>
          <input value={settings.driveFolder || ''} onChange={e => update('driveFolder', e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..." className="input" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          { key: 'acceptResponses', label: 'Accept Responses' },
          { key: 'requireLogin', label: 'Require Login' },
          { key: 'collectEmail', label: 'Collect Email' },
          { key: 'shuffleQuestions', label: 'Shuffle Questions' },
          { key: 'shuffleOptions', label: 'Shuffle Options' }
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={settings[key] ?? (key === 'acceptResponses')} onChange={e => update(key, e.target.checked)}
              className="border-2 border-neo-black accent-neo-yellow" /> {label}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold">Max Responses</label>
        <input type="number" value={settings.maxResponses ?? ''} onChange={e => update('maxResponses', e.target.value ? Number(e.target.value) : null)}
          className="input w-24 py-1.5" placeholder="Unlimited" />
      </div>

      <div className="border-t-2 border-neo-black dark:border-gray-700 pt-4 space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={deco.enabled || false} onChange={e => updateDeco('enabled', e.target.checked)}
            className="border-2 border-neo-black accent-neo-yellow" /> Decorative Shapes
        </label>
        {deco.enabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pl-4">
            {shapes.map(s => (
              <div key={s.id} className="flex items-center gap-2 border-2 border-neo-black dark:border-gray-600 p-2 bg-white dark:bg-gray-800">
                <select value={s.type} onChange={e => updateShape(s.id, 'type', e.target.value)}
                  className="input py-1 text-sm w-24">
                  {SHAPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input type="color" value={s.color || '#FFD43B'} onChange={e => updateShape(s.id, 'color', e.target.value)}
                  className="input h-8 w-12 p-0.5" />
                <button onClick={() => removeShape(s.id)} className="p-1 border-2 border-neo-black dark:border-neo-pink hover:bg-neo-pink hover:text-white transition-colors">
                  <FiX size={14} />
                </button>
              </div>
            ))}
            <button onClick={addShape} className="flex items-center gap-1 text-sm font-bold px-2 py-1 border-2 border-neo-black dark:border-gray-600 hover:bg-neo-yellow/30 dark:hover:bg-neo-blue/20 transition-colors">
              <FiPlus size={14} /> Add Shape
            </button>
          </motion.div>
        )}
      </div>

      <div className="border-t-2 border-neo-black dark:border-gray-700 pt-4 space-y-3">
        <h4 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2"><FiSend size={14} /> Share Form</h4>
        <select value={selectedFriend} onChange={e => setSelectedFriend(e.target.value)}
          className="input py-1.5 text-sm w-full">
          <option value="">Select a friend...</option>
          {friends.map(f => <option key={f.id} value={f.friendId}>{f.friendPhoto ? '🖼 ' : ''}{f.friendName}</option>)}
        </select>
        <input value={shareNotes} onChange={e => setShareNotes(e.target.value)}
          placeholder="Notes for your friend..." className="input py-1.5 text-sm w-full" />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!selectedFriend}
          className="px-3 py-2 border-2 border-neo-black bg-neo-yellow font-bold text-sm shadow-neo-sm hover:shadow-neo transition-all disabled:opacity-50 flex items-center gap-2">
          <FiSend size={14} /> Send to Friend
        </motion.button>
      </div>

      <div className="border-t-2 border-neo-black dark:border-gray-700 pt-4 space-y-3">
        <h4 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2"><FiDownload size={14} /> Import from Shared</h4>
        {received.length === 0 ? (
          <p className="text-sm font-bold text-gray-500">No shared forms yet</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {received.filter(r => !r.imported).map(r => (
              <div key={r.id} className="border-2 border-neo-black dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
                <p className="font-bold text-sm truncate">{r.title || 'Untitled'}</p>
                {r.notes && <p className="text-xs font-bold text-gray-500 mt-0.5 truncate">{r.notes}</p>}
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => onImportForm?.(r)}
                  className="mt-2 px-2 py-1 border-2 border-neo-black bg-neo-green/10 hover:bg-neo-green hover:text-white font-bold text-xs transition-all flex items-center gap-1">
                  <FiDownload size={12} /> Import
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
