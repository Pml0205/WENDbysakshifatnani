import sgMail from '@sendgrid/mail';

type SendGridConfig = {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  receiver: string;
};

let sendGridClientInitialized = false;

const parseDisplayName = (value: string | undefined) => {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return 'WEND Contact';
  }

  return trimmed;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

  if (!EMAIL_REGEX.test(senderEmail)) {
    throw new Error('SENDGRID_SENDER_EMAIL must be a valid email address.');
  }

  if (!EMAIL_REGEX.test(receiver)) {
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

  if (!payload.name.trim()) {
    throw new Error('Contact name is required for email notification.');
  }

  if (!EMAIL_REGEX.test(payload.email.trim())) {
    throw new Error('Contact email is invalid for replyTo.');
  }

  if (!payload.service.trim() || !payload.message.trim()) {
    throw new Error('Service and message are required for email notification.');
  }

  if (!sendGridClientInitialized) {
    sgMail.setApiKey(config.apiKey);
    sendGridClientInitialized = true;
  }

  console.info('[email] SendGrid config loaded', {
    hasApiKey: Boolean(config.apiKey),
    senderEmail: config.senderEmail,
    receiverEmail: config.receiver,
  });

  if (config.senderEmail.toLowerCase() === config.receiver.toLowerCase()) {
    console.warn(
      '[email] sender and receiver are identical; this can increase spam filtering risk. Consider using a domain sender identity.',
    );
  }

  const subject = `New Contact Form - ${payload.name.trim()}`;
  const text = [
    'You received a new contact form submission.',
    '',
    `Name: ${payload.name.trim()}`,
    `Email: ${payload.email.trim()}`,
    `Location: ${(payload.location || '').trim() || 'Not provided'}`,
    `Service: ${payload.service.trim()}`,
    '',
    'Message:',
    payload.message.trim(),
  ].join('\n');

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name.trim())}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email.trim())}</p>
    <p><strong>Location:</strong> ${escapeHtml((payload.location || '').trim() || 'Not provided')}</p>
    <p><strong>Service:</strong> ${escapeHtml(payload.service.trim())}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>')}</p>
  `;

  const msg = {
    to: config.receiver,
    from: {
      email: config.senderEmail,
      name: config.senderName,
    },
    replyTo: payload.email.trim(),
    subject,
    text,
    html,
  };

  console.info('[email] sending contact notification via SendGrid');

  try {
    const [response] = await sgMail.send(msg);
    console.info('[email] SendGrid accepted message', {
      statusCode: response.statusCode,
      messageId: response.headers?.['x-message-id'] || null,
    });
  } catch (error) {
    const sendGridError = error as Error & {
      response?: {
        body?: unknown;
        headers?: Record<string, string>;
        statusCode?: number;
      };
      code?: string;
    };

    console.error('[email] SendGrid send failed', {
      message: sendGridError.message,
      code: sendGridError.code,
      statusCode: sendGridError.response?.statusCode,
      responseBody: sendGridError.response?.body,
    });

    throw new Error(
      `SendGrid send failed: ${sendGridError.message}`,
    );
  }
};
