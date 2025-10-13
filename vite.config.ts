import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      '.trycloudflare.com',
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'https://dev-lv.integra-explorer-platform.pages.dev',
        changeOrigin: true,
        secure: true
      },
      '/v1': {
        target: 'https://tx.trustwithintegra.com',
        changeOrigin: true
      }
    }
  }
});