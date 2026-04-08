import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAllowedAdmin, SESSION_COOKIE_NAME, verifySessionToken } from './auth';

export const requireAdmin = async (nextPath: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  if (!isAllowedAdmin(payload)) {
    const loginPath = nextPath && nextPath !== '/' ? `/login?next=${encodeURIComponent(nextPath)}` : '/login';
    redirect(loginPath);
  }
};
