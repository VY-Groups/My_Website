import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API called with body:', Object.keys(req.body || {}));
    
    // Get credentials
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    
    console.log('Checking credentials:', {
      hasUser: !!gmailUser,
      hasPass: !!gmailPass
    });

    if (!gmailUser || !gmailPass) {
      console.error('Missing Gmail credentials');
      return res.status(500).json({
        error: 'Email service not configured',
        hasUser: !!gmailUser,
        hasPass: !!gmailPass
      });
    }

    // Create transport
    console.log('Creating nodemailer transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const body = req.body || {};
    const { name, email, message, type, companyName, requestType, briefDetail, services, preferredTech, budget } = body;

    // Validate input
    if (type === 'collaboration') {
      if (!companyName?.trim() || !name?.trim() || !email?.trim() || !briefDetail?.trim() || !requestType?.trim() || !services?.length) {
        return res.status(400).json({ error: 'Missing required fields for collaboration' });
      }
    } else {
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    }

    let mailContent;
    if (type === 'collaboration') {
      mailContent = {
        from: gmailUser,
        to: gmailUser,
        replyTo: email,
        subject: `Collaboration: ${companyName} - ${requestType}`,
        html: `
          <h2>New Collaboration Request</h2>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${requestType}</p>
          ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
          <p><strong>Services:</strong> ${(services || []).join(', ')}</p>
          <p><strong>Technologies:</strong> ${(preferredTech || []).join(', ')}</p>
          <p><strong>Details:</strong><br>${briefDetail?.replace(/\n/g, '<br>')}</p>
        `
      };
    } else {
      mailContent = {
        from: gmailUser,
        to: gmailUser,
        replyTo: email,
        subject: `Message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br>${message?.replace(/\n/g, '<br>')}</p>
        `
      };
    }

    console.log('Sending email...');
    await transporter.sendMail(mailContent);
    console.log('Email sent successfully');

    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
      type: error.name
    });
  }
}
