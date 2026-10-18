import { motion } from 'framer-motion'

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-4 border-neo-yellow border-t-neo-black" />
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-neo-black/10 dark:bg-gray-800 dark:border-neo-purple border-2 border-neo-black ${className}`} />
}

export function PageLoading() {
  return (
    <div className="space-y-4 p-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
      </div>
    </div>
  )
}
