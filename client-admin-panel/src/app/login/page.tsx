"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/auth/login` : '/api/auth/login';
      console.log('Login endpoint:', endpoint);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message || 'Login failed.');
        setIsSubmitting(false);
        return;
      }

      const nextParam =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('next') || '/'
          : '/';

      router.replace(nextParam);
      router.refresh();
    } catch {
      setError('Unable to login right now. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600">Only authorized client accounts can access this panel.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;