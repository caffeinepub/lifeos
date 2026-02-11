import { useFocusMode } from '../focus/useFocusMode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Pause, Square, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FocusModePage() {
  const { isActive, isPaused, startTime, start, pause, stop } = useFocusMode();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Focus Mode</h1>
        <p className="text-muted-foreground">Minimize distractions and maximize productivity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Focus Timer
          </CardTitle>
          <CardDescription>
            This controls LifeOS UI only. It does not block system-level apps or notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold font-mono">{formatTime(elapsed)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {isActive ? (isPaused ? 'Paused' : 'Active') : 'Not started'}
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {!isActive ? (
              <Button onClick={start} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Focus Session
              </Button>
            ) : (
              <>
                <Button onClick={isPaused ? start : pause} size="lg" variant="outline" className="gap-2">
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={stop} size="lg" variant="destructive" className="gap-2">
                  <Square className="h-5 w-5" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Focus Mode Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Tracks your focused work time</p>
          <p>• Blocks access to selected LifeOS sections (configurable in Settings)</p>
          <p>• Filters in-app notifications based on your preferences</p>
          <p>• Does NOT control system-level apps or device notifications</p>
        </CardContent>
      </Card>
    </div>
  );
}
