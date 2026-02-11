import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface NotificationPreferences {
  enableRecommendations: boolean;
  enableAlerts: boolean;
  enableInsights: boolean;
}

const STORAGE_KEY = 'lifeos_notification_prefs';

function getStorageKey(principal?: string): string {
  return `${STORAGE_KEY}_${principal || 'anon'}`;
}

export function useInAppNotificationPreferences() {
  const { identity } = useInternetIdentity();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableRecommendations: true,
    enableAlerts: true,
    enableInsights: true,
  });

  useEffect(() => {
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, [identity]);

  const updatePreferences = (updates: Partial<NotificationPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      localStorage.setItem(key, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };

  return {
    preferences,
    updatePreferences,
  };
}
