import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Event, DetailedEvent, RoutinePattern, Recommendation, UsageContext } from '../backend';
import { Variant_low_high_medium } from '../backend';

export function useGetAllData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEvents(filter?: UsageContext | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEvents(filter || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDetailedEvents(filter?: UsageContext | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['detailedEvents', filter],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDetailedEvents(filter || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useAddDetailedEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: DetailedEvent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDetailedEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailedEvents'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useGetAlertsByUrgency(urgency: Variant_low_high_medium) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['alerts', urgency],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAlertsByUrgency(urgency);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rec: Recommendation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRecommendation(rec);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useGetCategoryPercentage(category: UsageContext) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['categoryPercentage', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCategoryPercentage(category);
    },
    enabled: !!actor && !isFetching,
  });
}
