import { useState } from 'react';
import { useGetAllData } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import TimeByContextChart from '../components/charts/TimeByContextChart';
import SessionsTrendChart from '../components/charts/SessionsTrendChart';
import TopActivitiesPanel from '../components/charts/TopActivitiesPanel';
import { deriveAnalytics } from '../analytics/deriveAnalytics';
import { Activity, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily');
  const { data, isLoading } = useGetAllData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const analytics = data ? deriveAnalytics(data.events, data.detailedEvents, timeRange) : null;

  if (!data || data.events.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your personal productivity overview</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to LifeOS</CardTitle>
            <CardDescription>Start using the app to see your analytics here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Navigate through the app, set your session context, and your usage data will appear here automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your personal productivity overview</p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'daily' | 'weekly')}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.focusScore || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics?.focusScoreExplanation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Index</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.productivityIndex || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics?.productivityExplanation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics?.totalDuration ? `${Math.floor(analytics.totalDuration / 60)} minutes` : '0 minutes'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TimeByContextChart data={analytics?.timeByContext || []} />
        <SessionsTrendChart data={analytics?.sessionsTrend || []} />
      </div>

      <TopActivitiesPanel activities={analytics?.topActivities || []} />
    </div>
  );
}
