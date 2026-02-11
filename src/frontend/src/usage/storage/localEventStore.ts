import type { LocalEvent, LocalDetailedEvent, ContextTag } from '../events/types';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const STORAGE_PREFIX = 'lifeos_';
const EVENTS_KEY = 'events';
const SESSION_KEY = 'current_session';
const CONTEXT_KEY = 'session_context';

function getStorageKey(key: string, principal?: string): string {
  return `${STORAGE_PREFIX}${principal || 'anon'}_${key}`;
}

function getUserKey(): string {
  const identity = (window as any).__lifeosIdentity;
  return identity?.getPrincipal().toString() || 'anon';
}

export type { ContextTag };

export function getLocalEvents(): LocalEvent[] {
  try {
    const key = getStorageKey(EVENTS_KEY, getUserKey());
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLocalEvent(event: LocalEvent): void {
  try {
    const events = getLocalEvents();
    events.push(event);
    const key = getStorageKey(EVENTS_KEY, getUserKey());
    localStorage.setItem(key, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save event:', error);
  }
}

export function getUnsyncedEvents(): LocalEvent[] {
  return getLocalEvents().filter((e) => !e.synced);
}

export function markEventsSynced(eventIds: string[]): void {
  try {
    const events = getLocalEvents();
    const updated = events.map((e) => (eventIds.includes(e.id) ? { ...e, synced: true } : e));
    const key = getStorageKey(EVENTS_KEY, getUserKey());
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to mark events synced:', error);
  }
}

export function clearLocalEvents(): void {
  try {
    const key = getStorageKey(EVENTS_KEY, getUserKey());
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear events:', error);
  }
}

export function getCurrentSession(): { id: string; startTime: number } | null {
  try {
    const key = getStorageKey(SESSION_KEY, getUserKey());
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentSession(session: { id: string; startTime: number } | null): void {
  try {
    const key = getStorageKey(SESSION_KEY, getUserKey());
    if (session) {
      localStorage.setItem(key, JSON.stringify(session));
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Failed to set session:', error);
  }
}

export function getSessionContext(): ContextTag {
  try {
    const key = getStorageKey(CONTEXT_KEY, getUserKey());
    const data = localStorage.getItem(key);
    return (data as ContextTag) || 'Work';
  } catch {
    return 'Work';
  }
}

export function setSessionContext(context: ContextTag): void {
  try {
    const key = getStorageKey(CONTEXT_KEY, getUserKey());
    localStorage.setItem(key, context);
  } catch (error) {
    console.error('Failed to set context:', error);
  }
}
