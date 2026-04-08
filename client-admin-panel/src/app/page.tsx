import Link from 'next/link';
import { requireAdmin } from '../lib/requireAdmin';

const cards = [
  {
    href: '/projects',
    label: 'Projects',
    description: 'Add, edit and delete individual design projects with images and categories.',
    icon: '🏛',
    action: 'Manage Projects',
    addHref: '/projects/new',
  },
  {
    href: '/portfolios',
    label: 'Portfolios',
    description: 'Group projects into portfolio collections to showcase on your website.',
    icon: '🗂',
    action: 'Manage Portfolios',
    addHref: '/portfolios/new',
  },
  {
    href: '/contacts',
    label: 'Contacts',
    description: 'Review and manage contact form enquiries submitted through the website.',
    icon: '✉️',
    action: 'View Messages',
    addHref: '/contacts',
  },
];

export default async function AdminDashboard() {
  await requireAdmin('/');

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your projects and portfolio collections from here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4"
          >
            <div className="text-3xl">{card.icon}</div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{card.label}</h2>
              <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <Link
                href={card.addHref}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                + Add New
              </Link>
              <Link
                href={card.href}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {card.action}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}