import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/auth/RequireAuth';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import FocusModePage from './pages/FocusModePage';
import DataPrivacyPage from './pages/DataPrivacyPage';
import SettingsPage from './pages/SettingsPage';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  // Only show profile setup when authenticated, profile is fetched, and profile is null
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <RequireAuth />;
  }

  // Show profile setup dialog if needed, otherwise show the app
  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return <AppLayout />;
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage
});

const recommendationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recommendations',
  component: RecommendationsPage
});

const focusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/focus',
  component: FocusModePage
});

const dataPrivacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data-privacy',
  component: DataPrivacyPage
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  insightsRoute,
  recommendationsRoute,
  focusRoute,
  dataPrivacyRoute,
  settingsRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
