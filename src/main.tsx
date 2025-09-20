import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { logger } from '@/services/logger.service';
import App from './App.tsx';
// Infrastructure test deployment

// Setup global error handler
window.addEventListener('error', (event) => {
  logger.error('Uncaught error', event.error, {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  const error = new Error('Failed to find root element');
  logger.error('Bootstrap error', error);
  throw error;
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// Force deployment Wed Aug 27 16:54:06 EDT 2025
