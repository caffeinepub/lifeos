import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface FocusSession {
  isActive: boolean;
  isPaused: boolean;
  startTime: number;
}

const STORAGE_KEY = 'lifeos_focus_session';

function getStorageKey(principal?: string): string {
  return `${STORAGE_KEY}_${principal || 'anon'}`;
}

export function useFocusMode() {
  const { identity } = useInternetIdentity();
  const [session, setSession] = useState<FocusSession>({
    isActive: false,
    isPaused: false,
    startTime: 0,
  });

  useEffect(() => {
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [identity]);

  const saveSession = (newSession: FocusSession) => {
    setSession(newSession);
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      localStorage.setItem(key, JSON.stringify(newSession));
    } catch (error) {
      console.error('Failed to save focus session:', error);
    }
  };

  const start = () => {
    saveSession({
      isActive: true,
      isPaused: false,
      startTime: session.isActive && !session.isPaused ? session.startTime : Date.now(),
    });
  };

  const pause = () => {
    saveSession({ ...session, isPaused: true });
  };

  const stop = () => {
    saveSession({ isActive: false, isPaused: false, startTime: 0 });
  };

  return {
    isActive: session.isActive,
    isPaused: session.isPaused,
    startTime: session.startTime,
    start,
    pause,
    stop,
  };
}
