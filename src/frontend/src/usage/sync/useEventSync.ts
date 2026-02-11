import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { getUnsyncedEvents, markEventsSynced } from '../storage/localEventStore';
import { localEventToBackendEvent } from '../events/types';

export function useEventSync() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const syncInProgressRef = useRef(false);

  useEffect(() => {
    if (!identity || !actor || syncInProgressRef.current) return;

    const syncEvents = async () => {
      syncInProgressRef.current = true;
      try {
        const unsyncedEvents = getUnsyncedEvents();
        if (unsyncedEvents.length === 0) return;

        const eventIds: string[] = [];
        for (const localEvent of unsyncedEvents.slice(0, 10)) {
          try {
            const backendEvent = localEventToBackendEvent(localEvent);
            await actor.logEvent(backendEvent);
            eventIds.push(localEvent.id);
          } catch (error) {
            console.error('Failed to sync event:', error);
          }
        }

        if (eventIds.length > 0) {
          markEventsSynced(eventIds);
          queryClient.invalidateQueries({ queryKey: ['events'] });
          queryClient.invalidateQueries({ queryKey: ['allData'] });
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
        }
      } finally {
        syncInProgressRef.current = false;
      }
    };

    const interval = setInterval(syncEvents, 10000);
    syncEvents();

    return () => clearInterval(interval);
  }, [identity, actor, queryClient]);
}
