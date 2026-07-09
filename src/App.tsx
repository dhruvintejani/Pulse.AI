import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary, GlobalErrorHandlers, RouteAnnouncer, Seo } from '@/components/common';
import { CommandPalette, InstallPrompt, KeyboardShortcuts, OfflineBanner, PremiumCursor } from '@/components/experience';
import { AppRouter } from '@/routes';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Seo />
        <GlobalErrorHandlers />
        <RouteAnnouncer />
        <KeyboardShortcuts />
        <CommandPalette />
        <OfflineBanner />
        <InstallPrompt />
        <PremiumCursor />
        <AppRouter />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
