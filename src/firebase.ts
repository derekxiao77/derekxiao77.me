import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC00u2EaZgdUn1UggvAQt0uWe7X06dq-Jo",
  authDomain: "gopotty-82c23.firebaseapp.com",
  projectId: "gopotty-82c23",
  storageBucket: "gopotty-82c23.firebasestorage.app",
  messagingSenderId: "1042691575282",
  appId: "1:1042691575282:web:60763968fb975747ffef6b",
  measurementId: "G-DBZS6LDY5L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
