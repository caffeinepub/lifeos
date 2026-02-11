import { type ReactNode } from 'react';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import { useFocusMode } from '../useFocusMode';
import { useFocusBlocklist } from './useFocusBlocklist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface FocusBlockGateProps {
  children: ReactNode;
}

export default function FocusBlockGate({ children }: FocusBlockGateProps) {
  const { isActive } = useFocusMode();
  const { isBlocked } = useFocusBlocklist();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  if (isActive && isBlocked(currentPath)) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Focus Mode Active
            </CardTitle>
            <CardDescription>This section is blocked during focus sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You've configured this section to be blocked during focus mode to help you stay on track.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/' })}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => navigate({ to: '/focus' })}>
                Manage Focus Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
