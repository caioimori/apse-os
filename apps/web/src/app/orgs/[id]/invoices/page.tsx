import { listInvoices } from '@apse/modules-billing/api';
import { listClients } from '@apse/modules-clients/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { Money, StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { markPaidAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();

  const [invoices, clients] = await Promise.all([
    listInvoices(id),
    listClients({ orgId: id, status: ['active', 'inactive', 'archived'] }),
  ]);
  const clientById = new Map(clients.map((c) => [c.id, c.name]));
  const mockMode = process.env.APSE_ASAAS_MODE !== 'production';

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · invoices
      </nav>
      <header>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Cobranças
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {invoices.length} invoice{invoices.length === 1 ? '' : 's'} ·{' '}
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            APSE_ASAAS_MODE={process.env.APSE_ASAAS_MODE ?? 'mock'}
          </span>
        </p>
      </header>

      {invoices.length === 0 ? (
        <section className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] p-12 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Sem cobranças. Gere uma pelo detalhe de um contrato.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="px-4 py-3">{clientById.get(inv.clientId) ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">
                    {inv.dueAt}
                  </td>
                  <td className="px-4 py-3">
                    <Money amount={inv.amountCents / 100} />
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatus status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status === 'pending' && mockMode ? (
                      <form action={markPaidAction}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button
                          type="submit"
                          className="h-8 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium hover:bg-[var(--surface-default)]"
                        >
                          Simular pagamento
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-[var(--text-tertiary)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function InvoiceStatus({ status }: { status: 'pending' | 'paid' | 'overdue' | 'cancelled' }) {
  if (status === 'paid') return <StatusPill variant="paid" />;
  if (status === 'overdue') return <StatusPill variant="overdue" />;
  if (status === 'cancelled') return <StatusPill variant="draft" />;
  return <StatusPill variant="pending" />;
}
