import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useUsageTracker } from '../../usage/tracking/useUsageTracker';
import { useEventSync } from '../../usage/sync/useEventSync';
import { useFocusMode } from '../../focus/useFocusMode';
import FocusBlockGate from '../../focus/blocklist/FocusBlockGate';
import LoginButton from '../auth/LoginButton';
import SessionContextTagEditor from '../context/SessionContextTagEditor';
import { Button } from '../ui/button';
import { LayoutDashboard, Lightbulb, Bell, Target, Shield, Settings, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AppLayout() {
  useUsageTracker();
  useEventSync();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isActive: isFocusActive } = useFocusMode();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
    { path: '/recommendations', label: 'Recommendations', icon: Bell },
    { path: '/focus', label: 'Focus Mode', icon: Target },
    { path: '/data-privacy', label: 'Data & Privacy', icon: Shield },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/assets/generated/lifeos-logo.dim_512x512.png" alt="LifeOS" className="h-8 w-auto" />
            {isFocusActive && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                Focus Mode Active
              </span>
            )}
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={currentPath === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
          <div className="flex items-center space-x-2">
            <SessionContextTagEditor />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="container py-6">
        <FocusBlockGate>
          <Outlet />
        </FocusBlockGate>
      </main>

      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} LifeOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
