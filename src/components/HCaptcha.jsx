import React, { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
const SCRIPT_ID = 'hcaptcha-script';

/**
 * hCaptcha widget component.
 * - No-ops (renders nothing) if VITE_HCAPTCHA_SITE_KEY is not set
 * - Loads hCaptcha script lazily on first render
 * - Calls onChange(token) with the captcha token (or null on expiry)
 */
export default function HCaptcha({ onChange }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // No site key configured → feature disabled, token stays null
  useEffect(() => {
    if (!SITE_KEY) return;

    const renderWidget = () => {
      if (!window.hcaptcha || !containerRef.current) return;
      try {
        widgetRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onChange?.(token),
          'expired-callback': () => onChange?.(null),
          'error-callback': () => {
            setError(true);
            onChange?.(null);
          },
          theme: document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light',
        });
        setLoaded(true);
      } catch {
        setError(true);
      }
    };

    if (document.getElementById(SCRIPT_ID)) {
      renderWidget();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&hl=en';
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, [onChange]);

  if (!SITE_KEY) return null; // feature not configured

  return (
    <div className="hcaptcha-wrapper">
      <div ref={containerRef} />
      {error && (
        <p className="hcaptcha-error" role="alert">
          Captcha failed to load. Please try again or contact me directly.
        </p>
      )}
      {!loaded && !error && <p className="hcaptcha-loading">Loading captcha…</p>}
    </div>
  );
}