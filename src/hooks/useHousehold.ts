import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import type { Household, Dog } from '../types';

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useHousehold() {
  const { appUser, updateAppUser } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [members, setMembers] = useState<{ uid: string; displayName: string; photoUrl: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser?.householdId) {
      setHousehold(null);
      setDogs([]);
      setLoading(false);
      return;
    }

    const householdRef = doc(db, 'households', appUser.householdId);
    const unsub = onSnapshot(householdRef, async (snap) => {
      if (snap.exists()) {
        const h = { id: snap.id, ...snap.data() } as Household;
        setHousehold(h);

        // Fetch members
        const memberPromises = h.members.map(async (uid) => {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            return { uid, displayName: data.displayName, photoUrl: data.photoUrl };
          }
          return { uid, displayName: 'Unknown', photoUrl: null };
        });
        setMembers(await Promise.all(memberPromises));
      }
      setLoading(false);
    });

    // Subscribe to dogs
    const dogsRef = collection(db, 'households', appUser.householdId, 'dogs');
    const unsubDogs = onSnapshot(dogsRef, (snap) => {
      setDogs(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Dog));
    });

    return () => { unsub(); unsubDogs(); };
  }, [appUser?.householdId]);

  const createHousehold = useCallback(async (name: string) => {
    if (!appUser) return;
    const id = doc(collection(db, 'households')).id;
    const household: Omit<Household, 'id'> = {
      name,
      inviteCode: generateInviteCode(),
      members: [appUser.uid],
      createdBy: appUser.uid,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, 'households', id), household);
    await updateAppUser({ householdId: id });
  }, [appUser, updateAppUser]);

  const joinHousehold = useCallback(async (inviteCode: string) => {
    if (!appUser) return false;
    const q = query(collection(db, 'households'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) return false;

    const householdDoc = snap.docs[0];
    await updateDoc(doc(db, 'households', householdDoc.id), {
      members: arrayUnion(appUser.uid),
    });
    await updateAppUser({ householdId: householdDoc.id });
    return true;
  }, [appUser, updateAppUser]);

  const addDog = useCallback(async (dog: Omit<Dog, 'id' | 'createdAt'>) => {
    if (!appUser?.householdId) return;
    const dogsRef = collection(db, 'households', appUser.householdId, 'dogs');
    const id = doc(dogsRef).id;
    await setDoc(doc(dogsRef, id), { ...dog, createdAt: Date.now() });
  }, [appUser?.householdId]);

  const updateDog = useCallback(async (dogId: string, data: Partial<Dog>) => {
    if (!appUser?.householdId) return;
    await setDoc(doc(db, 'households', appUser.householdId, 'dogs', dogId), data, { merge: true });
  }, [appUser?.householdId]);

  return { household, dogs, members, loading, createHousehold, joinHousehold, addDog, updateDog };
}
