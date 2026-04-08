import Link from 'next/link';
import ProjectForm from '../../../components/projects/ProjectForm';
import { requireAdmin } from '../../../lib/requireAdmin';

export default async function NewProjectPage() {
  await requireAdmin('/projects/new');

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <Link href="/projects" className="text-sm text-gray-500 hover:text-gray-900">← Back to Projects</Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Add New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}