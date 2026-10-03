import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import { handleSendEmail } from './api/send-email-handler.js';
import { handleGetResources } from './api/resources-handler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
// Mirror Vercel's edge compression so local runs match production transfer sizes
app.use(compression());
// Mirror vercel.json security headers so CSP can be tested locally
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://*.plausible.io https://cloud.umami.is https://*.umami.is https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://newassets.hcaptcha.com https://*.hcaptcha.com",
  "style-src 'self' 'unsafe-inline' https://newassets.hcaptcha.com",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.hcaptcha.com",
  "connect-src 'self' https://plausible.io https://*.plausible.io https://*.umami.is https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://newassets.hcaptcha.com https://api.hcaptcha.com https://*.hcaptcha.com",
  "frame-src https://newassets.hcaptcha.com https://*.hcaptcha.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - MUST be before static file serving
app.post('/api/send-email', handleSendEmail);

// Student resources (CMS-backed with static fallback)
app.get('/api/resources', handleGetResources);

// Serve static files from dist folder (React build output)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`\n✓ Server running at http://0.0.0.0:${port}/`);
  console.log(`✓ API endpoint: http://0.0.0.0:${port}/api/send-email`);
  console.log(`✓ Serving static files from: /dist`);
});
