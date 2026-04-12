declare module '@sendgrid/mail' {
  export type MailDataRequired = {
    to: string | string[];
    from: string | { email: string; name?: string };
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string | { email: string; name?: string };
  };

  export type ClientResponse = {
    statusCode: number;
    headers?: Record<string, string>;
    body?: unknown;
  };

  export interface SendGridMail {
    setApiKey(apiKey: string): void;
    send(data: MailDataRequired): Promise<[ClientResponse, unknown]>;
  }

  const sgMail: SendGridMail;
  export default sgMail;
}
