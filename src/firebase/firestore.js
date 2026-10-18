import { db } from './config'
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore'

export const createDocument = (col, data) => addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() })

export const setDocument = (col, id, data) => setDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() }, { merge: true })

export const getDocument = (col, id) => getDoc(doc(db, col, id))

export const getDocuments = async (col, conditions = []) => {
  let q = collection(db, col)
  if (conditions.length) q = query(q, ...conditions)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const updateDocument = (col, id, data) => updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() })

export const deleteDocument = (col, id) => deleteDoc(doc(db, col, id))

export { where, orderBy, limit, serverTimestamp }
