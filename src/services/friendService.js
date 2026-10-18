import { createDocument, getDocuments, getDocument, deleteDocument, updateDocument, where, orderBy } from '../firebase/firestore'

const REQ_COL = 'friendRequests'
const FRIENDS_COL = 'friends'
const SHARED_COL = 'sharedForms'

export async function getUserProfile(uid) {
  const snap = await getDocument('users', uid)
  return snap.exists() ? snap.data() : null
}

// --- Friend Requests ---

export async function sendFriendRequest(fromId, toId) {
  const existing = await getDocuments(REQ_COL, [
    where('fromId', '==', fromId), where('toId', '==', toId)
  ])
  if (existing.length > 0) throw new Error('Request already sent')
  const reverse = await getDocuments(REQ_COL, [
    where('fromId', '==', toId), where('toId', '==', fromId)
  ])
  if (reverse.length > 0) throw new Error('They already sent you a request — check your Requests tab')
  const friends1 = await getDocuments(FRIENDS_COL, [
    where('userId', '==', fromId), where('friendId', '==', toId)
  ])
  if (friends1.length > 0) throw new Error('Already friends')
  return createDocument(REQ_COL, { fromId, toId, status: 'pending' })
}

export async function getPendingRequests(userId) {
  return getDocuments(REQ_COL, [where('toId', '==', userId)])
}

export async function getSentRequests(userId) {
  return getDocuments(REQ_COL, [where('fromId', '==', userId)])
}

export async function acceptRequest(docId, userId, friendId) {
  await deleteDocument(REQ_COL, docId)
  await createDocument(FRIENDS_COL, { userId, friendId })
  await createDocument(FRIENDS_COL, { userId: friendId, friendId: userId })
}

export async function declineRequest(docId) {
  await deleteDocument(REQ_COL, docId)
}

// --- Friends ---

export async function getFriends(userId) {
  return getDocuments(FRIENDS_COL, [where('userId', '==', userId), orderBy('createdAt', 'desc')])
}

export async function getFriendsWithProfiles(userId) {
  const friends = await getFriends(userId)
  const profiles = await Promise.all(friends.map(f =>
    getDocument('users', f.friendId).then(snap => snap.exists() ? snap.data() : null)
  ))
  return friends.map((f, i) => ({
    ...f,
    friendName: profiles[i]?.displayName || f.friendId,
    friendPhoto: profiles[i]?.photoURL || null
  }))
}

export async function removeFriend(docId) {
  return deleteDocument(FRIENDS_COL, docId)
}

// --- Sharing ---

export async function shareFormToFriend(fromId, toId, formData, notes) {
  return createDocument(SHARED_COL, {
    fromId, toId, notes,
    title: formData.title || '',
    description: formData.description || '',
    questions: formData.questions || [],
    settings: formData.settings || {}
  })
}

export async function getReceivedForms(userId) {
  return getDocuments(SHARED_COL, [where('toId', '==', userId), orderBy('createdAt', 'desc')])
}

export async function deleteSharedForm(id) {
  return deleteDocument(SHARED_COL, id)
}

export async function markSharedFormImported(id) {
  return updateDocument(SHARED_COL, id, { imported: true })
}
