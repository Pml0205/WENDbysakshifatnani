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

const API_BASE_URL = (appEnv.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const EMAILJS_SERVICE_ID = appEnv.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = appEnv.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = appEnv.VITE_EMAILJS_PUBLIC_KEY;

const hasEmailJsConfig = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const parseError = async (response: Response) => {
  const fallback = `Request failed with status ${response.status}`;
  try {
    const payload = (await response.json()) as { message?: string };
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
  const response = await fetch(buildApiUrl('/api/projects'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const projects = (await response.json()) as WebsiteProject[];
  return projects.map((project) => ({
    ...project,
    images: Array.isArray(project.images) ? project.images.map(toAbsoluteMediaUrl) : [],
  }));
};

export const fetchPortfolios = async (): Promise<WebsitePortfolio[]> => {
  const response = await fetch(buildApiUrl('/api/portfolios'), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const portfolios = (await response.json()) as WebsitePortfolio[];
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

  const response = await fetch(buildApiUrl('/api/contact'), {
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

  return (await response.json()) as { warning?: string };
};
