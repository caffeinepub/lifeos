import type { Event, DetailedEvent, UsageContext, InteractionType } from '../../backend';
import { Variant_app_browser } from '../../backend';

export type ContextTag = 'Study' | 'Work' | 'Entertainment' | 'Idle' | 'Custom';

export function contextTagToUsageContext(tag: ContextTag): UsageContext {
  switch (tag) {
    case 'Study':
      return { __kind__: 'study', study: null };
    case 'Work':
      return { __kind__: 'work', work: null };
    case 'Entertainment':
      return { __kind__: 'entertainment', entertainment: null };
    case 'Idle':
      return { __kind__: 'other', other: 'idle' };
    case 'Custom':
      return { __kind__: 'other', other: 'custom' };
  }
}

export function usageContextToContextTag(context: UsageContext): ContextTag {
  switch (context.__kind__) {
    case 'study':
      return 'Study';
    case 'work':
      return 'Work';
    case 'entertainment':
      return 'Entertainment';
    case 'other':
      return context.other === 'idle' ? 'Idle' : 'Custom';
    default:
      return 'Custom';
  }
}

export interface LocalEvent {
  id: string;
  timestamp: number;
  eventType: string;
  duration?: number;
  context?: ContextTag;
  tags: string[];
  source: 'app' | 'browser';
  synced: boolean;
}

export interface LocalDetailedEvent extends LocalEvent {
  interactionType?: string;
  pageDetails?: string;
  deviceDetails?: string;
  additionalData?: string;
}

export function localEventToBackendEvent(event: LocalEvent): Event {
  return {
    id: event.id,
    timestamp: BigInt(event.timestamp * 1_000_000),
    eventType: event.eventType,
    duration: event.duration ? BigInt(event.duration) : undefined,
    context: event.context ? contextTagToUsageContext(event.context) : undefined,
    tags: event.tags,
    source: event.source === 'app' ? Variant_app_browser.app : Variant_app_browser.browser,
  };
}

export function localDetailedEventToBackendEvent(event: LocalDetailedEvent): DetailedEvent {
  return {
    id: event.id,
    timestamp: BigInt(event.timestamp * 1_000_000),
    eventType: event.eventType,
    duration: event.duration ? BigInt(event.duration) : undefined,
    context: event.context ? contextTagToUsageContext(event.context) : undefined,
    tags: event.tags,
    source: event.source === 'app' ? Variant_app_browser.app : Variant_app_browser.browser,
    interactionType: event.interactionType ? ({ __kind__: 'appSpecific', appSpecific: event.interactionType } as InteractionType) : undefined,
    pageDetails: event.pageDetails,
    deviceDetails: event.deviceDetails,
    additionalData: event.additionalData,
  };
}
