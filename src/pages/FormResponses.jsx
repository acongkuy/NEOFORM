import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDownload, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi'
import { getForm } from '../services/formService'
import { getFormResponses, deleteResponse } from '../services/responseService'
import { PageLoading } from '../components/ui/Loading'
import { Modal } from '../components/ui/Modal'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export function FormResponses() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [page, setPage] = useState(0)
  const perPage = 10

  useEffect(() => {
    const load = async () => {
      const f = await getForm(id)
      if (!f) { navigate('/'); return }
      setForm(f)
      const r = await getFormResponses(id)
      setResponses(r)
      setLoading(false)
    }
    load()
  }, [id])

  const handleDelete = async (respId) => {
    if (!confirm('Delete this response?')) return
    try {
      await deleteResponse(respId)
      setResponses(responses.filter(r => r.id !== respId))
      toast.success('Response deleted')
    } catch {
      toast.error('Failed to delete response')
    }
  }

  const exportExcel = () => {
    const headers = form.questions.filter(q => !['heading', 'description', 'divider', 'section'].includes(q.type)).map(q => q.title)
    const data = responses.map(r => {
      const row = {}
      headers.forEach(h => {
        const q = form.questions.find(qq => qq.title === h)
        row[h] = r.answers?.[q?.id] || ''
      })
      return row
    })
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    XLSX.writeFile(wb, `${form.title || 'responses'}.xlsx`)
    toast.success('Excel exported')
  }

  const answerQuestions = form?.questions?.filter(q => !['heading', 'description', 'divider', 'section'].includes(q.type)) || []

  const filtered = responses.filter(r => {
    if (!search) return true
    return Object.values(r.answers || {}).some(v =>
      String(v || '').toLowerCase().includes(search.toLowerCase()))
  })

  const paged = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const renderCell = (val) => {
    if (val == null) return '-'
    if (Array.isArray(val)) return val.join(', ')
    if (typeof val === 'string') {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        return (
          <a href={val} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-primary-600 hover:underline">
            <FiExternalLink size={12} /> File
          </a>
        )
      }
      return val
    }
    return String(val)
  }

  if (loading) return <PageLoading />

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2"><FiArrowLeft size={18} /></button>
          <div>
            <h1 className="text-xl font-black">{form?.title || 'Responses'}</h1>
            <p className="text-sm font-bold text-neo-black dark:text-gray-100">{filtered.length} responses</p>
          </div>
        </div>
        <button onClick={exportExcel} className="btn-ghost text-sm"><FiDownload size={14} className="mr-1 inline" /> <span className="hidden sm:inline">Excel</span></button>
      </div>

      <div className="relative max-w-md mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neo-black" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search responses..."
          className="input pl-10" />
      </div>

      {paged.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-bold text-neo-black dark:text-gray-100">{search ? 'No matching responses' : 'No responses yet'}</p>
          {!search && <p className="text-sm font-bold mt-1">Share your form to start collecting responses</p>}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-neo-black dark:border-neo-blue bg-neo-yellow dark:bg-gray-900">
                  <th className="text-left p-3 font-bold text-neo-black dark:text-gray-100 whitespace-nowrap">#</th>
                  <th className="text-left p-3 font-bold text-neo-black dark:text-gray-100 whitespace-nowrap">Date</th>
                  {answerQuestions.map(q => (
                    <th key={q.id} className="text-left p-3 font-bold text-neo-black dark:text-gray-100 whitespace-nowrap">{q.title || 'Question'}</th>
                  ))}
                  <th className="text-right p-3 font-bold text-neo-black dark:text-gray-100 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {paged.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0, rotateX: 90 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03, type: 'spring', stiffness: 180, damping: 17 }} className="border-b-2 border-neo-black dark:border-gray-700 hover:bg-neo-yellow/20 dark:hover:bg-neo-blue/10 cursor-pointer"
                    onClick={() => setSelectedResponse(r)}>
                    <td className="p-3 font-bold text-neo-black dark:text-gray-100 whitespace-nowrap">{page * perPage + i + 1}</td>
                    <td className="p-3 font-bold whitespace-nowrap">{formatDate(r.createdAt)}</td>
                    {answerQuestions.map(q => (
                      <td key={q.id} className="p-3 max-w-[200px] truncate font-bold">{renderCell(r.answers?.[q.id])}</td>
                    ))}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
                        className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white shadow-neo-sm transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t-2 border-neo-black bg-neo-yellow dark:bg-gray-900 dark:border-neo-purple">
              <span className="text-sm font-bold">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                  className="btn-ghost p-1"><FiChevronLeft size={16} /></button>
                <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                  className="btn-ghost p-1"><FiChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={!!selectedResponse} onClose={() => setSelectedResponse(null)} title="Response Detail" size="lg">
        {selectedResponse && (
          <div className="space-y-4">
            <p className="text-sm font-bold">Submitted {formatDate(selectedResponse.createdAt)}</p>
            {answerQuestions.map(q => (
              <div key={q.id}>
                <label className="text-sm font-black">{q.title}</label>
                <p className="text-sm font-bold mt-0.5 break-all">
                  {(() => {
                    const v = selectedResponse.answers?.[q.id]
                    if (v == null) return '-'
                    if (Array.isArray(v)) return v.join(', ')
                    if (typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://')))
                      return <a href={v} target="_blank" rel="noreferrer" className="text-neo-blue underline flex items-center gap-1"><FiExternalLink size={14} /> {v}</a>
                    return String(v)
                  })()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
