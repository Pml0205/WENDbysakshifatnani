
const defaultAllowedOrigins = [
  'https://www.wendbysakshifatnani.in',
  'https://wendbysakshifatnani.in',
  'http://localhost:5173',
  'http://localhost:3000',
];

const runtimeProcess = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process;

const configuredOrigins = (runtimeProcess?.env?.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin: string) => origin.trim())
  .filter(Boolean);

// Do not allow "*" as a valid origin.
const allowedOrigins = (
  configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedOrigins
).filter((origin) => origin !== '*');

export const getCorsHeaders = (request?: Request) => {
  const requestOrigin = request?.headers.get('origin')?.trim();

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin;
  }

  return headers;
};

export const createCorsPreflightResponse = (request?: Request) => {
  const headers = getCorsHeaders(request);
  const requestOrigin = request?.headers.get('origin')?.trim();

  // Reject preflight requests from unapproved origins.
  if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
    return new Response(null, { status: 403, headers });
  }

  return new Response(null, { status: 204, headers });
};
