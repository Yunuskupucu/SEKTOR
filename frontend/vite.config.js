import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Bazı CDN/host ortamlarında stylesheet + crossorigin CORS/cache yüzünden CSS yüklenmez (boş sayfa gibi görünür). */
function stripStylesheetCrossOrigin() {
  return {
    name: 'strip-stylesheet-crossorigin',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/<link\s+([^>]+)>/gi, (full, attrs) => {
          if (!/\brel\s*=\s*["']stylesheet["']/i.test(attrs)) return full;
          const cleaned = attrs
            .replace(/\s+crossorigin(?:=\s*["'][^"']*["'])?/gi, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
          return `<link ${cleaned}>`;
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), stripStylesheetCrossOrigin()],
  resolve: {
    alias: {
      'react-is': 'react-is',
    },
  },
});
