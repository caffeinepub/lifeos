import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TopActivitiesPanelProps {
  activities: Array<{ name: string; count: number; duration: number }>;
}

export default function TopActivitiesPanel({ activities }: TopActivitiesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Activities</CardTitle>
        <CardDescription>Your most frequent activities</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{activity.name.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.count} times · {Math.floor(activity.duration / 60)} minutes
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No activities recorded yet</p>
        )}
      </CardContent>
    </Card>
  );
}
