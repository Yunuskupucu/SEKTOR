import { createRoot } from 'react-dom/client';
import './index.scss';
import './styles/theme-toggle-global.scss';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { applyBackendConfig } from './lib/axios';
import { initSocket } from './lib/socket';

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