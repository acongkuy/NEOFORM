import { createDocument, setDocument, getDocuments, getDocument, deleteDocument, updateDocument, where, orderBy, serverTimestamp } from '../firebase/firestore'

const NEWS_COL = 'news'
const READ_COL = 'readNews'

export async function createNews(data) {
  return createDocument(NEWS_COL, data)
}

export async function updateNews(id, data) {
  return updateDocument(NEWS_COL, id, data)
}

export async function deleteNews(id) {
  return deleteDocument(NEWS_COL, id)
}

export async function getAllNews() {
  return getDocuments(NEWS_COL, [orderBy('createdAt', 'desc')])
}

export async function getLastReadAt(userId) {
  const snap = await getDocument(READ_COL, userId)
  if (!snap.exists()) return null
  return snap.data().lastReadAt?.toDate?.() || null
}

export async function markNewsRead(userId) {
  return setDocument(READ_COL, userId, { lastReadAt: serverTimestamp() })
}