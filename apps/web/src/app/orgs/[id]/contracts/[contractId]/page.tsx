import { listInvoicesByContract } from '@apse/modules-billing/api';
import { getClient } from '@apse/modules-clients/api';
import { getContract, marginOfContract } from '@apse/modules-contracts/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { Money, StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createInvoiceFromContractAction } from './actions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string; contractId: string }> };

export default async function ContractDetailPage({ params }: Props) {
  await requireUser();
  const { id, contractId } = await params;
  const [org, contract] = await Promise.all([getOrg(id), getContract(contractId)]);
  if (!org || !contract) notFound();
  const [client, invoices] = await Promise.all([
    getClient(contract.clientId),
    listInvoicesByContract(contractId),
  ]);
  const margin = marginOfContract(contract);
  const defaultDueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}/contracts`} className="hover:text-[var(--text-secondary)]">
          ← Contratos
        </Link>
      </nav>

      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          {client?.name ?? 'Cliente removido'} · {contract.status}
        </span>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {contract.title}
        </h1>
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          Iniciado em {contract.startedAt}
          {contract.endedAt ? ` · finalizado em ${contract.endedAt}` : ''}
        </p>
      </header>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
          Margem mensal
        </h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Receita" value={<Money amount={contract.monthlyValueCents / 100} />} />
          <Stat label="Custos" value={<Money amount={margin.totalCostCents / 100} />} />
          <Stat
            label="Lucro"
            value={
              <Money
                amount={margin.netCents / 100}
                semantic={margin.netCents >= 0 ? 'profit' : 'loss'}
              />
            }
          />
          <Stat
            label="Margem"
            value={
              <span
                className={`font-mono tabular-nums ${
                  margin.marginPct >= 0
                    ? 'text-[var(--accent-repost)]'
                    : 'text-[var(--accent-like)]'
                }`}
              >
                {margin.marginPct.toFixed(1)}%
              </span>
            }
          />
        </dl>
      </section>

      {contract.splits.length > 0 ? (
        <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] overflow-hidden">
          <h2 className="border-b border-[var(--border-default)] px-6 py-3 text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
            Splits
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-6 py-2">Tipo</th>
                <th className="px-6 py-2">Label</th>
                <th className="px-6 py-2">Valor</th>
                <th className="px-6 py-2">Custo</th>
              </tr>
            </thead>
            <tbody>
              {margin.breakdown.map((b, i) => {
                const s = contract.splits[i];
                if (!s) return null;
                return (
                  <tr key={s.id} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="px-6 py-2 text-xs text-[var(--text-secondary)]">{b.kind}</td>
                    <td className="px-6 py-2">{b.label}</td>
                    <td className="px-6 py-2 font-mono text-xs text-[var(--text-tertiary)]">
                      {s.pct != null ? `${s.pct}%` : `R$ ${(s.amountCents ?? 0) / 100}`}
                    </td>
                    <td className="px-6 py-2">
                      <Money amount={b.costCents / 100} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
            Cobranças ({invoices.length})
          </h2>
          <form action={createInvoiceFromContractAction} className="flex items-center gap-2">
            <input type="hidden" name="orgId" value={id} />
            <input type="hidden" name="contractId" value={contractId} />
            <input
              type="date"
              name="dueAt"
              defaultValue={defaultDueAt}
              className="h-9 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-2 text-xs"
            />
            <button
              type="submit"
              className="h-9 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-3 text-xs font-medium text-[var(--surface-base)] hover:opacity-90"
            >
              Gerar cobrança
            </button>
          </form>
        </div>
        {invoices.length === 0 ? (
          <p className="text-xs text-[var(--text-tertiary)]">Nenhuma cobrança ainda.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="py-2">Vencimento</th>
                <th className="py-2">Valor</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-[var(--border-subtle)]">
                  <td className="py-2 font-mono text-xs text-[var(--text-tertiary)]">
                    {inv.dueAt}
                  </td>
                  <td className="py-2">
                    <Money amount={inv.amountCents / 100} />
                  </td>
                  <td className="py-2">
                    <InvoiceStatus status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {contract.notes ? (
        <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
            Notas
          </h2>
          <p className="whitespace-pre-wrap text-sm text-[var(--text-secondary)]">
            {contract.notes}
          </p>
        </section>
      ) : null}
    </main>
  );
}

function InvoiceStatus({ status }: { status: 'pending' | 'paid' | 'overdue' | 'cancelled' }) {
  if (status === 'paid') return <StatusPill variant="paid" />;
  if (status === 'overdue') return <StatusPill variant="overdue" />;
  if (status === 'cancelled') return <StatusPill variant="draft" />;
  return <StatusPill variant="pending" />;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
        {label}
      </span>
      <span className="text-lg">{value}</span>
    </div>
  );
}
