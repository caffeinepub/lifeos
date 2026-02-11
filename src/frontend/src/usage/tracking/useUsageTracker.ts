import { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { saveLocalEvent, getCurrentSession, setCurrentSession, getSessionContext } from '../storage/localEventStore';
import type { LocalEvent } from '../events/types';

export function useUsageTracker() {
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const currentPath = routerState.location.pathname;
  const lastPathRef = useRef<string>(currentPath);
  const pageStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    (window as any).__lifeosIdentity = identity;
  }, [identity]);

  useEffect(() => {
    let session = getCurrentSession();
    if (!session) {
      session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: Date.now(),
      };
      setCurrentSession(session);

      const sessionStartEvent: LocalEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        eventType: 'session_start',
        context: getSessionContext(),
        tags: ['session'],
        source: 'app',
        synced: false,
      };
      saveLocalEvent(sessionStartEvent);
    }

    const handleBeforeUnload = () => {
      const currentSession = getCurrentSession();
      if (currentSession) {
        const sessionEndEvent: LocalEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          eventType: 'session_end',
          duration: Math.floor((Date.now() - currentSession.startTime) / 1000),
          context: getSessionContext(),
          tags: ['session'],
          source: 'app',
          synced: false,
        };
        saveLocalEvent(sessionEndEvent);
        setCurrentSession(null);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (currentPath !== lastPathRef.current) {
      const now = Date.now();
      const duration = Math.floor((now - pageStartTimeRef.current) / 1000);

      if (lastPathRef.current) {
        const pageLeaveEvent: LocalEvent = {
          id: `event_${now}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: now,
          eventType: 'page_leave',
          duration,
          context: getSessionContext(),
          tags: ['navigation', lastPathRef.current],
          source: 'app',
          synced: false,
        };
        saveLocalEvent(pageLeaveEvent);
      }

      const pageEnterEvent: LocalEvent = {
        id: `event_${now + 1}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now,
        eventType: 'page_enter',
        context: getSessionContext(),
        tags: ['navigation', currentPath],
        source: 'app',
        synced: false,
      };
      saveLocalEvent(pageEnterEvent);

      lastPathRef.current = currentPath;
      pageStartTimeRef.current = now;
    }
  }, [currentPath]);

  return null;
}
