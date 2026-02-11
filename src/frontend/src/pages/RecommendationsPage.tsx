import { useGetAllData } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import RecommendationList from '../components/recommendations/RecommendationList';
import ThresholdSettingsForm from '../components/recommendations/ThresholdSettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function RecommendationsPage() {
  const { data, isLoading } = useGetAllData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recommendations & Alerts</h1>
        <p className="text-muted-foreground">Personalized suggestions for better productivity</p>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <RecommendationList recommendations={data?.recommendations || []} events={data?.events || []} />
        </TabsContent>

        <TabsContent value="settings">
          <ThresholdSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
