import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCopy, FiTrash2, FiChevronDown, FiChevronUp, FiPlus, FiX } from 'react-icons/fi'
import { QUESTION_TYPES } from '../../constants/questionTypes'

export function QuestionEditor({ question, index, onChange, onDelete, onDuplicate, dragHandle }) {
  const [expanded, setExpanded] = useState(true)
  const typeMeta = QUESTION_TYPES.find(t => t.id === question.type)

  const update = (key, val) => onChange(index, { ...question, [key]: val })

  const needsOptions = ['checkbox', 'multiple_choice', 'dropdown']
  const needsScale = question.type === 'linear_scale'

  return (
    <motion.div layout initial={{ opacity: 0, rotateX: 70 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 150, damping: 18, delay: index * 0.04 }} className="card p-5 mb-4">
      <div className="flex items-start gap-3">
        <div className="mt-2 cursor-grab font-bold text-2xl select-none" {...dragHandle}>⠿</div>
        <div className="flex-1 space-y-4">
          <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
            <input value={question.title} onChange={e => update('title', e.target.value)}
              placeholder="Question title" className="input w-full sm:flex-1 font-bold" />
            <div className="relative w-full sm:w-auto">
              <select value={question.type} onChange={e => update('type', e.target.value)}
                className="input pr-8 text-sm appearance-none cursor-pointer w-full sm:w-auto font-bold">
                {QUESTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            </div>
          </div>

          {question.type === 'url' && (
            <div className="space-y-2 ml-1">
              <label className="flex items-center gap-1.5 text-sm font-bold">
                <input type="checkbox" checked={question.showAsLink} onChange={e => update('showAsLink', e.target.checked)}
                  className="border-2 border-neo-black dark:border-neo-blue accent-neo-yellow" /> Show as link button
              </label>
              {question.showAsLink && (
                <input value={question.defaultValue} onChange={e => update('defaultValue', e.target.value)}
                  placeholder="https://..." className="input py-1.5 text-sm w-full" />
              )}
            </div>
          )}

          {needsOptions.includes(question.type) && (
            <div className="space-y-2 ml-1">
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type={question.type === 'checkbox' ? 'checkbox' : 'radio'} disabled className="border-2 border-neo-black dark:border-gray-500" />
                  <input value={opt} onChange={e => {
                    const opts = [...question.options]; opts[oi] = e.target.value; update('options', opts)
                  }} className="input py-1.5 text-sm flex-1" placeholder={`Option ${oi + 1}`} />
                  {question.options.length > 1 && (
                    <button onClick={() => update('options', question.options.filter((_, i) => i !== oi))}
                      className="p-1 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-pink hover:text-white transition-all"><FiX size={14} /></button>
                  )}
                </div>
              ))}
              <button onClick={() => update('options', [...question.options, `Option ${question.options.length + 1}`])}
                className="flex items-center gap-1 text-sm font-bold underline mt-1">
                <FiPlus size={14} /> Add option
              </button>
            </div>
          )}

          {needsScale && (
            <div className="flex items-center gap-3 text-sm font-bold">
              <span>From</span>
              <input type="number" value={question.minScale} onChange={e => update('minScale', Number(e.target.value))}
                className="input w-16 py-1 text-center" min={0} max={10} />
              <span>To</span>
              <input type="number" value={question.maxScale} onChange={e => update('maxScale', Number(e.target.value))}
                className="input w-16 py-1 text-center" min={1} max={10} />
            </div>
          )}

          {question.type === 'yes_no' && (
            <div className="flex gap-4 text-sm font-bold ml-1">
              <label className="flex items-center gap-1"><input type="radio" disabled className="border-2 border-neo-black dark:border-gray-500" /> Yes</label>
              <label className="flex items-center gap-1"><input type="radio" disabled className="border-2 border-neo-black dark:border-gray-500" /> No</label>
            </div>
          )}

          {expanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 pt-2 border-t-2 border-neo-black dark:border-neo-purple">
              <label className="flex items-center gap-1.5 text-sm font-bold w-full sm:w-auto">
                <input type="checkbox" checked={question.required} onChange={e => update('required', e.target.checked)}
                  className="border-2 border-neo-black dark:border-neo-blue accent-neo-yellow" /> Required
              </label>
              <div className="flex flex-wrap gap-2 w-full">
                <input value={question.placeholder} onChange={e => update('placeholder', e.target.value)}
                  placeholder="Placeholder" className="input py-1.5 text-sm flex-1 min-w-[120px]" />
                <input value={question.defaultValue} onChange={e => update('defaultValue', e.target.value)}
                  placeholder="Default value" className="input py-1.5 text-sm flex-1 min-w-[120px]" />
                <input value={question.helpText} onChange={e => update('helpText', e.target.value)}
                  placeholder="Help text" className="input py-1.5 text-sm flex-1 min-w-[120px]" />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full text-sm font-bold">
                <span className="text-xs uppercase tracking-wide">Validation:</span>
                <input type="number" value={question.validation?.minLength ?? ''} onChange={e => update('validation', { ...(question.validation || {}), minLength: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Min len" className="input py-1 text-sm w-[100px]" />
                <input type="number" value={question.validation?.maxLength ?? ''} onChange={e => update('validation', { ...(question.validation || {}), maxLength: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Max len" className="input py-1 text-sm w-[100px]" />
                <input type="number" value={question.validation?.minValue ?? ''} onChange={e => update('validation', { ...(question.validation || {}), minValue: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Min val" className="input py-1 text-sm w-[100px]" />
                <input type="number" value={question.validation?.maxValue ?? ''} onChange={e => update('validation', { ...(question.validation || {}), maxValue: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Max val" className="input py-1 text-sm w-[100px]" />
                <select value={question.validation?.pattern ?? ''} onChange={e => update('validation', { ...(question.validation || {}), pattern: e.target.value })}
                  className="input py-1 text-sm w-full sm:w-auto font-bold">
                  <option value="">No pattern</option>
                  <option value="^[0-9]+$">Numbers only</option>
                  <option value="^[a-zA-Z]+$">Letters only</option>
                  <option value="^[a-zA-Z ]+$">Letters &amp; spaces</option>
                  <option value="^[a-zA-Z0-9]+$">Alphanumeric</option>
                  <option value="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">Email format</option>
                  <option value="^[0-9]{10,15}$">Phone (10-15 digits)</option>
                  <option value="^https?://.+">URL</option>
                  <option value="^.{3,}$">Min 3 characters</option>
                  <option value="^.{0,100}$">Max 100 characters</option>
                  <option value="^.{3,100}$">3-100 characters</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-yellow shadow-neo-sm transition-all">
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          <button onClick={() => onDuplicate(index)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-green hover:text-white shadow-neo-sm transition-all"><FiCopy size={16} /></button>
          <button onClick={() => onDelete(index)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-pink hover:text-white shadow-neo-sm transition-all"><FiTrash2 size={16} /></button>
        </div>
      </div>
    </motion.div>
  )
}
