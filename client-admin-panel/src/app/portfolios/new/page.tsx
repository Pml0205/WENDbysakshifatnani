import Link from 'next/link';
import PortfolioForm from '../../../components/portfolios/PortfolioForm';
import { requireAdmin } from '../../../lib/requireAdmin';

export default async function NewPortfolioPage() {
  await requireAdmin('/portfolios/new');

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <Link href="/portfolios" className="text-sm text-gray-500 hover:text-gray-900">← Back to Portfolios</Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Create New Portfolio</h1>
      </div>
      <PortfolioForm />
    </div>
  );
}