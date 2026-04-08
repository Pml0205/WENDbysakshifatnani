import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  receiver: string;
};

const parseDisplayName = (value: string | undefined) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return 'WEND Contact';
  }

  const emailMatch = trimmed.match(/<([^>]+)>/);
  if (emailMatch) {
    const name = trimmed.replace(/<[^>]+>/, '').trim().replace(/^"|"$/g, '');
    return name || 'WEND Contact';
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'WEND Contact';
  }

  return trimmed;
};

const readMailConfig = (): MailConfig => {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL?.trim();
  const fromName = parseDisplayName(process.env.SMTP_FROM_EMAIL);

  if (!host || !portRaw || !user || !pass || !receiver) {
    throw new Error(
      'Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL, and optionally SMTP_FROM_EMAIL for the display name.',
    );
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('SMTP_PORT must be a valid positive number.');
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    fromName,
    receiver,
  };
};

let cachedTransporter: nodemailer.Transporter | null = null;

const createTransport = (config: MailConfig, port: number, secure: boolean) => {
  const transportOptions: SMTPTransport.Options & { family?: 4 | 6 } = {
    host: config.host,
    port,
    secure,
    requireTLS: port === 587,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    dnsTimeout: 10000,
    family: 4,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  };

  return nodemailer.createTransport(transportOptions);
};

const getTransporter = (config: MailConfig) => {
  if (!cachedTransporter) {
    cachedTransporter = createTransport(config, config.port, config.secure);
  }

  return cachedTransporter;
};

const sendWithFallback = async (
  config: MailConfig,
  mailOptions: nodemailer.SendMailOptions,
) => {
  try {
    const primary = getTransporter(config);
    return await primary.sendMail(mailOptions);
  } catch (primaryError) {
    const message = primaryError instanceof Error ? primaryError.message : String(primaryError);
    const isTimeout = /timeout|timed out/i.test(message);
    const canFallback = config.host === 'smtp.gmail.com' && config.port === 587;

    if (!isTimeout || !canFallback) {
      throw primaryError;
    }

    const fallbackTransporter = createTransport(config, 465, true);
    return fallbackTransporter.sendMail(mailOptions);
  }
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

  await sendWithFallback(config, {
    from: {
      name: config.fromName,
      address: config.user,
    },
    to: config.receiver,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
};
