import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from '../types';

// Configurar persistência local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

export const authService = {
  async register(email: string, password: string, name: string): Promise<User> {
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: name,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), user);
      
      return user;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: userData?.name || firebaseUser.displayName || '',
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };
      
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
};