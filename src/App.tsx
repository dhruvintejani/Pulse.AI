import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary, RouteAnnouncer, Seo } from '@/components/common';
import { CommandPalette, InstallPrompt, KeyboardShortcuts, OfflineBanner } from '@/components/experience';
import { AppRouter } from '@/routes';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Seo />
        <RouteAnnouncer />
        <KeyboardShortcuts />
        <CommandPalette />
        <OfflineBanner />
        <InstallPrompt />
        <AppRouter />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
