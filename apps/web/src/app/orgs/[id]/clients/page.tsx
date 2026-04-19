import { listClients } from '@apse/modules-clients/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClientsTable } from './table';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function ClientsPage({ params, searchParams }: Props) {
  await requireUser();
  const { id } = await params;
  const sp = await searchParams;

  const org = await getOrg(id);
  if (!org) notFound();

  const showArchived = sp.status === 'archived';
  const clients = await listClients({
    orgId: id,
    status: showArchived ? ['archived'] : ['active', 'inactive'],
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href="/orgs" className="hover:text-[var(--text-secondary)]">
          organizações
        </Link>{' '}
        ·{' '}
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · clientes
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
            {org.name}
          </span>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
            Clientes
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {clients.length} {showArchived ? 'arquivado(s)' : 'ativo(s)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/orgs/${id}/clients?status=${showArchived ? 'active' : 'archived'}`}
            className="h-9 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-default)] inline-flex items-center"
          >
            {showArchived ? 'Ver ativos' : 'Ver arquivados'}
          </Link>
          <Link
            href={`/orgs/${id}/clients/new`}
            className="h-9 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-xs font-medium text-[var(--surface-base)] transition hover:opacity-90 inline-flex items-center"
          >
            Novo cliente
          </Link>
        </div>
      </header>

      {clients.length === 0 ? (
        <EmptyState orgId={id} showArchived={showArchived} />
      ) : (
        <ClientsTable orgId={id} clients={clients} />
      )}
    </main>
  );
}

function EmptyState({ orgId, showArchived }: { orgId: string; showArchived: boolean }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] p-12 text-center">
      {showArchived ? (
        <>
          <StatusPill variant="draft" className="mb-4" />
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Nenhum cliente arquivado
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Quando você arquivar um cliente, ele aparece aqui.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Sem clientes cadastrados
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Cadastre o primeiro pra começar a rastrear contratos e receita.
          </p>
          <Link
            href={`/orgs/${orgId}/clients/new`}
            className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90"
          >
            Criar primeiro cliente
          </Link>
        </>
      )}
    </section>
  );
}
