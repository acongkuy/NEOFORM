import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiPlus, FiEye, FiSettings, FiSave, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { DragDropList } from './DragDropList'
import { Preview } from './Preview'
import { FormSettings } from './FormSettings'
import { QUESTION_TYPES, DEFAULT_QUESTION } from '../../constants/questionTypes'
import { generateId } from '../../utils/helpers'

export function FormBuilder({ form, onSave }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(form?.questions || [])
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(form?.settings || {})
  const [title, setTitle] = useState(form?.title || '')
  const [description, setDescription] = useState(form?.description || '')
  const [saving, setSaving] = useState(false)
  const [showTypePicker, setShowTypePicker] = useState(false)

  useEffect(() => { const t = setTimeout(() => { if (form?.id) handleSave() }, 3000); return () => clearTimeout(t) }, [questions, title, description, settings])

  const handleSave = async () => {
    setSaving(true)
    await onSave({ title, description, questions, settings })
    setSaving(false)
  }

  const addQuestion = (type) => {
    setQuestions([...questions, { ...DEFAULT_QUESTION, id: generateId(), type }])
  }

  const updateQuestion = (index, updated) => {
    const q = [...questions]; q[index] = updated; setQuestions(q)
  }

  const deleteQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index))
  const duplicateQuestion = (index) => {
    const q = questions[index]
    setQuestions([...questions, { ...q, id: generateId(), title: `${q.title} (Copy)` }])
  }

  const questionTypeCounts = {}
  QUESTION_TYPES.forEach(t => { questionTypeCounts[t.id] = questions.filter(q => q.type === t.id).length })

  return (
    <div className="flex flex-col-reverse lg:flex-row h-[calc(100vh-4rem)]">
      <div className="lg:hidden flex items-center justify-center border-t-2 border-neo-black dark:border-neo-pink p-2 bg-neo-yellow dark:bg-gray-900 shrink-0">
        <button onClick={() => setShowTypePicker(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          <FiPlus size={20} /> Add Question
        </button>
      </div>

      <div className="hidden lg:block lg:w-64 border-r-2 border-neo-black p-4 overflow-y-auto bg-white dark:bg-gray-900 dark:border-neo-pink shrink-0">
        <h3 className="text-sm font-black text-neo-black dark:text-gray-100 mb-3 uppercase tracking-wide">Question Types</h3>
        <div className="flex flex-col gap-1">
          {QUESTION_TYPES.map((t, i) => (
            <motion.button key={t.id} initial={{ opacity: 0, x: -60, rotate: -20 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 15 }} whileHover={{ scale: 1.02, rotate: 1 }} whileTap={{ scale: 0.97 }}
              onClick={() => addQuestion(t.id)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-transparent hover:border-neo-black dark:hover:border-neo-blue bg-white dark:bg-gray-800 dark:text-gray-100 hover:bg-neo-yellow dark:hover:bg-gray-700 font-bold transition-all text-sm text-left">
              <FiPlus size={14} className="shrink-0" />
              <span className="truncate">{t.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-w-0">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -30, rotateX: 45 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ rotate: -5 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className="btn-ghost p-1.5"><FiArrowLeft size={18} /></motion.button>
              {saving && <span className="text-xs font-bold animate-pulse">Saving...</span>}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button whileHover={{ rotate: 3 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSettings(!showSettings)} className={`btn-ghost ${showSettings ? 'bg-neo-yellow' : ''}`}>
                <FiSettings size={16} /> <span className="hidden sm:inline ml-1">Settings</span>
              </motion.button>
              <motion.button whileHover={{ rotate: 3 }} whileTap={{ scale: 0.95 }} onClick={() => setShowPreview(!showPreview)} className={`btn-ghost ${showPreview ? 'bg-neo-yellow' : ''}`}>
                <FiEye size={16} /> <span className="hidden sm:inline ml-1">Preview</span>
              </motion.button>
              <motion.button whileHover={{ rotate: 2 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className="btn-primary"><FiSave size={16} /> <span className="hidden sm:inline ml-1">Save</span></motion.button>
            </div>
          </motion.div>

          <motion.div layout initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }} className="card p-4 sm:p-6 mb-4 sm:mb-6 text-center">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Form Title" className="text-xl sm:text-3xl font-black text-center w-full bg-transparent border-none outline-none" />
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Form description..." className="mt-2 font-bold text-center w-full bg-transparent border-none outline-none resize-none" rows={2} />
          </motion.div>

          {showSettings && <FormSettings settings={settings} onChange={setSettings} onPaste={(data) => {
            setQuestions(data.questions || [])
            setSettings(data.settings || {})
            localStorage.removeItem('neoform_clipboard')
            toast.success('Form pasted!')
          }} formData={{ title, description, questions, settings }} userId={user?.uid} onImportForm={(shared) => {
            setTitle(shared.title || '')
            setDescription(shared.description || '')
            setQuestions(shared.questions || [])
            setSettings(shared.settings || {})
            toast.success('Form imported from friend!')
          }} />}

          {showPreview ? (
            <Preview title={title} description={description} questions={questions} />
          ) : (
            <DragDropList questions={questions} onChange={updateQuestion} onDelete={deleteQuestion} onDuplicate={duplicateQuestion} onReorder={setQuestions} />
          )}

          {questions.length === 0 && !showPreview && (
            <div className="text-center py-16">
              <p className="text-lg font-bold">Tap "Add Question" to start building your form</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showTypePicker && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neo-black/60" onClick={() => setShowTypePicker(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full lg:max-w-md max-h-[70vh] bg-white dark:bg-gray-900 border-2 border-neo-black shadow-neo p-4 z-10 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black">Add Question</h3>
                <button onClick={() => setShowTypePicker(false)} className="p-1.5 border-2 border-neo-black dark:border-neo-pink bg-white dark:bg-gray-800 hover:bg-neo-pink hover:text-white shadow-neo-sm transition-all">
                  <FiX size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUESTION_TYPES.map((t, i) => (
                  <motion.button key={t.id} initial={{ opacity: 0, rotate: -90, x: -30 }} animate={{ opacity: 1, rotate: 0, x: 0 }} transition={{ delay: i * 0.025, type: 'spring', stiffness: 200, damping: 14 }} whileTap={{ scale: 0.95, rotate: -2 }} onClick={() => { addQuestion(t.id); setShowTypePicker(false) }}
                    className="flex items-center gap-2 px-3 py-3 border-2 border-neo-black dark:border-neo-blue bg-white dark:bg-gray-800 hover:bg-neo-yellow dark:hover:bg-gray-700 font-bold transition-all text-sm text-left">
                    <FiPlus size={14} className="shrink-0" />
                    <span>{t.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
