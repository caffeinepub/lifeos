import type { RoutinePattern, Event } from '../backend';

export interface FormattedInsights {
  routines: string[];
  nextContextPrediction: string;
  summary: string;
}

export function formatInsights(patterns: RoutinePattern[], events: Event[]): FormattedInsights {
  const routines = patterns.map((pattern) => {
    const contextName = pattern.context.__kind__;
    const avgMinutes = Math.floor(Number(pattern.avgDuration) / 60);
    const frequency = Number(pattern.frequency);

    const topTimeOfDay = Object.entries(pattern.timeOfDayDistribution)
      .sort(([, a], [, b]) => Number(b) - Number(a))[0]?.[0] || 'morning';

    return `You typically spend ${avgMinutes} minutes on ${contextName} activities during the ${topTimeOfDay}, occurring ${frequency} times in the analyzed period.`;
  });

  const recentEvents = events.slice(-10);
  const recentContexts = recentEvents
    .filter((e) => e.context)
    .map((e) => e.context!.__kind__);

  const contextCounts = recentContexts.reduce((acc, ctx) => {
    acc[ctx] = (acc[ctx] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const predictedContext = Object.entries(contextCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'work';

  const nextContextPrediction = `Based on recent patterns, you're likely to engage in ${predictedContext} activities next.`;

  const totalPatterns = patterns.length;
  const totalEvents = events.length;
  const summary = `We've analyzed ${totalEvents} events and identified ${totalPatterns} routine patterns in your behavior. Your usage shows consistent patterns that can help optimize your productivity.`;

  return {
    routines,
    nextContextPrediction,
    summary,
  };
}
