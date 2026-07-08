import { memo, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen';
import BottomNav from '@/layouts/BottomNav';
import {
  dashboardLayoutRoute,
  dashboardRoutes,
  fallbackRoute,
  publicRoutes,
  ssoCallbackRoute,
} from '@/routes/routeConfig';

const AppRouter = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {publicRoutes.map((route) => (
            <Route key={route.key} path={route.path} element={route.element} />
          ))}

          <Route path={ssoCallbackRoute.path} element={ssoCallbackRoute.element} />

          <Route path={dashboardLayoutRoute.path} element={dashboardLayoutRoute.element}>
            {dashboardRoutes.map((route) => (
              route.index ? (
                <Route key={route.key} index element={route.element} />
              ) : (
                <Route key={route.key} path={route.path} element={route.element} />
              )
            ))}
          </Route>

          <Route path={fallbackRoute.path} element={fallbackRoute.element} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </Suspense>
  );
};

export default memo(AppRouter);
