import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import './styles/design-system.css';
import './styles/polish.css';
import './styles/responsive.css';
import './styles/product-polish.css';
import App from './App';
import { AppProviders } from './contexts';
import { registerServiceWorker } from './utils';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
