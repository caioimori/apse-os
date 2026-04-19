import { formatDocument } from '@/lib/format-document';
import { getClient } from '@apse/modules-clients/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditClientForm } from './edit-form';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string; clientId: string }> };

export default async function ClientDetailPage({ params }: Props) {
  await requireUser();
  const { id, clientId } = await params;
  const [org, client] = await Promise.all([getOrg(id), getClient(clientId)]);
  if (!org || !client) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}/clients`} className="hover:text-[var(--text-secondary)]">
          ← Clientes
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
            {client.kind} · {org.name}
          </span>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
            {client.name}
          </h1>
          {client.document ? (
            <span className="font-mono text-sm text-[var(--text-secondary)]">
              {formatDocument(client.document)}
            </span>
          ) : null}
        </div>
        <StatusLabel status={client.status} />
      </header>

      <EditClientForm
        client={{
          id: client.id,
          email: client.email ?? '',
          phone: client.phone ?? '',
          notes: client.notes ?? '',
          status: client.status,
        }}
        orgId={id}
      />
    </main>
  );
}

function StatusLabel({ status }: { status: 'active' | 'inactive' | 'archived' }) {
  if (status === 'archived') return <StatusPill variant="draft" />;
  if (status === 'inactive') return <StatusPill variant="pending" />;
  return <StatusPill variant="paid" />;
}
