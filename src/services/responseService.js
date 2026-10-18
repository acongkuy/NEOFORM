import { createDocument, getDocuments, deleteDocument, where, orderBy } from '../firebase/firestore'

const COL = 'responses'

export async function submitResponse(data) {
  return createDocument(COL, data)
}

export async function getFormResponses(formId) {
  return getDocuments(COL, [where('formId', '==', formId), orderBy('createdAt', 'desc')])
}

export async function deleteResponse(id) {
  return deleteDocument(COL, id)
}

export async function getResponseCount(formId) {
  const responses = await getDocuments(COL, [where('formId', '==', formId)])
  return responses.length
}
