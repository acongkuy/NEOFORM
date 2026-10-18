import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiSun, FiMoon, FiSend, FiEdit3 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getForm } from '../services/formService'
import { submitResponse } from '../services/responseService'
import { uploadFile } from '../services/uploadService'
import { RenderQuestion } from '../components/forms/RenderQuestion'
import { FormDecorations } from '../components/forms/FormDecorations'
import { validateAnswer } from '../utils/validation'
import { PageLoading } from '../components/ui/Loading'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

export function PublicFormPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams()
  const { theme, setTheme } = useTheme()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const f = await getForm(id)
        if (!f) { setError('Form not found'); setLoading(false); return }
        setForm(f)
      } catch (err) {
        setError('Failed to load form')
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleAnswer = async (qId, val, isFile) => {
    if (isFile) {
      setUploading(u => ({ ...u, [qId]: 0 }))
      try {
        const url = await uploadFile(val, form?.settings?.driveFolder)
        setAnswers(a => ({ ...a, [qId]: url }))
      } catch (err) {
        toast.error('Upload failed: ' + (err.message || 'unknown error'))
      }
      setUploading(u => ({ ...u, [qId]: undefined }))
      return
    }
    setAnswers(a => ({ ...a, [qId]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form?.questions) return
    form.questions.forEach(q => {
      if (['heading', 'description', 'divider', 'section'].includes(q.type)) return
      const err = validateAnswer(q, answers[q.id])
      if (err) newErrors[q.id] = err
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setSubmitting(true)
    try {
      await submitResponse({ formId: id, answers, createdAt: new Date() })
      setSubmitted(true)
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoading />
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg dark:bg-gray-950">
      <div className="text-center card p-8">
        <FiAlertCircle size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-black mb-2">Form Not Found</h2>
        <p className="font-bold text-neo-black dark:text-gray-100">This form may have been deleted or the link is invalid.</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-4 dark:bg-gray-950 relative overflow-hidden" style={{ backgroundColor: theme === 'dark' ? undefined : (form?.settings?.background || '#FFFDF7') }}>
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full border-2 border-neo-black"
            style={{
              width: 20 + i * 20, height: 20 + i * 20,
              left: 10 + i * 15 + '%', top: 15 + i * 12 + '%',
              backgroundColor: ['#FFD43B', '#FF006E', '#3A86FF', '#06D6A0', '#FF6B35', '#8338EC'][i] + '15'
            }}
            animate={{ y: [0, -20 + i * 5, 0], rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
      <motion.div initial={{ scale: 0, rotateX: 180, opacity: 0 }} animate={{ scale: 1, rotateX: 0, opacity: 1, rotate: [0, 2, -2, 0] }} transition={{ type: 'spring', stiffness: 150, damping: 14 }} className="card p-8 max-w-md w-full text-center relative z-10">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
          <FiCheckCircle size={56} className="mx-auto mb-4 text-neo-green" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl font-black mb-2">{form?.settings?.successMessage || 'Response submitted!'}</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-bold text-neo-black dark:text-gray-100">Thank you for completing this form.</motion.p>
      </motion.div>
    </div>
  )

  const themeColor = form?.settings?.themeColor || '#6366f1'
  const questions = form?.questions?.length
    ? form.settings?.shuffleQuestions
      ? [...form.questions].sort(() => Math.random() - 0.5)
      : form.questions
    : []

  return (
    <div className="min-h-screen p-4 py-8 relative overflow-hidden dark:bg-gray-950" style={{ backgroundColor: theme === 'dark' ? undefined : (form?.settings?.background || '#FFFDF7') }}>
      <motion.div className="absolute inset-0 pointer-events-none">
        {form?.settings?.decorations?.enabled && form.settings.decorations.shapes?.length
          ? <FormDecorations shapes={form.settings.decorations.shapes} />
          : [...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full border-2 border-neo-black"
              style={{
                width: 30 + i * 24, height: 30 + i * 24,
                left: [5, 75, 60, 10, 85][i] + '%', top: [10, 15, 60, 70, 40][i] + '%',
                backgroundColor: ([, '#FFD43B', '#FF006E', '#3A86FF', '#06D6A0'][i] || '#FFD43B') + '12'
              }}
              animate={{ y: [0, -15 - i * 3, 0], rotate: [0, 360], scale: [1, 1.05 + i * 0.02, 1] }}
              transition={{ repeat: Infinity, duration: 5 + i * 1.5, ease: 'easeInOut' }}
            />
          ))}
      </motion.div>
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, rotate: -180 }} animate={{ opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="flex justify-between items-start mb-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(user ? '/' : '/login')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-neo-black bg-neo-yellow text-neo-black font-bold shadow-neo-sm hover:shadow-neo transition-all text-sm">
            <FiEdit3 size={16} />
            Make Your Form Now
          </motion.button>
          <motion.button whileHover={{ rotate: 30, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 border-2 border-neo-black dark:border-neo-yellow bg-white dark:bg-gray-800 shadow-neo-sm hover:shadow-neo transition-all">
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, rotateX: 70, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          onSubmit={handleSubmit}
          className="card p-6 space-y-5 relative" style={{ borderTop: `6px solid ${themeColor}` }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}>
            <div className="flex items-center gap-3 mb-2">
              {form?.settings?.logo && <img src={form.settings.logo} className="h-12 max-w-full object-contain" />}
              {form?.settings?.smallPhoto && (
                <div className="w-10 h-10 rounded-full border-2 border-neo-black overflow-hidden flex-shrink-0">
                  <img src={form.settings.smallPhoto} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <motion.h1 className="text-2xl font-black" style={{ color: themeColor }}
              animate={{ textShadow: [`0 0 0 transparent`, `0 0 8px ${themeColor}40`, `0 0 0 transparent`] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}>{form.title}</motion.h1>
            {form.description && <p className="font-bold text-neo-black dark:text-gray-100">{form.description}</p>}
          </motion.div>

          {questions.map((q, qIdx) => (
            <motion.div key={q.id}
              initial={{ opacity: 0, rotateX: 80, x: qIdx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, rotateX: 0, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: qIdx * 0.06, type: 'spring', stiffness: 130, damping: 16 }}
              whileHover={{ scale: 1.01, x: 2 }}
            >
              <RenderQuestion question={q} value={answers[q.id]} onChange={handleAnswer} error={errors[q.id]} uploading={uploading} />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: questions.length * 0.06 + 0.1 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, rotate: 1 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={submitting || Object.values(uploading).some(u => u !== undefined)}
              className="btn-primary w-full flex items-center justify-center gap-2"
              style={{ backgroundColor: themeColor, borderColor: '#1A1A1A' }}
            >
              {submitting ? (
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>◌</motion.span>
              ) : <FiSend size={16} />}
              {submitting ? 'Submitting...' : 'Submit'}
            </motion.button>
          </motion.div>
        </motion.form>
        {form?.settings?.decorations?.enabled && form.settings.decorations.shapes?.length && (
          <FormDecorations shapes={form.settings.decorations.shapes} onForm />
        )}
      </div>
    </div>
  )
}
