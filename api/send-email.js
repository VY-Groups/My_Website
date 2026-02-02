import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { name, email, message, type, companyName, requestType, briefDetail, services, budget } = body;

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

    await transporter.sendMail(mailContent);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
}
