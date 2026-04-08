import ContactTable from '../../components/contacts/ContactTable';
import { requireAdmin } from '../../lib/requireAdmin';

export default async function ContactsPage() {
  await requireAdmin('/contacts');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Contact Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Messages submitted from the website contact form.</p>
      </div>
      <ContactTable />
    </div>
  );
}
