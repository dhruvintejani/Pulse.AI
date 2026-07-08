import { lazyWithPreload } from '@/utils/lazyImport';

export const DashboardLayout = lazyWithPreload(() => import('@/layouts/DashboardLayout'));

export const LandingPage = lazyWithPreload(() => import('@/pages/LandingPage'));

export const LoginPage = lazyWithPreload(() => import('@/pages/auth/LoginPage'));
export const SignupPage = lazyWithPreload(() => import('@/pages/auth/SignupPage'));
export const ForgotPasswordPage = lazyWithPreload(() => import('@/pages/auth/ForgotPasswordPage'));
export const ResetPasswordPage = lazyWithPreload(() => import('@/pages/auth/ResetPasswordPage'));
export const VerifyPage = lazyWithPreload(() => import('@/pages/auth/VerifyPage'));

export const DashboardHome = lazyWithPreload(() => import('@/pages/dashboard/DashboardHome'));
export const ChatPage = lazyWithPreload(() => import('@/pages/dashboard/ChatPage'));
export const DocumentsPage = lazyWithPreload(() => import('@/pages/dashboard/DocumentsPage'));
export const AnalyticsPage = lazyWithPreload(() => import('@/pages/dashboard/AnalyticsPage'));
export const WorkspacePage = lazyWithPreload(() => import('@/pages/dashboard/WorkspacePage'));
export const NotificationsPage = lazyWithPreload(() => import('@/pages/dashboard/NotificationsPage'));
export const SettingsPage = lazyWithPreload(() => import('@/pages/dashboard/SettingsPage'));
export const BillingPage = lazyWithPreload(() => import('@/pages/dashboard/BillingPage'));
export const ModelsPage = lazyWithPreload(() => import('@/pages/dashboard/ModelsPage'));
export const ProfilePage = lazyWithPreload(() => import('@/pages/dashboard/ProfilePage'));
export const TeamPage = lazyWithPreload(() => import('@/pages/dashboard/TeamPage'));
export const AdminPage = lazyWithPreload(() => import('@/pages/dashboard/AdminPage'));

export const routePreloaders = {
  landing: LandingPage.preload,
  dashboard: DashboardHome.preload,
  chat: ChatPage.preload,
  documents: DocumentsPage.preload,
  analytics: AnalyticsPage.preload,
  workspace: WorkspacePage.preload,
  notifications: NotificationsPage.preload,
  settings: SettingsPage.preload,
  billing: BillingPage.preload,
  profile: ProfilePage.preload,
  models: ModelsPage.preload,
  team: TeamPage.preload,
  admin: AdminPage.preload,
};
