import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import { DASHBOARD_SEGMENTS, ROUTES } from '@/constants/routes';
import BottomNav from '@/layouts/BottomNav';
import DashboardLayout from '@/layouts/DashboardLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyPage = lazy(() => import('@/pages/auth/VerifyPage'));
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
const ChatPage = lazy(() => import('@/pages/dashboard/ChatPage'));
const DocumentsPage = lazy(() => import('@/pages/dashboard/DocumentsPage'));
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'));
const WorkspacePage = lazy(() => import('@/pages/dashboard/WorkspacePage'));
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
const BillingPage = lazy(() => import('@/pages/dashboard/BillingPage'));
const ModelsPage = lazy(() => import('@/pages/dashboard/ModelsPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const publicPage = (page: ReactNode) => (
  <PublicRoute>
    <PageTransition>{page}</PageTransition>
  </PublicRoute>
);

const dashboardPage = (page: ReactNode) => <PageTransition>{page}</PageTransition>;

const AppRouter = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.HOME} element={publicPage(<LandingPage />)} />
          <Route path={ROUTES.LOGIN} element={publicPage(<LoginPage />)} />
          <Route path={ROUTES.SIGNUP} element={publicPage(<SignupPage />)} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={publicPage(<ForgotPasswordPage />)} />
          <Route path={ROUTES.RESET_PASSWORD} element={publicPage(<ResetPasswordPage />)} />
          <Route path={ROUTES.VERIFY} element={publicPage(<VerifyPage />)} />
          <Route path={ROUTES.SSO_CALLBACK} element={<AuthenticateWithRedirectCallback />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={dashboardPage(<DashboardHome />)} />
            <Route path={DASHBOARD_SEGMENTS.CHAT} element={dashboardPage(<ChatPage />)} />
            <Route path={DASHBOARD_SEGMENTS.DOCUMENTS} element={dashboardPage(<DocumentsPage />)} />
            <Route path={DASHBOARD_SEGMENTS.ANALYTICS} element={dashboardPage(<AnalyticsPage />)} />
            <Route path={DASHBOARD_SEGMENTS.WORKSPACE} element={dashboardPage(<WorkspacePage />)} />
            <Route path={DASHBOARD_SEGMENTS.MODELS} element={dashboardPage(<ModelsPage />)} />
            <Route path={DASHBOARD_SEGMENTS.NOTIFICATIONS} element={dashboardPage(<NotificationsPage />)} />
            <Route path={DASHBOARD_SEGMENTS.SETTINGS} element={dashboardPage(<SettingsPage />)} />
            <Route path={DASHBOARD_SEGMENTS.BILLING} element={dashboardPage(<BillingPage />)} />
            <Route path={DASHBOARD_SEGMENTS.PROFILE} element={dashboardPage(<ProfilePage />)} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </Suspense>
  );
};

export default AppRouter;
