import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getUserForms, deleteForm, getForm } from '../services/formService'
import { getResponseCount } from '../services/responseService'
import { FormCard } from '../components/forms/FormCard'
import { Spinner } from '../components/ui/Loading'
import { Modal } from '../components/ui/Modal'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [shareForm, setShareForm] = useState(null)


  const loadForms = async (uid) => {
    const f = await getUserForms(uid)
    const withCounts = await Promise.all(f.map(async (form) => {
      const count = await getResponseCount(form.id)
      return { ...form, responseCount: count }
    }))
    setForms(withCounts)
  }

  useEffect(() => {
    if (!user) return
    setLoading(true)
    loadForms(user.uid).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Delete this form? This cannot be undone.')) return
    try {
      await deleteForm(id)
      setForms(forms.filter(f => f.id !== id))
      toast.success('Form deleted')
    } catch {
      toast.error('Failed to delete form')
    }
  }

  const handleCopy = async (id) => {
    try {
      const form = await getForm(id)
      if (!form) { toast.error('Form not found'); return }
      localStorage.setItem('neoform_clipboard', JSON.stringify({
        questions: form.questions || [],
        settings: form.settings || {}
      }))
      toast.success('Form copied! Paste di form baru')
    } catch {
      toast.error('Failed to copy form')
    }
  }

  const filtered = forms
    .filter(f => (f.title || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return (a.title || '').localeCompare(b.title || '')
      if (sort === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)
    })

  return (<div className="max-w-7xl mx-auto p-6 relative">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <motion.div initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
          <motion.div className="h-1 w-20 bg-gradient-to-r from-neo-yellow via-neo-pink to-neo-blue dark:from-neo-yellow dark:via-neo-blue dark:to-neo-purple rounded-full mb-3"
            animate={{ width: ['5rem', '8rem', '5rem'] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
          <h1 className="text-3xl font-black dark:text-gray-100">My Forms</h1>
          <p className="text-neo-black dark:text-gray-400 font-bold text-sm mt-1">{forms.length} form{forms.length !== 1 ? 's' : ''} total</p>
        </motion.div>
        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} onClick={() => navigate('/create')} className="btn-primary flex items-center gap-2">
          <FiPlus size={18} /> New Form
        </motion.button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black dark:text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search forms..."
            className="input pl-10" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input w-auto">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? <Spinner /> : (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(form => (
            <motion.div key={form.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <FormCard form={form}
                onEdit={(id) => navigate(`/edit/${id}`)}
                onDelete={handleDelete}
                onDuplicate={handleCopy}
                onShare={(f) => setShareForm(f)}
                onResponses={(id) => navigate(`/responses/${id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div className="absolute bottom-20 left-10 w-16 h-16 rounded-full border-2 border-neo-black bg-neo-yellow/10 dark:bg-neo-yellow/5 pointer-events-none"
        animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} />
      <motion.div className="absolute top-40 right-16 w-12 h-12 rounded-full border-2 border-neo-black bg-neo-purple/10 dark:bg-neo-purple/5 pointer-events-none"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-60 right-20 w-20 h-20 rounded-full border-2 border-neo-black bg-neo-blue/10 dark:bg-neo-blue/5 pointer-events-none"
        animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }} />

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neo-black dark:text-gray-100 font-bold text-lg mb-2">{search ? 'No forms match your search' : 'No forms yet'}</p>
          {!search && <button onClick={() => navigate('/create')} className="btn-primary mt-2">Create your first form</button>}
        </div>
      )}


      <Modal open={!!shareForm} onClose={() => setShareForm(null)} title="Share Form" size="sm">
        {shareForm && (
          <div className="space-y-4 text-center">
            <p className="text-sm font-bold text-neo-black dark:text-gray-100">Anyone with this link can fill your form</p>
            <div className="flex items-center gap-2">
              <input readOnly value={`${window.location.origin}/form/${shareForm.id}`} className="input flex-1 text-sm" />
              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/form/${shareForm.id}`); toast.success('Copied!') }}
                className="btn-primary text-sm">Copy</button>
            </div>
            <div className="flex justify-center">
              <div className="card p-4 inline-block">
                <QRCodeSVG value={`${window.location.origin}/form/${shareForm.id}`} size={160} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}