import 'styles/globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from '../components/auth/LogoutButton';
import { isAllowedAdmin, SESSION_COOKIE_NAME, verifySessionToken } from '../lib/auth';

export const metadata = { title: 'WEND Admin Panel' };

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;
  const isAuthenticated = isAllowedAdmin(payload);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen" suppressHydrationWarning>
        {isAuthenticated ? (
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-3">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-sm font-semibold tracking-wide text-gray-900">
                  WEND Admin
                </Link>
                <nav className="hidden sm:flex items-center gap-5">
                  <Link href="/projects" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Projects
                  </Link>
                  <Link href="/portfolios" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Portfolios
                  </Link>
                  <Link href="/contacts" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Contacts
                  </Link>
                </nav>
              </div>
              <LogoutButton />
            </div>
          </header>
        ) : null}
        <main>{children}</main>
      </body>
    </html>
  );
}