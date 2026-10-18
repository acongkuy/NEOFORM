import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, sendPasswordResetEmail, sendEmailVerification, signOut, updateProfile
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

const googleProvider = new GoogleAuthProvider()

async function saveProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export const registerUser = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  await saveProfile(cred.user.uid, { displayName: name, email, photoURL: '' })
  return cred.user
}

export const loginUser = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  await saveProfile(cred.user.uid, {
    displayName: cred.user.displayName || '',
    email: cred.user.email,
    photoURL: cred.user.photoURL || ''
  })
  return cred
}

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider)
  await saveProfile(cred.user.uid, {
    displayName: cred.user.displayName || '',
    email: cred.user.email,
    photoURL: cred.user.photoURL || ''
  })
  return cred
}

export const resetPassword = (email) => sendPasswordResetEmail(auth, email)

export const sendVerificationEmail = () => {
  if (auth.currentUser) return sendEmailVerification(auth.currentUser)
}

export const logoutUser = () => signOut(auth)
