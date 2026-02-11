import type { Event, DetailedEvent } from '../backend';

export interface AnalyticsData {
  focusScore: number;
  focusScoreExplanation: string;
  productivityIndex: number;
  productivityExplanation: string;
  totalSessions: number;
  totalDuration: number;
  timeByContext: Array<{ context: string; duration: number }>;
  sessionsTrend: Array<{ date: string; count: number }>;
  topActivities: Array<{ name: string; count: number; duration: number }>;
}

export function deriveAnalytics(
  events: Event[],
  detailedEvents: DetailedEvent[],
  timeRange: 'daily' | 'weekly'
): AnalyticsData {
  const now = Date.now();
  const rangeMs = timeRange === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  const cutoff = now - rangeMs;

  const recentEvents = events.filter((e) => Number(e.timestamp) / 1_000_000 >= cutoff);

  const sessionEvents = recentEvents.filter((e) => e.eventType === 'session_start' || e.eventType === 'session_end');
  const totalSessions = sessionEvents.filter((e) => e.eventType === 'session_start').length;

  const totalDuration = recentEvents.reduce((sum, e) => sum + (e.duration ? Number(e.duration) : 0), 0);

  const contextMap = new Map<string, number>();
  recentEvents.forEach((e) => {
    if (e.context && e.duration) {
      const contextKey = e.context.__kind__;
      const current = contextMap.get(contextKey) || 0;
      contextMap.set(contextKey, current + Number(e.duration));
    }
  });

  const timeByContext = Array.from(contextMap.entries()).map(([context, duration]) => ({
    context,
    duration,
  }));

  const productiveContexts = ['study', 'work'];
  const productiveDuration = timeByContext
    .filter((c) => productiveContexts.includes(c.context))
    .reduce((sum, c) => sum + c.duration, 0);

  const focusScore = totalDuration > 0 ? Math.round((productiveDuration / totalDuration) * 100) : 0;
  const focusScoreExplanation = `Based on ${Math.floor(productiveDuration / 60)} productive minutes out of ${Math.floor(totalDuration / 60)} total minutes`;

  const productivityIndex = totalSessions > 0 ? Math.round((productiveDuration / totalSessions) / 60) : 0;
  const productivityExplanation = `Average ${productivityIndex} productive minutes per session`;

  const dateMap = new Map<string, number>();
  recentEvents.forEach((e) => {
    if (e.eventType === 'session_start') {
      const date = new Date(Number(e.timestamp) / 1_000_000).toLocaleDateString();
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    }
  });

  const sessionsTrend = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const activityMap = new Map<string, { count: number; duration: number }>();
  recentEvents.forEach((e) => {
    const activity = e.eventType;
    const current = activityMap.get(activity) || { count: 0, duration: 0 };
    activityMap.set(activity, {
      count: current.count + 1,
      duration: current.duration + (e.duration ? Number(e.duration) : 0),
    });
  });

  const topActivities = Array.from(activityMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    focusScore,
    focusScoreExplanation,
    productivityIndex,
    productivityExplanation,
    totalSessions,
    totalDuration,
    timeByContext,
    sessionsTrend,
    topActivities,
  };
}
