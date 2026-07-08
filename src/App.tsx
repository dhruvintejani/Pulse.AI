import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary, RouteAnnouncer } from '@/components/common';
import { AppRouter } from '@/routes';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <RouteAnnouncer />
        <AppRouter />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
