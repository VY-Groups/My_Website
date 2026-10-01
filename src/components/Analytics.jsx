import React, { useEffect } from 'react';

/**
 * Privacy-Friendly Analytics Component
 * Supports: Plausible, Umami, Google Analytics (GA4)
 * All config via environment variables
 */

const ANALYTICS_CONFIG = {
  // Plausible Analytics (privacy-first, lightweight)
  plausible: {
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || '',
    apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
    enabled: !!import.meta.env.VITE_PLAUSIBLE_DOMAIN,
  },
  // Umami Analytics (self-hosted or cloud, privacy-friendly)
  umami: {
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || '',
    scriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js',
    enabled: !!import.meta.env.VITE_UMAMI_WEBSITE_ID,
  },
  // Google Analytics 4
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
    enabled: !!import.meta.env.VITE_GA4_MEASUREMENT_ID,
  },
};

// Track page views for SPA navigation
export function trackPageView(path, title) {
  // Plausible
  if (ANALYTICS_CONFIG.plausible.enabled && window.plausible) {
    window.plausible('pageview', { u: path });
  }

  // Umami
  if (ANALYTICS_CONFIG.umami.enabled && window.umami) {
    window.umami.track('pageview', { url: path, title });
  }

  // GA4
  if (ANALYTICS_CONFIG.ga4.enabled && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

// Track custom events
export function trackEvent(eventName, properties = {}) {
  // Plausible
  if (ANALYTICS_CONFIG.plausible.enabled && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Umami
  if (ANALYTICS_CONFIG.umami.enabled && window.umami) {
    window.umami.track(eventName, properties);
  }

  // GA4
  if (ANALYTICS_CONFIG.ga4.enabled && window.gtag) {
    window.gtag('event', eventName, properties);
  }
}

// Track scroll depth
export function trackScrollDepth() {
  let maxDepth = 0;
  const thresholds = [25, 50, 75, 90, 100];
  const tracked = new Set();

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxDepth) {
      maxDepth = scrollPercent;
    }

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        trackEvent('scroll_depth', { depth: threshold, max_depth: maxDepth });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Track time on page
export function trackTimeOnPage() {
  const startTime = Date.now();
  const intervals = [10, 30, 60, 120, 300]; // seconds
  const tracked = new Set();

  const interval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    intervals.forEach(threshold => {
      if (elapsed >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        trackEvent('time_on_page', { seconds: threshold });
      }
    });
  }, 5000);

  return () => clearInterval(interval);
}

// Track clicks on external links
export function trackExternalLinks() {
  const handleClick = (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link && !link.href.includes(window.location.hostname)) {
      trackEvent('external_link_click', {
        url: link.href,
        text: link.innerText?.slice(0, 100),
      });
    }
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}

// Track form submissions
export function trackFormSubmissions() {
  const handleSubmit = (e) => {
    const form = e.target.closest('form');
    if (form) {
      const formId = form.id || form.className || 'unknown';
      trackEvent('form_submit', { form_id: formId });
    }
  };

  document.addEventListener('submit', handleSubmit);
  return () => document.removeEventListener('submit', handleSubmit);
}

// Track downloads
export function trackDownloads() {
  const handleClick = (e) => {
    const link = e.target.closest('a[download], a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"], a[href$=".xls"]');
    if (link) {
      trackEvent('file_download', {
        url: link.href,
        filename: link.href.split('/').pop(),
      });
    }
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}

export default function Analytics() {
  useEffect(() => {
    // Initialize Plausible
    if (ANALYTICS_CONFIG.plausible.enabled) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = ANALYTICS_CONFIG.plausible.domain;
      script.src = `${ANALYTICS_CONFIG.plausible.apiHost}/js/script.js`;
      document.head.appendChild(script);

      // Initialize plausible queue
      window.plausible = window.plausible || function(...args) {
        (window.plausible.q = window.plausible.q || []).push(args);
      };
    }

    // Initialize Umami
    if (ANALYTICS_CONFIG.umami.enabled) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.websiteId = ANALYTICS_CONFIG.umami.websiteId;
      script.src = ANALYTICS_CONFIG.umami.scriptUrl;
      document.head.appendChild(script);
    }

    // Initialize GA4
    if (ANALYTICS_CONFIG.ga4.enabled) {
      // Load gtag script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4.measurementId}`;
      document.head.appendChild(script1);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
        anonymize_ip: true,
        send_page_view: false, // We handle page views manually for SPA
      });
    }

    // Track initial page view
    trackPageView(window.location.pathname + window.location.hash, document.title);

    // Set up scroll tracking
    const cleanupScroll = trackScrollDepth();

    // Set up time tracking
    const cleanupTime = trackTimeOnPage();

    // Set up external link tracking
    const cleanupLinks = trackExternalLinks();

    // Set up form tracking
    const cleanupForms = trackFormSubmissions();

    // Set up download tracking
    const cleanupDownloads = trackDownloads();

    // Track SPA navigation via hash changes
    const handleHashChange = () => {
      trackPageView(window.location.pathname + window.location.hash, document.title);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      cleanupScroll();
      cleanupTime();
      cleanupLinks();
      cleanupForms();
      cleanupDownloads();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null; // This component doesn't render anything
}