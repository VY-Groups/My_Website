/**
 * Webhook Notifications for Slack and Discord
 * Triggers when contact/collaboration forms are submitted
 */

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function sendToSlack(payload) {
  if (!SLACK_WEBHOOK_URL) return;

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.warn('Slack webhook failed:', response.status);
    }
  } catch (error) {
    console.warn('Slack webhook error:', error.message);
  }
}

async function sendToDiscord(embed) {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.warn('Discord webhook failed:', response.status);
    }
  } catch (error) {
    console.warn('Discord webhook error:', error.message);
  }
}

export async function notifyFormSubmission({ type, data, ip }) {
  const isCollab = type === 'collaboration';
  const title = isCollab ? '🤝 New Collaboration Request' : '📧 New Contact Form Submission';
  const color = isCollab ? 0x0071e3 : 0x00d4ff;

  // Slack Block Kit message
  const slackPayload = {
    text: title,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: title },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${data.name}` },
          { type: 'mrkdwn', text: `*Email:*\n${data.email}` },
        ],
      },
      isCollab
        ? {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Company:*\n${data.companyName}` },
              { type: 'mrkdwn', text: `*Request Type:*\n${data.requestType}` },
            ],
          }
        : { type: 'section', text: { type: 'mrkdwn', text: `*Message:*\n${data.message?.slice(0, 300)}` } },
      isCollab
        ? {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Services:*\n${data.services?.join(', ')}${data.budget ? `\n*Budget:* ${data.budget}` : ''}`,
            },
          }
        : null,
      isCollab
        ? { type: 'section', text: { type: 'mrkdwn', text: `*Details:*\n${data.briefDetail?.slice(0, 500)}` } }
        : null,
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `🌐 IP: ${ip || 'unknown'} | ⏰ ${new Date().toISOString()}` }],
      },
    ].filter(Boolean),
  };

  // Discord embed
  const discordEmbed = {
    title,
    color,
    fields: [
      { name: 'Name', value: data.name, inline: true },
      { name: 'Email', value: data.email, inline: true },
      ...(isCollab
        ? [
            { name: 'Company', value: data.companyName, inline: true },
            { name: 'Request Type', value: data.requestType, inline: true },
            { name: 'Services', value: data.services?.join(', ') || '-', inline: false },
            ...(data.budget ? [{ name: 'Budget', value: data.budget, inline: true }] : []),
            { name: 'Details', value: data.briefDetail?.slice(0, 1000) || '-', inline: false },
          ]
        : [{ name: 'Message', value: data.message?.slice(0, 1000) || '-', inline: false }]),
    ],
    footer: { text: `IP: ${ip || 'unknown'}` },
    timestamp: new Date().toISOString(),
  };

  await Promise.allSettled([sendToSlack(slackPayload), sendToDiscord(discordEmbed)]);
}