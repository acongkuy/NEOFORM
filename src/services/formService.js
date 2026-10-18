import { createDocument, setDocument, getDocument, getDocuments, updateDocument, deleteDocument, where, orderBy } from '../firebase/firestore'

const COL = 'forms'

export async function createForm(data) {
  return createDocument(COL, data)
}

export async function saveForm(id, data) {
  return setDocument(COL, id, data)
}

export async function getForm(id) {
  const snap = await getDocument(COL, id)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getUserForms(userId) {
  return getDocuments(COL, [where('userId', '==', userId), orderBy('updatedAt', 'desc')])
}

export async function deleteForm(id) {
  return deleteDocument(COL, id)
}

export async function duplicateForm(id) {
  const original = await getForm(id)
  if (!original) return null
  const { id: _, userId, updatedAt: _u, ...rest } = original
  return createDocument(COL, { ...rest, title: `${rest.title} (Copy)` })
}
