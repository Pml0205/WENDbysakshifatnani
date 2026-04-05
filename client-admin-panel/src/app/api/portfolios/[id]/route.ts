import { NextResponse } from 'next/server';
import { portfoliosDb } from '../../../../lib/db';
import { createCorsPreflightResponse, getCorsHeaders } from '../../../../lib/cors';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return createCorsPreflightResponse();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const portfolio = await portfoliosDb.getById(id);
  if (!portfolio) {
    return NextResponse.json({ message: 'Portfolio not found.' }, { status: 404, headers: getCorsHeaders() });
  }
  return NextResponse.json(portfolio, { headers: getCorsHeaders() });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      images?: string[];
    };

    const portfolio = await portfoliosDb.update(id, {
      title: body.title?.trim(),
      description: body.description?.trim(),
      images: Array.isArray(body.images) ? body.images : undefined,
    });

    if (!portfolio) {
      return NextResponse.json({ message: 'Portfolio not found.' }, { status: 404, headers: getCorsHeaders() });
    }

    return NextResponse.json(portfolio, { headers: getCorsHeaders() });
  } catch {
    return NextResponse.json(
      { message: 'Failed to update portfolio.' },
      { status: 500, headers: getCorsHeaders() },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await portfoliosDb.delete(id);
  if (!deleted) {
    return NextResponse.json({ message: 'Portfolio not found.' }, { status: 404, headers: getCorsHeaders() });
  }
  return new Response(null, { status: 204, headers: getCorsHeaders() });
}
