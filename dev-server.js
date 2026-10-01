import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleSendEmail } from './api/send-email-handler.js';
import { handleGetResources } from './api/resources-handler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - MUST be before Vite middleware
app.post('/api/send-email', handleSendEmail);

// Student resources (CMS-backed with static fallback)
app.get('/api/resources', handleGetResources);

// Initialize Vite in middleware mode and add after API routes
let vite;
async function setupVite() {
  vite = await createViteServer({
    server: { middlewareMode: true }
  });
  
  // Use Vite middleware
  app.use(vite.middlewares);
  
  // SPA fallback - only for HTML requests
  app.use('*', async (req, res, next) => {
    // Skip API requests
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    try {
      const url = req.originalUrl;
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.message);
    }
  });
}

// Start server
async function start() {
  await setupVite();
  
  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`\n✓ Server running at http://localhost:${port}/`);
    console.log(`✓ API endpoint: http://localhost:${port}/api/send-email`);
  });
}

start().catch(console.error);
