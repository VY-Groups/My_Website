import nodemailer from 'nodemailer';

// Create transporter with Gmail credentials
const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error('Gmail credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const body = req.body;
    const { name, email, message, type, companyName, requestType, briefDetail, services, preferredTech, budget } = body;

    // Validate based on request type
    if (type === 'collaboration') {
      if (!companyName || companyName.trim() === '' ||
          !name || name.trim() === '' ||
          !email || email.trim() === '' ||
          !briefDetail || briefDetail.trim() === '' ||
          !requestType || requestType.trim() === '' ||
          !services || !Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ error: 'All fields are required' });
      }
    } else {
      // Standard contact form
      if (!name || name.trim() === '' ||
          !email || email.trim() === '' ||
          !message || message.trim() === '') {
        return res.status(400).json({ error: 'All fields are required' });
      }
    }

    let mailContent;

    if (type === 'collaboration') {
      // Collaboration request email
      const servicesList = Array.isArray(services) ? services.join('</li><li>') : '';
      const techList = Array.isArray(preferredTech) ? preferredTech.join(', ') : 'Not specified';
      
      mailContent = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `New Collaboration Request from ${name} (${companyName})`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #0071e3;">New Collaboration Request</h2>
            <hr style="border: none; border-top: 1px solid #eee;">
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Request Type:</strong> ${requestType}</p>
              <p><strong>Company Name:</strong> ${companyName}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
            </div>

            <p><strong>Services Interested In:</strong></p>
            <ul style="background: #f9f9f9; padding: 15px 30px; border-radius: 5px;">
              <li>${servicesList}</li>
            </ul>

            <p><strong>Preferred Technologies:</strong> ${techList}</p>

            <p><strong>Brief Details:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 3px solid #0071e3; border-radius: 3px;">
              <p>${briefDetail.replace(/\n/g, '<br>')}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is a collaboration request from your portfolio website.
              <br>
              <a href="https://my-website-one-zeta-56.vercel.app" style="color: #0071e3; text-decoration: none;">View Portfolio</a>
            </p>
          </div>
        `
      };
    } else {
      // Standard contact form email
      mailContent = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `New message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #0071e3;">New Contact Form Submission</h2>
            <hr style="border: none; border-top: 1px solid #eee;">
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 3px solid #0071e3; border-radius: 3px;">
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This message came from your portfolio website.
              <br>
              <a href="https://my-website-one-zeta-56.vercel.app" style="color: #0071e3; text-decoration: none;">View Portfolio</a>
            </p>
          </div>
        `
      };
    }

    await transporter.sendMail(mailContent);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message,
      code: error.code 
    });
