import express from 'express';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000
});

// API Routes - MUST be before Vite middleware
app.post('/api/send-email', async (req, res) => {
  try {
    const body = req.body;
    const { name, email, message, type, companyName, requestType, briefDetail, services, budget } = body;

    console.log('Received request type:', type);
    console.log('Request body:', body);

    // Validate based on request type
    if (type === 'collaboration') {
      if (!companyName || companyName.trim() === '' ||
          !name || name.trim() === '' ||
          !email || email.trim() === '' ||
          !briefDetail || briefDetail.trim() === '' ||
          !requestType || requestType.trim() === '' ||
          !services || !Array.isArray(services) || services.length === 0) {
        console.log('Validation failed for collaboration request');
        return res.status(400).json({ error: 'All fields are required' });
      }
    } else {
      // Standard contact form
      if (!name || name.trim() === '' ||
          !email || email.trim() === '' ||
          !message || message.trim() === '') {
        console.log('Validation failed for contact form');
        return res.status(400).json({ error: 'All fields are required' });
      }
    }

    let mailContent;

    if (type === 'collaboration') {
      // Collaboration request email
      const servicesList = Array.isArray(services) ? services.join('</li><li>') : '';
      
      mailContent = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New Collaboration Request from ${name} (${companyName})`,
        html: `
          <h2>New Collaboration Request</h2>
          <hr>
          <p><strong>Request Type:</strong> ${requestType}</p>
          <p><strong>Company Name:</strong> ${companyName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Brief Details:</strong></p>
          <p>${briefDetail.replace(/\n/g, '<br>')}</p>
          <p><strong>Services Interested In:</strong></p>
          <ul>
            <li>${servicesList}</li>
          </ul>
          ${budget && budget.trim() !== '' ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
          <hr>
          <p><em>This is a collaboration request from your portfolio website.</em></p>
        `
      };
    } else {
      // Standard contact form email
      mailContent = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };
    }

    console.log('Sending email...');
    await transporter.sendMail(mailContent);
    console.log('Email sent successfully');

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

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
