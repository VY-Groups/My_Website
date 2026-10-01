/**
 * Email Templates (HTML)
 * Consistent, branded email templates for contact and collaboration forms
 */

const BRANDING = {
  name: 'Yash Kumar Dubey',
  role: 'DevOps Engineer & Cloud Architect',
  site: 'https://yashkumardubey.dev',
  color: '#0071e3',
  accent: '#00d4ff',
};

function layout({ title, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6ebff;">
          <tr>
            <td style="background:linear-gradient(135deg, ${BRANDING.color}, ${BRANDING.accent});padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${title}</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${BRANDING.name} · ${BRANDING.role}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background:#f8f9ff;padding:20px 32px;border-top:1px solid #e6ebff;">
              <p style="margin:0;color:#86868b;font-size:12px;text-align:center;">
                Sent from <a href="${BRANDING.site}" style="color:${BRANDING.color};text-decoration:none;">${BRANDING.site}</a> · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:8px 0;color:#86868b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;width:160px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;color:#0f172a;font-size:15px;line-height:1.6;">${value}</td>
  </tr>`;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function contactTemplate(data) {
  const content = `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">You received a new message through your portfolio contact form.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:12px;padding:8px 20px;border:1px solid #e6ebff;">
      ${row('Name', escapeHtml(data.name))}
      ${row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRANDING.color};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
      <tr><td colspan="2" style="border-top:1px solid #e6ebff;padding-top:16px;"></td></tr>
      ${row('Message', escapeHtml(data.message).replace(/\n/g, '<br>'))}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td align="center">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20your%20message" style="display:inline-block;background:linear-gradient(135deg, ${BRANDING.color}, ${BRANDING.accent});color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${escapeHtml(data.name?.split(' ')[0] || 'sender')}</a>
        </td>
      </tr>
    </table>`;

  return layout({ title: 'New Contact Form Submission', content });
}

export function collaborationTemplate(data) {
  const services = Array.isArray(data.services) ? data.services.map(escapeHtml).join(', ') : '';
  const tech = Array.isArray(data.preferredTech) ? data.preferredTech.map(escapeHtml).join(', ') : '';

  const content = `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">A new collaboration request was submitted through your portfolio.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:12px;padding:8px 20px;border:1px solid #e6ebff;">
      ${row('Company', escapeHtml(data.companyName))}
      ${row('Name', escapeHtml(data.name))}
      ${row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRANDING.color};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
      ${row('Request Type', escapeHtml(data.requestType))}
      ${row('Budget', escapeHtml(data.budget))}
      ${row('Services', services)}
      ${row('Preferred Tech', tech)}
      <tr><td colspan="2" style="border-top:1px solid #e6ebff;padding-top:16px;"></td></tr>
      ${row('Details', escapeHtml(data.briefDetail).replace(/\n/g, '<br>'))}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td align="center">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20collaboration%20request" style="display:inline-block;background:linear-gradient(135deg, ${BRANDING.color}, ${BRANDING.accent});color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${escapeHtml(data.name?.split(' ')[0] || 'requester')}</a>
        </td>
      </tr>
    </table>`;

  return layout({ title: 'New Collaboration Request', content });
}

export function autoReplyTemplate(data) {
  const content = `
    <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Hi ${escapeHtml(data.name?.split(' ')[0] || 'there')},</p>
    <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      Thanks for reaching out! I've received your message and will get back to you within 24–48 hours.
    </p>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      In the meantime, feel free to check out my
      <a href="${BRANDING.site}/#projects" style="color:${BRANDING.color};text-decoration:none;">projects</a>
      or download my
      <a href="${BRANDING.site}/Yash_Kumar_Dubey_Resume.pdf" style="color:${BRANDING.color};text-decoration:none;">resume</a>.
    </p>
    <hr style="border:none;border-top:1px solid #e6ebff;margin:24px 0;" />
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;"><strong>Your message:</strong></p>
    <p style="margin:8px 0 0;color:#64748b;font-size:14px;line-height:1.7;background:#f8f9ff;padding:16px;border-radius:8px;border-left:3px solid ${BRANDING.color};">${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`;

  return layout({ title: 'Thanks for reaching out!', content });
}