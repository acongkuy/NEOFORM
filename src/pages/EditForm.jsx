import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getForm, saveForm } from '../services/formService'
import { FormBuilder } from '../components/builder/FormBuilder'
import { PageLoading } from '../components/ui/Loading'
import toast from 'react-hot-toast'

export function EditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const f = await getForm(id)
      if (!f) { toast.error('Form not found'); navigate('/'); return }
      setForm(f)
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = async (data) => {
    await saveForm(id, data)
    toast.success('Saved!')
  }

  if (loading) return <PageLoading />
  return <FormBuilder form={form} onSave={handleSave} />
}
