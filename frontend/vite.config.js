import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      // Recharts'ın aradığı ama bulamadığı yolu manuel eşliyoruz
      'react-is': 'react-is',
    },
  },
});
