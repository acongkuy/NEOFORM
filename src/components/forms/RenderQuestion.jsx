import { motion } from 'framer-motion'
import { FiStar, FiUpload, FiCheck, FiX, FiClipboard } from 'react-icons/fi'

export function RenderQuestion({ question, value, onChange, error, uploading }) {
  const base = 'input'
  const hasError = error ? 'border-red-500' : ''

  const renderInput = () => {
    switch (question.type) {
      case 'short_text':
        return <input type="text" value={value || ''} onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder} className={`${base} ${hasError}`} />
      case 'paragraph':
        return <textarea value={value || ''} onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder} className={`${base} min-h-[100px] resize-y ${hasError}`} />
      case 'number':
        return <input type="number" value={value || ''} onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder} className={`${base} ${hasError}`} />
      case 'email':
        return <input type="email" value={value || ''} onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder} className={`${base} ${hasError}`} />
      case 'phone':
        return <input type="tel" value={value || ''} onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder} className={`${base} ${hasError}`} />
      case 'url':
        if (question.showAsLink && question.defaultValue) {
          return <button type="button" onClick={() => navigator.clipboard.writeText(question.defaultValue).catch(() => {})}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            <FiClipboard size={16} /> Copy Link
          </button>
        }
        return <div className="flex gap-2">
          <input type="url" value={value || ''} onChange={e => onChange(question.id, e.target.value)}
            placeholder={question.placeholder} className={`${base} ${hasError} flex-1`} />
          <button type="button" onClick={() => navigator.clipboard.writeText(value || '').catch(() => {})}
            className="btn-ghost px-3 py-2 shrink-0 flex items-center gap-1 text-xs">
            <FiClipboard size={14} /> Copy
          </button>
        </div>
      case 'date':
        return <input type="date" value={value || ''} onChange={e => onChange(question.id, e.target.value)} className={`${base} ${hasError}`} />
      case 'time':
        return <input type="time" value={value || ''} onChange={e => onChange(question.id, e.target.value)} className={`${base} ${hasError}`} />
      case 'datetime':
        return <input type="datetime-local" value={value || ''} onChange={e => onChange(question.id, e.target.value)} className={`${base} ${hasError}`} />
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer font-bold">
                <input type="checkbox" checked={(value || []).includes(opt)} onChange={e => {
                  const v = value || []; const next = e.target.checked ? [...v, opt] : v.filter(x => x !== opt); onChange(question.id, next)
                }} className="border-2 border-neo-black dark:border-neo-blue accent-neo-yellow" /> {opt}
              </label>
            ))}
          </div>
        )
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer font-bold">
                <input type="radio" name={question.id} checked={value === opt} onChange={() => onChange(question.id, opt)}
                  className="border-2 border-neo-black dark:border-neo-blue accent-neo-yellow" /> {opt}
              </label>
            ))}
          </div>
        )
      case 'dropdown':
        return (
          <select value={value || ''} onChange={e => onChange(question.id, e.target.value)}
            className={`${base} ${hasError} font-bold`}>
            <option value="">Select...</option>
            {question.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        )
      case 'file_upload':
        const progress = uploading?.[question.id]
        return (
          <div>
            <div className="border-2 border-dashed border-neo-black p-6 text-center cursor-pointer bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-yellow/20 transition-colors"
              onClick={() => document.getElementById(`file-${question.id}`)?.click()}>
              {value ? (
                <div className="flex items-center justify-center gap-2 font-bold">
                  <FiCheck size={20} /> <span className="text-sm font-bold">File uploaded</span>
                </div>
              ) : progress !== undefined ? (
                <div className="space-y-2">
                  <div className="w-full bg-white dark:bg-gray-800 border-2 border-neo-black dark:border-neo-blue h-3">
                    <div className="bg-neo-yellow dark:bg-neo-blue border-r-2 border-neo-black dark:border-neo-blue h-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-bold">{progress}%</p>
                </div>
              ) : (
                <>
                  <FiUpload size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-bold">Click to upload</p>
                </>
              )}
              <input id={`file-${question.id}`} type="file" className="hidden" onChange={e => {
                const file = e.target.files?.[0]
                if (file) onChange(question.id, file, true)
              }} />
            </div>
            {value && typeof value === 'string' && (
              <button onClick={() => onChange(question.id, null)}
                className="mt-1 text-xs font-bold underline flex items-center gap-1">
                <FiX size={12} /> Remove
              </button>
            )}
          </div>
        )
      case 'rating':
        return (
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <button key={i} type="button" onClick={() => onChange(question.id, i)}
                className={`p-1 transition-all border-2 ${i <= (value || 0) ? 'bg-neo-yellow border-neo-black shadow-neo-sm' : 'border-neo-black bg-white hover:bg-gray-100'}`}>
                <FiStar size={28} fill={i <= (value || 0) ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        )
      case 'linear_scale':
        const labels = []
        for (let i = question.minScale || 1; i <= (question.maxScale || 5); i++) labels.push(i)
        return (
          <div className="overflow-x-auto">
            <div className="flex items-end gap-0 min-w-max">
              {labels.map(i => (
                <button key={i} type="button" onClick={() => onChange(question.id, i)}
                  className={`w-12 sm:w-auto sm:flex-1 py-3 text-center border-2 border-neo-black font-bold transition-all
                    ${value === i ? 'bg-neo-yellow shadow-neo-sm -translate-y-0.5' : 'bg-white hover:bg-gray-100'}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
        )
      case 'yes_no':
        return (
          <div className="flex gap-3">
            {['Yes', 'No'].map(opt => (
              <button key={opt} type="button" onClick={() => onChange(question.id, opt)}
                className={`px-6 py-2 border-2 border-neo-black font-bold uppercase tracking-wide transition-all text-neo-black
                  ${value === opt ? 'bg-neo-yellow shadow-neo-sm' : 'bg-white hover:bg-gray-100'}`}>
                {opt}
              </button>
            ))}
          </div>
        )
      case 'heading':
        return <h2 className="text-xl font-black">{question.title}</h2>
      case 'description':
        return <p className="font-bold">{question.title}</p>
      case 'divider':
        return <hr className="border-t-2 border-neo-black dark:border-gray-600" />
      case 'section':
        return (
          <div className="bg-neo-yellow dark:bg-gray-800 border-2 border-neo-black p-4 -mx-2">
            <h3 className="font-black uppercase">{question.title}</h3>
            {question.description && <p className="text-sm font-bold mt-1">{question.description}</p>}
          </div>
        )
      default:
        return <input className={base} />
    }
  }

  if (['heading', 'description', 'divider', 'section'].includes(question.type)) {
    return <motion.div initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>{renderInput()}</motion.div>
  }

  return (
    <motion.div initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
      <label className="flex items-start gap-1 mb-1.5">
        <span className="text-sm font-black">{question.title}</span>
        {question.required && <span className="text-red-500 text-sm font-bold">*</span>}
      </label>
      {renderInput()}
      {question.helpText && <p className="text-xs font-bold mt-1">{question.helpText}</p>}
      {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
    </motion.div>
  )
}
