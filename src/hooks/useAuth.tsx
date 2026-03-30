import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import type { AppUser } from '../types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateAppUser: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setAppUser({ uid: firebaseUser.uid, ...snap.data() } as AppUser);
        } else {
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            photoUrl: firebaseUser.photoURL,
            householdId: null,
            role: 'parent',
            fcmToken: null,
            createdAt: Date.now(),
          };
          await setDoc(userRef, newUser);
          setAppUser(newUser);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const updateAppUser = useCallback(async (data: Partial<AppUser>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data, { merge: true });
    setAppUser(prev => prev ? { ...prev, ...data } : null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signInWithGoogle, logout, updateAppUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
