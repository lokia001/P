// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/nominatim': {
    //     target: 'https://nominatim.openstreetmap.org',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/nominatim/, ''),
    //   },
    // },
  },
});