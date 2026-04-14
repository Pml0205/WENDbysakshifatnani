import emailjs from '@emailjs/browser';

export interface WebsiteProject {
  id: string;
  title: string;
  description: string;
  location?: string;
  category?: string;
  images: string[];
  modelSrc?: string;
  iosSrc?: string;
  arModelSrc?: string;
  arIosSrc?: string;
  glbModel?: string;
  usdzModel?: string;
  createdAt?: string;
}

export interface WebsitePortfolio {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt?: string;
}

type AppImportMetaEnv = {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
};

const appImportMeta = import.meta as ImportMeta & { env?: AppImportMetaEnv };
const appEnv = appImportMeta?.env ?? {};

const DEFAULT_PROD_API_BASE_URL = 'https://api.wendbysakshifatnani.in';
const LOCAL_API_BASE_URL = 'http://localhost:3000';

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, '') ?? '';

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = normalizeBaseUrl(appEnv.VITE_API_BASE_URL);
  if (configuredBaseUrl) {
    console.log("Using configured API base URL:", configuredBaseUrl);
    return configuredBaseUrl;
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      console.log("Using local API base URL:", LOCAL_API_BASE_URL);
      return LOCAL_API_BASE_URL;
    }
  }

  console.log("Using default production API base URL:", DEFAULT_PROD_API_BASE_URL);
  return DEFAULT_PROD_API_BASE_URL;
};

const API_BASE_URL = resolveApiBaseUrl();
const EMAILJS_SERVICE_ID = appEnv.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = appEnv.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = appEnv.VITE_EMAILJS_PUBLIC_KEY;

const hasEmailJsConfig = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const parseJsonSafely = <T>(raw: string, fallbackMessage: string): T => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(fallbackMessage);
  }
};

const isHtmlPayload = (raw: string) => {
  const trimmed = raw.trimStart();
  return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<');
};

const ensureJsonResponse = async <T>(response: Response, endpoint: string): Promise<T> => {
  const raw = await response.text();

  if (!raw) {
    throw new Error(`Empty response from ${endpoint}.`);
  }

  if (isHtmlPayload(raw)) {
    throw new Error(
      `Received HTML instead of JSON from ${endpoint}. Verify VITE_API_BASE_URL points to the backend (${DEFAULT_PROD_API_BASE_URL}).`,
    );
  }

  return parseJsonSafely<T>(raw, `Invalid JSON response from ${endpoint}.`);
};

const parseError = async (response: Response) => {
  const fallback = `Request failed with status ${response.status}`;
  try {
    const payload = await ensureJsonResponse<{ message?: string }>(response, response.url || 'API endpoint');
    return payload.message ?? fallback;
  } catch {
    return fallback;
  }
};

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

const toAbsoluteMediaUrl = (url: string) => {
  if (!url) {
    return url;
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export const fetchProjects = async (): Promise<WebsiteProject[]> => {
  const endpoint = buildApiUrl('/api/projects');
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const projects = await ensureJsonResponse<WebsiteProject[]>(response, endpoint);
  return projects.map((project) => ({
    ...project,
    images: Array.isArray(project.images) ? project.images.map(toAbsoluteMediaUrl) : [],
  }));
};

export const fetchPortfolios = async (): Promise<WebsitePortfolio[]> => {
  const endpoint = buildApiUrl('/api/portfolios');
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const portfolios = await ensureJsonResponse<WebsitePortfolio[]>(response, endpoint);
  return portfolios.map((portfolio) => ({
    ...portfolio,
    images: Array.isArray(portfolio.images) ? portfolio.images.map(toAbsoluteMediaUrl) : [],
  }));
};

export const submitContactForm = async (payload: {
  name: string;
  email: string;
  location?: string;
  service: string;
  message: string;
}): Promise<{ warning?: string }> => {
  let sentViaEmailJs = false;

  if (hasEmailJsConfig) {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID!,
        EMAILJS_TEMPLATE_ID!,
        {
          name: payload.name,
          email: payload.email,
          location: payload.location,
          service: payload.service,
          message: payload.message,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY!,
        },
      );
      sentViaEmailJs = true;
    } catch {
      throw new Error('Failed to send message via EmailJS. Please check your EmailJS settings and try again.');
    }
  }

  const endpoint = buildApiUrl('/api/contact');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      skipEmailNotification: sentViaEmailJs,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return ensureJsonResponse<{ warning?: string }>(response, endpoint);
};
