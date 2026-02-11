import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const STORAGE_KEY = 'lifeos_encryption_enabled';

function getStorageKey(principal?: string): string {
  return `${STORAGE_KEY}_${principal || 'anon'}`;
}

export function useLocalEncryptionSetting() {
  const { identity } = useInternetIdentity();
  const [encryptionEnabled, setEncryptionEnabledState] = useState(false);

  useEffect(() => {
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      const stored = localStorage.getItem(key);
      setEncryptionEnabledState(stored === 'true');
    } catch {
      setEncryptionEnabledState(false);
    }
  }, [identity]);

  const setEncryptionEnabled = (enabled: boolean) => {
    setEncryptionEnabledState(enabled);
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      localStorage.setItem(key, enabled.toString());
    } catch (error) {
      console.error('Failed to save encryption setting:', error);
    }
  };

  return {
    encryptionEnabled,
    setEncryptionEnabled,
  };
}
