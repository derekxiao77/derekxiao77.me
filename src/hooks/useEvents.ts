import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, limit, doc, setDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import type { PottyEvent, EventType, Surface, ContextTag, Walk } from '../types';

export function useEvents(householdId: string | null | undefined, eventLimit = 50) {
  const { appUser } = useAuth();
  const [events, setEvents] = useState<PottyEvent[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setEvents([]);
      setWalks([]);
      setLoading(false);
      return;
    }

    const eventsRef = collection(db, 'households', householdId, 'events');
    const eventsQuery = query(eventsRef, orderBy('timestamp', 'desc'), limit(eventLimit));
    const unsubEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PottyEvent));
      setLoading(false);
    });

    const walksRef = collection(db, 'households', householdId, 'walks');
    const walksQuery = query(walksRef, orderBy('startTime', 'desc'), limit(30));
    const unsubWalks = onSnapshot(walksQuery, (snap) => {
      const allWalks = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Walk);
      setWalks(allWalks);
      setActiveWalk(allWalks.find(w => w.status === 'active') || null);
    });

    return () => { unsubEvents(); unsubWalks(); };
  }, [householdId, eventLimit]);

  const logEvent = useCallback(async (
    type: EventType,
    dogId: string,
    opts?: {
      walkId?: string;
      location?: { lat: number; lng: number };
      surface?: Surface;
      context?: ContextTag[];
      notes?: string;
    }
  ) => {
    if (!householdId || !appUser) return;
    const eventsRef = collection(db, 'households', householdId, 'events');
    const id = doc(eventsRef).id;
    const event: Omit<PottyEvent, 'id'> = {
      type,
      timestamp: Date.now(),
      userId: appUser.uid,
      userName: appUser.displayName,
      dogId,
      walkId: opts?.walkId || null,
      location: opts?.location || null,
      surface: opts?.surface || null,
      context: opts?.context || [],
      notes: opts?.notes || null,
      createdAt: Date.now(),
    };
    await setDoc(doc(eventsRef, id), event);
    return id;
  }, [householdId, appUser]);

  return { events, walks, activeWalk, loading, logEvent };
}
