import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createForm, saveForm } from '../services/formService'
import { FormBuilder } from '../components/builder/FormBuilder'
import toast from 'react-hot-toast'

export function CreateForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSave = async (data) => {
    const docRef = await createForm({ ...data, userId: user.uid })
    toast.success('Form created!')
    navigate(`/edit/${docRef.id}`)
  }

  return <FormBuilder form={null} onSave={handleSave} />
}
