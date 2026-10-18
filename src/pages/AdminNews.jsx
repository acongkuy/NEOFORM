import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getAllNews, createNews, updateNews, deleteNews } from '../services/newsService'
import toast from 'react-hot-toast'

export function AdminNews() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.email !== 'walnutacong@gmail.com') { toast.error('Access denied'); navigate('/') }
  }, [user])

  useEffect(() => { loadNews() }, [])

  const loadNews = async () => {
    setLoading(true)
    const data = await getAllNews()
    setNews(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return }
    if (editing) {
      await updateNews(editing, { title, body })
      toast.success('News updated')
    } else {
      await createNews({ title, body })
      toast.success('News created')
    }
    setEditing(null); setTitle(''); setBody('')
    loadNews()
  }

  const handleEdit = (item) => {
    setEditing(item.id); setTitle(item.title); setBody(item.body || '')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this news?')) return
    await deleteNews(id)
    toast.success('Deleted')
    loadNews()
  }

  const cancel = () => { setEditing(null); setTitle(''); setBody('') }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-ghost p-1.5"><FiArrowLeft size={20} /></button>
          <h1 className="text-2xl font-black">Admin — News</h1>
        </div>
      </div>

      <div className="card p-4 mb-6 space-y-3">
        <h2 className="font-bold">{editing ? 'Edit News' : 'New News'}</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="input" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body (markdown supported)" className="input min-h-[100px]" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave size={16} /> {editing ? 'Update' : 'Publish'}</button>
          {editing && <button onClick={cancel} className="btn-ghost flex items-center gap-2"><FiX size={16} /> Cancel</button>}
        </div>
      </div>

      {loading ? <p className="text-center font-bold">Loading...</p> : (
        <div className="space-y-3">
          {news.length === 0 && <p className="text-center font-bold text-gray-500">No news yet</p>}
          {news.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{item.title}</h3>
                {item.body && <p className="text-sm mt-1 line-clamp-2">{item.body}</p>}
                <p className="text-xs font-bold text-gray-500 mt-1">{item.createdAt?.toDate?.()?.toLocaleString() || ''}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(item)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 hover:bg-neo-blue hover:text-white transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white transition-all"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}