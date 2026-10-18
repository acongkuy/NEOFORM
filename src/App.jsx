import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCoffee } from 'react-icons/fi'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { PageLoading } from './components/ui/Loading'
import { Navbar } from './components/layout/Navbar'
import { LandingPage } from './pages/LandingPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { CreateForm } from './pages/CreateForm'
import { EditForm } from './pages/EditForm'
import { PublicFormPage } from './pages/PublicFormPage'
import { FormResponses } from './pages/FormResponses'
import { Settings } from './pages/Settings'
import { Keynotes } from './pages/Keynotes'
import { AdminNews } from './pages/AdminNews'
import { NotFound } from './pages/NotFound'

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </div>
  )
}

function HomeRoute() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoading />
  return user ? <AppLayout /> : <LandingPage />
}

function DonateButton() {
  return (
    <motion.a
      href="https://saweria.co/chunsky"
      target="_blank"
      rel="noreferrer"
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.1, rotate: 3 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, rotate: -2 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-2 border-2 border-neo-black bg-neo-yellow text-neo-black shadow-neo-sm hover:shadow-neo transition-all text-xs font-bold cursor-grab"
    >
      <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 3 }}>
        <FiCoffee size={14} />
      </motion.span>
      beliin mimin kopi dong hehe❤️
    </motion.a>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{
            className: '!border-2 !border-neo-black !shadow-neo !font-bold',
            duration: 3000
          }} />
          <DonateButton />
          <Routes>
            <Route path="/" element={<HomeRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/form/:id" element={<PublicFormPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/create" element={<CreateForm />} />
              <Route path="/edit/:id" element={<EditForm />} />
              <Route path="/responses/:id" element={<FormResponses />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/keynotes" element={<Keynotes />} />
              <Route path="/admin/news" element={<AdminNews />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
