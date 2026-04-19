import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);

  if (!org) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href="/orgs" className="hover:text-[var(--text-secondary)]">
          ← organizações
        </Link>
      </nav>
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          {org.slug}
        </span>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {org.name}
        </h1>
      </header>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 text-sm text-[var(--text-secondary)]">
        Clientes, contratos e dashboard chegam nas próximas stories (3.x em diante).
      </section>
    </main>
  );
}
