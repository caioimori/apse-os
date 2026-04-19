import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClientForm } from './form';

export const dynamic = 'force-dynamic';

export default async function NewClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}/clients`} className="hover:text-[var(--text-secondary)]">
          ← Clientes
        </Link>
      </nav>

      <header className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          {org.name}
        </span>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Novo cliente
        </h1>
      </header>

      <ClientForm orgId={id} />
    </main>
  );
}
