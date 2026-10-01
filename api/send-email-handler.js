/**
 * Shared email sending logic for dev and prod servers
 * Combines validation, captcha, templates, and webhook notifications
 */

import nodemailer from 'nodemailer';
import { validateFormData } from './validation.js';
import { verifyHCaptcha } from './captcha.js';
import { notifyFormSubmission } from './notify.js';
import { contactTemplate, collaborationTemplate, autoReplyTemplate } from './templates.js';

// In-memory rate limiter (per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // 5 requests per window

export function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((record.start + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Periodic cleanup of stale rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.start > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref?.();

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Handles POST /api/send-email
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export async function handleSendEmail(req, res) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || 'unknown';

    // 1. Rate limiting
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfterSeconds: rate.retryAfterSeconds,
      });
    }

    const body = req.body || {};

    // 2. hCaptcha verification (optional)
    const captchaResult = await verifyHCaptcha(body.captchaToken);
    if (!captchaResult.success) {
      return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
    }

    // 3. Zod validation
    const validation = validateFormData(body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    const data = validation.data;
    const isCollab = data.type === 'collaboration';

    // 4. Build branded email
    const html = isCollab ? collaborationTemplate(data) : contactTemplate(data);
    const subject = isCollab
      ? `Collaboration: ${data.companyName} — ${data.requestType}`
      : `New message from ${data.name}`;

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: `"${data.name}" <${data.email}>`,
      subject,
      html,
    };

    // 5. Send notification email
    console.log(`Sending ${isCollab ? 'collaboration' : 'contact'} email...`);
    await transporter.sendMail(mailOptions);

    // 6. Send auto-reply to sender (best effort, non-blocking failure)
    if (process.env.ENABLE_AUTO_REPLY === 'true') {
      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: 'Thanks for reaching out — Yash Kumar Dubey',
        html: autoReplyTemplate(data),
      }).catch((err) => console.warn('Auto-reply failed:', err.message));
    }

    // 7. Webhook notifications (Slack/Discord) — fire and forget
    notifyFormSubmission({ type: data.type || 'contact', data, ip }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: isCollab ? 'Collaboration request sent successfully!' : 'Message sent successfully!',
      rateLimit: { remaining: rate.remaining },
    });
  } catch (error) {
    console.error('Email error:', error);
    const isConfigError = /credentials|auth|EAUTH|EENVELOPE/i.test(error.message || '');
    return res.status(500).json({
      error: isConfigError
        ? 'Email service is not configured. Please contact via LinkedIn/GitHub.'
        : 'Failed to send email. Please try again or contact me directly.',
    });
  }
}