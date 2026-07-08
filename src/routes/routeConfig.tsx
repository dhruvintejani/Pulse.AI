import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { DASHBOARD_SEGMENTS, ROUTES } from '@/constants/routes';
import RouteTransition from '@/routes/RouteTransition';
import {
  AnalyticsPage,
  BillingPage,
  ChatPage,
  DashboardHome,
  DashboardLayout,
  DocumentsPage,
  ForgotPasswordPage,
  LandingPage,
  LoginPage,
  ModelsPage,
  NotificationsPage,
  ProfilePage,
  ResetPasswordPage,
  SettingsPage,
  SignupPage,
  TeamPage,
  VerifyPage,
  WorkspacePage,
} from '@/routes/lazyPages';

interface BaseRouteConfig {
  key: string;
  element: ReactElement;
}

interface PathRouteConfig extends BaseRouteConfig {
  path: string;
  index?: false;
}

interface IndexRouteConfig extends BaseRouteConfig {
  index: true;
  path?: never;
}

export type AppRouteConfig = PathRouteConfig | IndexRouteConfig;

const withTransition = (page: ReactElement) => <RouteTransition>{page}</RouteTransition>;

const publicElement = (page: ReactElement) => (
  <PublicRoute>
    {withTransition(page)}
  </PublicRoute>
);

export const publicRoutes = [
  { key: 'home', path: ROUTES.HOME, element: publicElement(<LandingPage />) },
  { key: 'login', path: ROUTES.LOGIN, element: publicElement(<LoginPage />) },
  { key: 'signup', path: ROUTES.SIGNUP, element: publicElement(<SignupPage />) },
  { key: 'forgot-password', path: ROUTES.FORGOT_PASSWORD, element: publicElement(<ForgotPasswordPage />) },
  { key: 'reset-password', path: ROUTES.RESET_PASSWORD, element: publicElement(<ResetPasswordPage />) },
  { key: 'verify', path: ROUTES.VERIFY, element: publicElement(<VerifyPage />) },
] satisfies AppRouteConfig[];

export const ssoCallbackRoute = {
  key: 'sso-callback',
  path: ROUTES.SSO_CALLBACK,
  element: <AuthenticateWithRedirectCallback />,
} satisfies PathRouteConfig;

export const dashboardLayoutRoute = {
  key: 'dashboard-layout',
  path: ROUTES.DASHBOARD,
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
} satisfies PathRouteConfig;

export const dashboardRoutes = [
  { key: 'dashboard-home', index: true, element: withTransition(<DashboardHome />) },
  { key: 'dashboard-chat', path: DASHBOARD_SEGMENTS.CHAT, element: withTransition(<ChatPage />) },
  { key: 'dashboard-documents', path: DASHBOARD_SEGMENTS.DOCUMENTS, element: withTransition(<DocumentsPage />) },
  { key: 'dashboard-analytics', path: DASHBOARD_SEGMENTS.ANALYTICS, element: withTransition(<AnalyticsPage />) },
  { key: 'dashboard-workspace', path: DASHBOARD_SEGMENTS.WORKSPACE, element: withTransition(<WorkspacePage />) },
  { key: 'dashboard-models', path: DASHBOARD_SEGMENTS.MODELS, element: withTransition(<ModelsPage />) },
  { key: 'dashboard-notifications', path: DASHBOARD_SEGMENTS.NOTIFICATIONS, element: withTransition(<NotificationsPage />) },
  { key: 'dashboard-settings', path: DASHBOARD_SEGMENTS.SETTINGS, element: withTransition(<SettingsPage />) },
  { key: 'dashboard-billing', path: DASHBOARD_SEGMENTS.BILLING, element: withTransition(<BillingPage />) },
  { key: 'dashboard-profile', path: DASHBOARD_SEGMENTS.PROFILE, element: withTransition(<ProfilePage />) },
  { key: 'dashboard-team', path: DASHBOARD_SEGMENTS.TEAM, element: withTransition(<TeamPage />) },
] satisfies AppRouteConfig[];

export const fallbackRoute = {
  key: 'not-found',
  path: '*',
  element: <Navigate to={ROUTES.HOME} replace />,
} satisfies PathRouteConfig;
