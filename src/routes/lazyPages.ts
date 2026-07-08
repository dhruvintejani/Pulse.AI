import { lazy } from 'react';

export const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

export const LandingPage = lazy(() => import('@/pages/LandingPage'));

export const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
export const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
export const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
export const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
export const VerifyPage = lazy(() => import('@/pages/auth/VerifyPage'));

export const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
export const ChatPage = lazy(() => import('@/pages/dashboard/ChatPage'));
export const DocumentsPage = lazy(() => import('@/pages/dashboard/DocumentsPage'));
export const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'));
export const WorkspacePage = lazy(() => import('@/pages/dashboard/WorkspacePage'));
export const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'));
export const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
export const BillingPage = lazy(() => import('@/pages/dashboard/BillingPage'));
export const ModelsPage = lazy(() => import('@/pages/dashboard/ModelsPage'));
export const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
