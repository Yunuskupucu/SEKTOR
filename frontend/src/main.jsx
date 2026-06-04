import { createRoot } from 'react-dom/client';
import './index.scss';
import './styles/theme-toggle-global.scss';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeContext.jsx';
import { applyBackendConfig } from './services/api/axios';
import { initSocket } from './services/socket/socket';

const backendOrigin = 'http://localhost:5001';

applyBackendConfig(`${backendOrigin}/api/`);
initSocket(backendOrigin);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);