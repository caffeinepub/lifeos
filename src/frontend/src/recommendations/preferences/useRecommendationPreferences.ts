import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { defaultPreferences, type RecommendationPreferences } from './types';

const STORAGE_KEY = 'lifeos_rec_prefs';

function getStorageKey(principal?: string): string {
  return `${STORAGE_KEY}_${principal || 'anon'}`;
}

export function useRecommendationPreferences() {
  const { identity } = useInternetIdentity();
  const [preferences, setPreferences] = useState<RecommendationPreferences>(defaultPreferences);

  useEffect(() => {
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        setPreferences(defaultPreferences);
      }
    } catch {
      setPreferences(defaultPreferences);
    }
  }, [identity]);

  const updatePreferences = (updates: Partial<RecommendationPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    const key = getStorageKey(identity?.getPrincipal().toString());
    try {
      localStorage.setItem(key, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const dismissRecommendation = (id: string) => {
    updatePreferences({
      dismissedRecommendations: [...preferences.dismissedRecommendations, id],
    });
  };

  return {
    preferences,
    updatePreferences,
    dismissRecommendation,
  };
}
