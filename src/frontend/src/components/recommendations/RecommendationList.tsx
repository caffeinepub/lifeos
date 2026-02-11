import { useRecommendationPreferences } from '../../recommendations/preferences/useRecommendationPreferences';
import type { Recommendation, Event } from '../../backend';
import { Variant_low_high_medium } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface RecommendationListProps {
  recommendations: Recommendation[];
  events: Event[];
}

export default function RecommendationList({ recommendations, events }: RecommendationListProps) {
  const { preferences, dismissRecommendation } = useRecommendationPreferences();

  const now = new Date();
  const currentHour = now.getHours();
  const isQuietHours =
    currentHour >= preferences.quietHoursStart || currentHour < preferences.quietHoursEnd;

  const filteredRecs = recommendations.filter(
    (rec) => !preferences.dismissedRecommendations.includes(rec.title)
  );

  const generatedRecs = generateRecommendations(events, preferences);
  const allRecs = [...filteredRecs, ...generatedRecs];

  if (allRecs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations</CardTitle>
          <CardDescription>You're doing great! No alerts at this time.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isQuietHours && 'Quiet hours are active. Alerts are suppressed.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyIcon = (urgency: Variant_low_high_medium) => {
    switch (urgency) {
      case Variant_low_high_medium.high:
        return <AlertTriangle className="h-4 w-4" />;
      case Variant_low_high_medium.medium:
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getUrgencyVariant = (urgency: Variant_low_high_medium): 'default' | 'destructive' | 'outline' => {
    switch (urgency) {
      case Variant_low_high_medium.high:
        return 'destructive';
      case Variant_low_high_medium.medium:
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {isQuietHours && (
        <Card className="border-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Quiet hours are active. Only high-priority alerts are shown.
            </p>
          </CardContent>
        </Card>
      )}

      {allRecs
        .filter((rec) => !isQuietHours || rec.urgencyLevel === Variant_low_high_medium.high)
        .map((rec) => (
          <Card key={rec.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <Badge variant={getUrgencyVariant(rec.urgencyLevel)} className="gap-1">
                      {getUrgencyIcon(rec.urgencyLevel)}
                      {rec.urgencyLevel}
                    </Badge>
                  </div>
                  <CardDescription>{rec.category}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissRecommendation(rec.title)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{rec.message}</p>
              {rec.confidenceScore > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Confidence: {Number(rec.confidenceScore)}%
                </p>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

function generateRecommendations(events: Event[], preferences: any): Recommendation[] {
  const recs: Recommendation[] = [];
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const recentEvents = events.filter((e) => Number(e.timestamp) / 1_000_000 >= oneDayAgo);

  const contextDurations: Record<string, number> = {};
  recentEvents.forEach((e) => {
    if (e.context && e.duration) {
      const ctx = e.context.__kind__;
      contextDurations[ctx] = (contextDurations[ctx] || 0) + Number(e.duration);
    }
  });

  Object.entries(preferences.maxMinutesPerDay).forEach(([context, maxMinutes]) => {
    const actualMinutes = Math.floor((contextDurations[context] || 0) / 60);
    if (actualMinutes > (maxMinutes as number)) {
      recs.push({
        title: `${context.charAt(0).toUpperCase() + context.slice(1)} Overuse Alert`,
        message: `You've spent ${actualMinutes} minutes on ${context} today, exceeding your ${maxMinutes}-minute limit.`,
        category: 'OveruseAlert',
        confidenceScore: BigInt(85),
        urgencyLevel: Variant_low_high_medium.medium,
        historicalPerformance: [],
      });
    }
  });

  const studyDuration = contextDurations['study'] || 0;
  const workDuration = contextDurations['work'] || 0;
  const productiveDuration = studyDuration + workDuration;

  if (productiveDuration < 60 * 60 && recentEvents.length > 5) {
    recs.push({
      title: 'Focus Window Suggestion',
      message: 'Consider scheduling a focused work session. Your productivity is below average today.',
      category: 'FocusWindow',
      confidenceScore: BigInt(70),
      urgencyLevel: Variant_low_high_medium.low,
      historicalPerformance: [],
    });
  }

  return recs;
}
