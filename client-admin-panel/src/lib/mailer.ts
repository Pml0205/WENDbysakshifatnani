type SendGridConfig = {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  receiver: string;
};

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

const parseDisplayName = (value: string | undefined) => {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return 'WEND Contact';
  }

  return trimmed;
};

const readMailConfig = (): SendGridConfig => {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  const senderEmail = process.env.SENDGRID_SENDER_EMAIL?.trim();
  const senderName = parseDisplayName(process.env.SENDGRID_SENDER_NAME);
  const receiver = process.env.CONTACT_RECEIVER_EMAIL?.trim();

  if (!apiKey || !senderEmail || !receiver) {
    throw new Error(
      'Missing SendGrid configuration. Set SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, CONTACT_RECEIVER_EMAIL, and optionally SENDGRID_SENDER_NAME.',
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    throw new Error('SENDGRID_SENDER_EMAIL must be a valid email address.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiver)) {
    throw new Error('CONTACT_RECEIVER_EMAIL must be a valid email address.');
  }

  return {
    apiKey,
    senderEmail,
    senderName,
    receiver,
  };
};

export const sendContactNotificationEmail = async (payload: {
  name: string;
  email: string;
  location?: string;
  service: string;
  message: string;
}) => {
  const config = readMailConfig();

  const subject = `New Contact Enquiry: ${payload.service}`;
  const text = [
    'You received a new contact enquiry.',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Location: ${payload.location || 'Not provided'}`,
    `Service: ${payload.service}`,
    '',
    'Message:',
    payload.message,
  ].join('\n');

  const html = `
    <h2>New Contact Enquiry</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Location:</strong> ${payload.location || 'Not provided'}</p>
    <p><strong>Service:</strong> ${payload.service}</p>
    <p><strong>Message:</strong></p>
    <p>${payload.message.replace(/\n/g, '<br/>')}</p>
  `;

  const response = await fetch(SENDGRID_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: config.receiver }],
          subject: subject,
        },
      ],
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      reply_to: {
        email: payload.email,
        name: payload.name,
      },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[email] SendGrid API error:', errorText);
    throw new Error(
      `SendGrid API request failed (${response.status}): ${errorText || response.statusText}`,
    );
  }

  console.log('[email] contact notification sent successfully via SendGrid');
};
