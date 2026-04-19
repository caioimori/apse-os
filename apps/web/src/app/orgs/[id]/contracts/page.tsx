import { listClients } from '@apse/modules-clients/api';
import { listContracts } from '@apse/modules-contracts/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { Money } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContractsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();

  const [contracts, clients] = await Promise.all([
    listContracts(id),
    listClients({ orgId: id, status: ['active', 'inactive', 'archived'] }),
  ]);
  const clientById = new Map(clients.map((c) => [c.id, c]));

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · contratos
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
            {org.name}
          </span>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
            Contratos
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {contracts.length} {contracts.length === 1 ? 'contrato' : 'contratos'}
          </p>
        </div>
        <Link
          href={`/orgs/${id}/contracts/new`}
          className="h-9 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-xs font-medium text-[var(--surface-base)] inline-flex items-center hover:opacity-90"
        >
          Novo contrato
        </Link>
      </header>

      {contracts.length === 0 ? (
        <EmptyState orgId={id} />
      ) : (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Mensal</th>
                <th className="px-4 py-3">Início</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-base)]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/orgs/${id}/contracts/${c.id}`}
                      className="font-medium text-[var(--text-primary)] hover:underline"
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {clientById.get(c.clientId)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Money amount={c.monthlyValueCents / 100} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">
                    {c.startedAt}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function EmptyState({ orgId }: { orgId: string }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] p-12 text-center">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Nenhum contrato</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Amarre cliente a receita mensal pra começar a medir margem.
      </p>
      <Link
        href={`/orgs/${orgId}/contracts/new`}
        className="mt-6 inline-flex h-10 items-center rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] hover:opacity-90"
      >
        Criar primeiro contrato
      </Link>
    </section>
  );
}
