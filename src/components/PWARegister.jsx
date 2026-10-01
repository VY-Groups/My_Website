import { useEffect } from 'react';

/**
 * Registers the service worker for PWA support.
 * Only runs in production (Vite replaces import.meta.env.PROD).
 * Skips if browser doesn't support SW or user is on localhost in dev.
 */
export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // In dev, only register if explicitly enabled (avoids stale HMR caches)
    const isProd = import.meta.env.PROD;
    if (!isProd && !import.meta.env.VITE_ENABLE_SW_DEV) return;

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content available; refresh to update.');
              }
            });
          });
        })
        .catch((error) => {
          console.warn('SW registration failed:', error);
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }

    // Cleanup listener reference is unnecessary for one-time register
  }, []);

  return null;
}