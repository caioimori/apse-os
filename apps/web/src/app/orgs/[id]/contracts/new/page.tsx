import { listClients } from '@apse/modules-clients/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { NewContractForm } from './form';

export const dynamic = 'force-dynamic';

export default async function NewContractPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();

  const clients = await listClients({ orgId: id, status: ['active'] });
  if (clients.length === 0) {
    redirect(`/orgs/${id}/clients/new`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}/contracts`} className="hover:text-[var(--text-secondary)]">
          ← Contratos
        </Link>
      </nav>
      <header>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Novo contrato
        </h1>
      </header>
      <NewContractForm
        orgId={id}
        clients={clients.map((c) => ({ id: c.id, name: c.name, kind: c.kind }))}
      />
    </main>
  );
}
