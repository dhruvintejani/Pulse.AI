import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from '@/components/common';
import { AppRouter } from '@/routes';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
