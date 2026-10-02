import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Analytics from './components/Analytics'
import PWARegister from './components/PWARegister'
import './index.css'

// Vercel's /_vercel/* endpoints only exist when served by Vercel —
// skip them locally so the console stays clean (404 -> HTML fallback errors).
// Dynamic imports keep their code out of the critical first-paint bundle.
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
const VercelAnalytics = lazy(() =>
  import('@vercel/analytics/react').then((m) => ({ default: m.Analytics }))
)
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((m) => ({ default: m.SpeedInsights }))
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    {!isLocalHost && (
      <Suspense fallback={null}>
        <VercelAnalytics />
        <SpeedInsights />
      </Suspense>
    )}
    <PWARegister />
  </React.StrictMode>,
)
