import React, { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import './InstallPrompt.css';

/**
 * PWA Install Button
 * - Captures beforeinstallprompt event
 * - Shows floating install button
 * - Dismissible (remembers choice in sessionStorage)
 * - Hidden if already installed (standalone mode)
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // User dismissed before?
    if (sessionStorage.getItem('install-dismissed')) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('install-dismissed', '1');
  };

  if (!visible || installed) return null;

  return (
    <div className="install-prompt" role="alertdialog" aria-label="Install app">
      <button className="install-btn" onClick={handleInstall}>
        <FiDownload size={16} />
        <span>Install App</span>
      </button>
      <button className="install-dismiss" onClick={handleDismiss} aria-label="Dismiss install prompt">
        <FiX size={14} />
      </button>
    </div>
  );
}