import Link from 'next/link';
import ProjectTable from '../../components/projects/ProjectTable';
import { requireAdmin } from '../../lib/requireAdmin';

export default async function ProjectsPage() {
  await requireAdmin('/projects');

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">All your design projects in one place.</p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          + Add Project
        </Link>
      </div>
      <ProjectTable />
    </div>
  );
}