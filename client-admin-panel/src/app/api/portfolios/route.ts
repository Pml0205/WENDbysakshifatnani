import { NextResponse } from 'next/server';
import { portfoliosDb } from '../../../lib/db';
import { createCorsPreflightResponse, getCorsHeaders } from '../../../lib/cors';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return createCorsPreflightResponse();
}

export async function GET() {
  try {
    const portfolios = await portfoliosDb.getAll();
    return NextResponse.json(portfolios, { headers: getCorsHeaders() });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch portfolios.' },
      { status: 500, headers: getCorsHeaders() },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      images?: string[];
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ message: 'Title is required.' }, { status: 400, headers: getCorsHeaders() });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ message: 'Description is required.' }, { status: 400, headers: getCorsHeaders() });
    }

    const portfolio = await portfoliosDb.create({
      title: body.title.trim(),
      description: body.description.trim(),
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json(portfolio, { status: 201, headers: getCorsHeaders() });
  } catch {
    return NextResponse.json(
      { message: 'Failed to create portfolio.' },
      { status: 500, headers: getCorsHeaders() },
    );
  }
}
