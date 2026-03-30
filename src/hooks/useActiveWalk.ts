import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { haversineDistance, totalRouteDistance } from '../utils/geo';
import type { Walk, EventType, Surface, ContextTag } from '../types';

interface UseActiveWalkReturn {
  isWalking: boolean;
  walk: Walk | null;
  elapsed: number;
  distance: number;
  currentPosition: { lat: number; lng: number } | null;
  route: { lat: number; lng: number }[];
  startWalk: (dogId: string) => Promise<void>;
  endWalk: () => Promise<void>;
  logWalkEvent: (type: EventType, opts?: { surface?: Surface; context?: ContextTag[] }) => Promise<void>;
}

export function useActiveWalk(householdId: string | null | undefined): UseActiveWalkReturn {
  const { appUser } = useAuth();
  const [walk, setWalk] = useState<Walk | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeBufferRef = useRef<{ lat: number; lng: number }[]>([]);
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (walk) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - walk.startTime) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [walk?.startTime]);

  const startWalk = useCallback(async (dogId: string) => {
    if (!householdId || !appUser) return;

    const walksRef = collection(db, 'households', householdId, 'walks');
    const id = doc(walksRef).id;
    const newWalk: Omit<Walk, 'id'> = {
      userId: appUser.uid,
      userName: appUser.displayName,
      dogId,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      distance: 0,
      route: [],
      events: [],
      status: 'active',
      createdAt: Date.now(),
    };
    await setDoc(doc(walksRef, id), newWalk);
    setWalk({ id, ...newWalk });
    setElapsed(0);
    setDistance(0);
    setRoute([]);
    routeBufferRef.current = [];

    // Start GPS tracking
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentPosition(point);
          setRoute(prev => {
            const updated = [...prev, point];
            setDistance(totalRouteDistance(updated));
            return updated;
          });
          routeBufferRef.current.push(point);
        },
        (err) => console.warn('GPS error:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    }

    // Flush route to Firestore every 30s
    flushIntervalRef.current = setInterval(async () => {
      if (routeBufferRef.current.length > 0) {
        const walkRef = doc(db, 'households', householdId, 'walks', id);
        await updateDoc(walkRef, {
          route: arrayUnion(...routeBufferRef.current),
        });
        routeBufferRef.current = [];
      }
    }, 30000);
  }, [householdId, appUser]);

  const endWalk = useCallback(async () => {
    if (!walk || !householdId) return;

    // Stop GPS
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);

    // Final flush
    const walkRef = doc(db, 'households', householdId, 'walks', walk.id);
    const finalRoute = route;
    const finalDistance = totalRouteDistance(finalRoute);
    const finalDuration = Math.floor((Date.now() - walk.startTime) / 1000);

    await updateDoc(walkRef, {
      endTime: Date.now(),
      duration: finalDuration,
      distance: Math.round(finalDistance),
      route: finalRoute,
      status: 'completed',
    });

    setWalk(null);
    setElapsed(0);
    setCurrentPosition(null);
  }, [walk, householdId, route]);

  const logWalkEvent = useCallback(async (
    type: EventType,
    opts?: { surface?: Surface; context?: ContextTag[] }
  ) => {
    if (!walk || !householdId || !appUser) return;

    const eventsRef = collection(db, 'households', householdId, 'events');
    const id = doc(eventsRef).id;
    await setDoc(doc(eventsRef, id), {
      type,
      timestamp: Date.now(),
      userId: appUser.uid,
      userName: appUser.displayName,
      dogId: walk.dogId,
      walkId: walk.id,
      location: currentPosition,
      surface: opts?.surface || null,
      context: opts?.context || [],
      notes: null,
      createdAt: Date.now(),
    });

    // Add event to walk
    const walkRef = doc(db, 'households', householdId, 'walks', walk.id);
    await updateDoc(walkRef, { events: arrayUnion(id) });

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);
  }, [walk, householdId, appUser, currentPosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);
    };
  }, []);

  return {
    isWalking: !!walk,
    walk,
    elapsed,
    distance,
    currentPosition,
    route,
    startWalk,
    endWalk,
    logWalkEvent,
  };
}
