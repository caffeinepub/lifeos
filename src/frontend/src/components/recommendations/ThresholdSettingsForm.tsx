import { useState } from 'react';
import { useRecommendationPreferences } from '../../recommendations/preferences/useRecommendationPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function ThresholdSettingsForm() {
  const { preferences, updatePreferences } = useRecommendationPreferences();
  const [entertainmentMax, setEntertainmentMax] = useState(preferences.maxMinutesPerDay.entertainment || 120);
  const [socialMax, setSocialMax] = useState(preferences.maxMinutesPerDay.social || 60);
  const [quietStart, setQuietStart] = useState(preferences.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(preferences.quietHoursEnd);

  const handleSave = () => {
    updatePreferences({
      maxMinutesPerDay: {
        entertainment: entertainmentMax,
        social: socialMax,
      },
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
    });
    toast.success('Settings saved successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendation Settings</CardTitle>
        <CardDescription>Configure thresholds and quiet hours for alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entertainment">Max Entertainment Minutes/Day</Label>
            <Input
              id="entertainment"
              type="number"
              value={entertainmentMax}
              onChange={(e) => setEntertainmentMax(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social">Max Social Minutes/Day</Label>
            <Input
              id="social"
              type="number"
              value={socialMax}
              onChange={(e) => setSocialMax(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quietStart">Quiet Hours Start</Label>
              <Input
                id="quietStart"
                type="number"
                value={quietStart}
                onChange={(e) => setQuietStart(Number(e.target.value))}
                min={0}
                max={23}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quietEnd">Quiet Hours End</Label>
              <Input
                id="quietEnd"
                type="number"
                value={quietEnd}
                onChange={(e) => setQuietEnd(Number(e.target.value))}
                min={0}
                max={23}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
