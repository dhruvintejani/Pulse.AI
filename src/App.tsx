import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import PublicRoute from '@/components/auth/PublicRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';
import BottomNav from '@/components/layout/BottomNav';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyPage from '@/pages/auth/VerifyPage';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ChatPage from '@/pages/dashboard/ChatPage';
import DocumentsPage from '@/pages/dashboard/DocumentsPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';
import WorkspacePage from '@/pages/dashboard/WorkspacePage';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import BillingPage from '@/pages/dashboard/BillingPage';
import ModelsPage from '@/pages/dashboard/ModelsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
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

const publicPage = (page: React.ReactNode) => (
  <PublicRoute>
    <PageTransition>{page}</PageTransition>
  </PublicRoute>
);

const dashboardPage = (page: React.ReactNode) => (
  <PageTransition>{page}</PageTransition>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={publicPage(<LandingPage />)} />
          <Route path="/login" element={publicPage(<LoginPage />)} />
          <Route path="/signup" element={publicPage(<SignupPage />)} />
          <Route path="/forgot-password" element={publicPage(<ForgotPasswordPage />)} />
          <Route path="/reset-password" element={publicPage(<ResetPasswordPage />)} />
          <Route path="/verify" element={publicPage(<VerifyPage />)} />
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={dashboardPage(<DashboardHome />)} />
            <Route path="chat" element={dashboardPage(<ChatPage />)} />
            <Route path="documents" element={dashboardPage(<DocumentsPage />)} />
            <Route path="analytics" element={dashboardPage(<AnalyticsPage />)} />
            <Route path="workspace" element={dashboardPage(<WorkspacePage />)} />
            <Route path="models" element={dashboardPage(<ModelsPage />)} />
            <Route path="notifications" element={dashboardPage(<NotificationsPage />)} />
            <Route path="settings" element={dashboardPage(<SettingsPage />)} />
            <Route path="billing" element={dashboardPage(<BillingPage />)} />
            <Route path="profile" element={dashboardPage(<ProfilePage />)} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Bottom Navigation - shown on all pages except pure auth */}
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
