"use client";

import { usePathname, useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/auth/logout` : '/api/auth/logout';
    console.log('Logout endpoint:', endpoint);
    await fetch(endpoint, { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
    >
      Logout
    </button>
  );
};

export default LogoutButton;