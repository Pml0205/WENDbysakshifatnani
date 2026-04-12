const defaultAllowedOrigins = [
  'https://www.wendbysakshifatnani.in',
  'https://wendbysakshifatnani.in',
  'http://localhost:5173',
  'http://localhost:3000',
];

const configuredOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedOrigins;

const resolveAllowedOrigin = (request?: Request) => {
  const requestOrigin = request?.headers.get('origin')?.trim();
  const wildcardEnabled = allowedOrigins.includes('*');

  if (wildcardEnabled && requestOrigin) {
    return requestOrigin;
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0];
};

export const getCorsHeaders = (request?: Request) => ({
  'Access-Control-Allow-Origin': resolveAllowedOrigin(request),
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  Vary: 'Origin',
});

export const createCorsPreflightResponse = (request?: Request) =>
  new Response(null, { status: 204, headers: getCorsHeaders(request) });
