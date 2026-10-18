import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiCopy, FiShare2, FiBarChart2 } from 'react-icons/fi'
import { formatDate } from '../../utils/helpers'

const BORDER_COLORS = ['border-l-neo-yellow', 'border-l-neo-pink', 'border-l-neo-blue', 'border-l-neo-green', 'border-l-neo-orange', 'border-l-neo-purple']

export function FormCard({ form, onEdit, onDelete, onDuplicate, onShare, onResponses }) {
  const borderColor = BORDER_COLORS[form.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % BORDER_COLORS.length]
  return (
    <motion.div layout initial={{ opacity: 0, rotateX: 90 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4, rotateX: 2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className={`card p-5 hover:shadow-neo-hover transition-all duration-100 group border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate dark:text-gray-100">{form.title || 'Untitled Form'}</h3>
          {form.description && <p className="text-sm font-medium text-neo-black dark:text-gray-400 truncate mt-0.5">{form.description}</p>}
        </div>
        <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(form.id)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue shadow-neo-sm transition-all">
            <FiEdit2 size={14} />
          </button>
          <button onClick={() => onShare(form)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-blue hover:text-white shadow-neo-sm transition-all">
            <FiShare2 size={14} />
          </button>
          <button onClick={() => onDuplicate(form.id)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-green hover:text-white shadow-neo-sm transition-all">
            <FiCopy size={14} />
          </button>
          <button onClick={() => onDelete(form.id)} className="p-1.5 border-2 border-neo-black bg-white dark:bg-gray-800 dark:border-neo-blue hover:bg-neo-pink hover:text-white shadow-neo-sm transition-all">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs font-bold text-neo-black dark:text-gray-400">
        <div className="flex items-center gap-3">
          <button onClick={() => onResponses(form.id)} className="flex items-center gap-1 underline hover:text-neo-blue transition-colors"><FiBarChart2 size={12} /> {form.responseCount || 0} responses</button>
          <span>Created {formatDate(form.createdAt)}</span>
        </div>
        <span>Edited {formatDate(form.updatedAt)}</span>
      </div>
    </motion.div>
  )
}
