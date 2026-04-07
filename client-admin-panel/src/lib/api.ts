import { ContactMessage, Portfolio, Project } from '../types';

// When NEXT_PUBLIC_API_URL is not set, requests stay same-origin.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const request = async <T>(path: string, method: HttpMethod, body?: unknown): Promise<T> => {
  const endpoint = `${API_BASE_URL}${path}`;

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const fetchProjects = async (): Promise<Project[]> => request<Project[]>('/api/projects', 'GET');

export const getProjectById = async (id: string): Promise<Project> =>
  request<Project>(`/api/projects/${id}`, 'GET');

export const createProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Project> => request<Project>('/api/projects', 'POST', project);

export const updateProject = async (project: Project): Promise<Project> => {
  if (!project.id) {
    throw new Error('Project id is required for update.');
  }

  return request<Project>(`/api/projects/${project.id}`, 'PUT', project);
};

export const deleteProject = async (id: string): Promise<void> => {
  await request<void>(`/api/projects/${id}`, 'DELETE');
};

export const fetchPortfolios = async (): Promise<Portfolio[]> =>
  request<Portfolio[]>('/api/portfolios', 'GET');

export const getPortfolioById = async (id: string): Promise<Portfolio> =>
  request<Portfolio>(`/api/portfolios/${id}`, 'GET');

export const createPortfolio = async (
  portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Portfolio> => request<Portfolio>('/api/portfolios', 'POST', portfolio);

export const updatePortfolio = async (id: string, portfolio: Portfolio): Promise<Portfolio> =>
  request<Portfolio>(`/api/portfolios/${id}`, 'PUT', portfolio);

export const deletePortfolio = async (id: string): Promise<void> => {
  await request<void>(`/api/portfolios/${id}`, 'DELETE');
};

export const uploadImage = async (file: File): Promise<string> => {
  const urls = await uploadImages([file]);
  const first = urls[0];
  if (!first) {
    throw new Error('Upload failed.');
  }

  return first;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Upload failed.');
  }

  const data = (await response.json()) as { url?: string; urls?: string[] };
  if (Array.isArray(data.urls) && data.urls.length > 0) {
    return data.urls;
  }

  if (data.url) {
    return [data.url];
  }

  throw new Error('Upload failed.');
};

export const fetchContactMessages = async (): Promise<ContactMessage[]> =>
  request<ContactMessage[]>('/api/contact', 'GET');

export const deleteContactMessage = async (id: string): Promise<void> => {
  await request<void>(`/api/contact/${id}`, 'DELETE');
};