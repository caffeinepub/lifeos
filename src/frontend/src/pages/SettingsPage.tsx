import { useFocusBlocklist } from '../focus/blocklist/useFocusBlocklist';
import { useInAppNotificationPreferences } from '../notifications/useInAppNotificationPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { blocklist, updateBlocklist } = useFocusBlocklist();
  const { preferences, updatePreferences } = useInAppNotificationPreferences();

  const availablePaths = [
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/insights', label: 'Insights' },
    { path: '/data-privacy', label: 'Data & Privacy' },
  ];

  const handleBlocklistChange = (path: string, checked: boolean) => {
    const newBlocklist = checked
      ? [...blocklist, path]
      : blocklist.filter((p) => p !== path);
    updateBlocklist(newBlocklist);
    toast.success('Focus blocklist updated');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your LifeOS experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Focus Mode Blocklist</CardTitle>
          <CardDescription>
            Select which LifeOS sections to block during focus sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availablePaths.map((item) => (
            <div key={item.path} className="flex items-center space-x-2">
              <Checkbox
                id={item.path}
                checked={blocklist.includes(item.path)}
                onCheckedChange={(checked) => handleBlocklistChange(item.path, checked as boolean)}
              />
              <Label htmlFor={item.path} className="cursor-pointer">
                {item.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Control which LifeOS notifications you receive (does not affect device notifications)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="recommendations">Recommendations</Label>
            <Switch
              id="recommendations"
              checked={preferences.enableRecommendations}
              onCheckedChange={(checked) => {
                updatePreferences({ enableRecommendations: checked });
                toast.success('Notification preferences updated');
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="alerts">Alerts</Label>
            <Switch
              id="alerts"
              checked={preferences.enableAlerts}
              onCheckedChange={(checked) => {
                updatePreferences({ enableAlerts: checked });
                toast.success('Notification preferences updated');
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="insights">Insights</Label>
            <Switch
              id="insights"
              checked={preferences.enableInsights}
              onCheckedChange={(checked) => {
                updatePreferences({ enableInsights: checked });
                toast.success('Notification preferences updated');
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
