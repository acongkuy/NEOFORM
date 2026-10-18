import { motion } from 'framer-motion'

const BG_POSITIONS = [
  { left: '5%', top: '8%' }, { left: '82%', top: '10%' }, { left: '60%', top: '68%' },
  { left: '8%', top: '78%' }, { left: '50%', top: '4%' }, { left: '92%', top: '45%' },
  { left: '25%', top: '88%' }, { left: '72%', top: '28%' }, { left: '15%', top: '42%' },
]

const FORM_POSITIONS = [
  { left: '-22px', top: '-22px' }, { right: '-22px', top: '-22px' },
  { left: '-22px', bottom: '-22px' }, { right: '-22px', bottom: '-22px' },
  { left: '50%', top: '-30px' }, { right: '20%', top: '-20px' },
]

export function FormDecorations({ shapes, onForm = false }) {
  const positions = onForm ? FORM_POSITIONS : BG_POSITIONS

  return shapes.map((s, i) => {
    const pos = positions[i % positions.length]
    const color = s.color || '#FFD43B'
    const key = `${onForm ? 'f' : 'b'}-${s.id || i}`

    switch (s.type) {
      case 'circle':
        return (
          <motion.div key={key} className="absolute rounded-full border-2 pointer-events-none"
            style={{ ...pos, width: 30 + i * 18, height: 30 + i * 18, borderColor: color, backgroundColor: color + '18', zIndex: onForm ? 2 : 0 }}
            animate={{ y: [0, -10 - i * 3, 0] }} transition={{ repeat: Infinity, duration: 3.5 + i * 0.6, ease: 'easeInOut' }} />
        )
      case 'square':
        return (
          <motion.div key={key} className="absolute border-2 pointer-events-none"
            style={{ ...pos, width: 20 + i * 16, height: 20 + i * 16, borderColor: color, backgroundColor: color + '14', rotate: 15 + i * 18, zIndex: onForm ? 2 : 0 }}
            animate={{ y: [0, -8 - i * 2, 0], rotate: [15 + i * 18, 28 + i * 22, 15 + i * 18] }} transition={{ repeat: Infinity, duration: 3 + i * 0.8, ease: 'easeInOut' }} />
        )
      case 'cross':
        return (
          <motion.div key={key} className="absolute pointer-events-none" style={{ ...pos, width: 32, height: 32, zIndex: onForm ? 2 : 0 }}
            animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}>
            <svg viewBox="0 0 32 32" className="w-full h-full" style={{ color }}><line x1="4" y1="4" x2="28" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><line x1="28" y1="4" x2="4" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
          </motion.div>
        )
      case 'line':
        return (
          <motion.div key={key} className="absolute pointer-events-none" style={{ ...pos, zIndex: onForm ? 2 : 0 }}
            animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, ease: 'easeInOut' }}>
            <svg width={50 + i * 8} height="14" viewBox="0 0 60 14" style={{ color, overflow: 'visible' }}>
              <path d="M0 7 Q15 1 30 7 T60 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )
      case 'dot':
        return (
          <motion.div key={key} className="absolute rounded-full border-2 pointer-events-none"
            style={{ ...pos, width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3, borderColor: color, backgroundColor: color + '50', zIndex: onForm ? 2 : 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 + (i % 3) * 0.5, delay: i * 0.15, ease: 'easeInOut' }} />
        )
      default:
        return null
    }
  })
}
