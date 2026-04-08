import { NextResponse } from 'next/server';
import { sendContactNotificationEmail } from '../../../lib/mailer';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await sendContactNotificationEmail({
      name: 'SendGrid Test',
      email: 'test@example.com',
      service: 'Test',
      message: 'This is a test email to verify SendGrid API configuration.',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Test email sent successfully via SendGrid. Check your inbox.',
    });
  } catch (error) {
    console.error('SendGrid Test Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Ensure SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, and CONTACT_RECEIVER_EMAIL are set in environment variables.',
      },
      { status: 500 },
    );
  }
}
