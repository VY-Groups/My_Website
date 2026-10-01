import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { handleSendEmail } from './api/send-email-handler.js';
import { handleGetResources } from './api/resources-handler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
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
