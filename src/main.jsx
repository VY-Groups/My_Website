import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import App from './App.jsx'
import Analytics from './components/Analytics'
import PWARegister from './components/PWARegister'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <VercelAnalytics />
    <SpeedInsights />
    <PWARegister />
  </React.StrictMode>,
)
