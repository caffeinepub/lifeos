import { useGetAllData } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { formatInsights } from '../insights/formatInsights';
import { Lightbulb, Clock, TrendingUp } from 'lucide-react';

export default function InsightsPage() {
  const { data, isLoading } = useGetAllData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const insights = data ? formatInsights(data.patterns, data.events) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">AI-powered behavior analysis and predictions</p>
      </div>

      {!insights || insights.routines.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Building Your Insights</CardTitle>
            <CardDescription>Keep using LifeOS to unlock personalized insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As you use the app, we'll detect patterns in your behavior and provide intelligent recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Detected Routines
              </CardTitle>
              <CardDescription>Recurring patterns in your daily activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.routines.map((routine, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <p className="font-medium">{routine}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Next Context Prediction
              </CardTitle>
              <CardDescription>What you're likely to do next</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{insights.nextContextPrediction}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Behavior Summary
              </CardTitle>
              <CardDescription>Overview of your usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{insights.summary}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
