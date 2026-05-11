import { createRoot } from 'react-dom/client';
import './index.scss';
import './styles/theme-toggle-global.scss';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { resolveBackendOrigin, REMOTE_BACKEND } from './lib/apiOrigin';
import { applyBackendConfig } from './lib/axios';
import { initSocket } from './lib/socket';

resolveBackendOrigin().then((origin) => {
  const apiBase =
    origin === REMOTE_BACKEND
      ? `${REMOTE_BACKEND.replace(/\/$/, '')}/api/`
      : '/api/';
  applyBackendConfig(apiBase);
  initSocket(origin);

  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
});
