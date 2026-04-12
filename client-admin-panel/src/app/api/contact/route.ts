import { NextResponse } from 'next/server';
import { connectDB, contactsDb } from 'lib/db';
import { createCorsPreflightResponse, getCorsHeaders } from '../../../lib/cors';
import { sendContactNotificationEmail } from '../../../lib/mailer';

export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
  return createCorsPreflightResponse(request);
}

const getPagination = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '20');
  const safePage = Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : 20;
  const skip = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, skip };
};

export async function GET(request: Request) {
  try {
    const { page, limit, skip } = getPagination(request);
    console.info('[api/contact] GET', { page, limit });
    await connectDB();
    const contacts = await contactsDb.getAll({ limit, skip });
    return NextResponse.json(contacts, { headers: getCorsHeaders(request) });
  } catch (error) {
    console.error('Failed to fetch contact messages:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch contact messages.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: getCorsHeaders(request) },
    );
  }
}

export async function POST(request: Request) {
  try {
    console.info('[api/contact] POST');
    await connectDB();
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      location?: string;
      service?: string;
      message?: string;
      skipEmailNotification?: boolean;
    };

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const location = body.location?.trim() ?? '';
    const service = body.service?.trim() ?? '';
    const message = body.message?.trim() ?? '';
    const skipEmailNotification = body.skipEmailNotification === true;

    console.info('[api/contact] payload parsed', {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasService: Boolean(service),
      hasMessage: Boolean(message),
      skipEmailNotification,
    });

    if (!name) {
      return NextResponse.json({ message: 'Name is required.' }, { status: 400, headers: getCorsHeaders(request) });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'A valid email is required.' },
        { status: 400, headers: getCorsHeaders(request) },
      );
    }

    if (!message) {
      return NextResponse.json({ message: 'Message is required.' }, { status: 400, headers: getCorsHeaders(request) });
    }

    if (!service) {
      return NextResponse.json(
        { message: 'Service selection is required.' },
        { status: 400, headers: getCorsHeaders(request) },
      );
    }

    const contact = await contactsDb.create({ name, email, location, service, message });

    console.info('[api/contact] contact saved', { contactId: contact.id ?? null });

    if (!skipEmailNotification) {
      try {
        await sendContactNotificationEmail({ name, email, location, service, message });
        console.info('[api/contact] email notification sent successfully');
      } catch (mailError) {
        const errorMessage = mailError instanceof Error ? mailError.message : 'Unknown error';
        console.error('[api/contact] Failed to send contact notification email', {
          message: errorMessage,
          error: mailError,
        });

        return Response.json(
          {
            success: false,
            message: 'Contact saved but email delivery failed.',
            detail: errorMessage,
            contact,
          },
          { status: 502, headers: getCorsHeaders(request) },
        );
      }
    } else {
      console.info('[api/contact] email notification skipped by request');
    }

    return Response.json({ success: true, ...contact }, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return Response.json(
      { message: 'Failed to submit contact form.' },
      { status: 500, headers: getCorsHeaders(request) },
    );
  }
}
