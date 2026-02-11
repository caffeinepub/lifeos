import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const STORAGE_KEY = 'lifeos_focus_blocklist';

function getStorageKey(principal?: string): string {
  return `${STORAGE_KEY}_${principal || 'anon'}`;
}

export function useFocusBlocklist() {
  const { identity } = useInternetIdentity();
  const [blocklist, setBlocklist] = useState<string[]>(['/recommendations', '/insights']);

  useEffect(() => {
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setBlocklist(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [identity]);

  const updateBlocklist = (paths: string[]) => {
    setBlocklist(paths);
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      localStorage.setItem(key, JSON.stringify(paths));
    } catch (error) {
      console.error('Failed to save blocklist:', error);
    }
  };

  const isBlocked = (path: string) => blocklist.includes(path);

  return {
    blocklist,
    updateBlocklist,
    isBlocked,
  };
}
