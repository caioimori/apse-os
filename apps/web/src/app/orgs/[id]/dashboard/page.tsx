import { claude } from '@apse/integrations-claude';
import { getOrgOverview } from '@apse/modules-dashboard/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { KPIBlock, Money } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();
  const [ov, insights] = await Promise.all([
    getOrgOverview(id),
    claude().generateInsights({ orgId: id }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · dashboard
      </nav>
      <header>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {ov.activeContracts} contratos ativos · {ov.activeClients} clientes
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPIBlock label="MRR" value={<Money amount={ov.mrrCents / 100} semantic="profit" />} />
        <KPIBlock label="Custos mensais" value={<Money amount={ov.monthlyCostsCents / 100} />} />
        <KPIBlock
          label="Lucro líquido estimado"
          value={
            <Money
              amount={ov.monthlyNetCents / 100}
              semantic={ov.monthlyNetCents >= 0 ? 'profit' : 'loss'}
            />
          }
          delta={
            <span
              className={`font-mono tabular-nums text-sm ${
                ov.avgMarginPct >= 0 ? 'text-[var(--accent-repost)]' : 'text-[var(--accent-like)]'
              }`}
            >
              {ov.avgMarginPct.toFixed(1)}% margem média
            </span>
          }
        />
        <KPIBlock
          label="Pago este mês"
          value={<Money amount={ov.paidThisMonthCents / 100} semantic="profit" />}
          delta={
            ov.overdueCount > 0 ? (
              <span className="font-mono text-sm text-[var(--accent-like)]">
                {ov.overdueCount} vencida{ov.overdueCount === 1 ? '' : 's'}
              </span>
            ) : null
          }
        />
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]">
        <h2 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
          <span>Insights</span>
          <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] px-2 py-0.5 text-[10px] normal-case tracking-normal text-[var(--text-tertiary)]">
            mock · ADR-003
          </span>
        </h2>
        <ul className="flex flex-col gap-3">
          {insights.map((i) => (
            <li
              key={i.headline}
              className="border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0"
            >
              <p className="text-sm font-medium text-[var(--text-primary)]">{i.headline}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{i.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Top clientes por MRR">
          {ov.topClients.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)]">Sem contratos ativos.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {ov.topClients.map((c) => (
                <li
                  key={c.clientId}
                  className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 last:border-0 last:pb-0"
                >
                  <Link
                    href={`/orgs/${id}/clients/${c.clientId}`}
                    className="text-sm hover:underline"
                  >
                    {c.clientName}
                  </Link>
                  <Money amount={c.monthlyCents / 100} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Clientes em risco">
          {ov.clientsAtRisk.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)]">
              Nenhum cliente com margem abaixo de 10%.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {ov.clientsAtRisk.map((c) => (
                <li
                  key={c.clientId}
                  className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 last:border-0 last:pb-0"
                >
                  <Link
                    href={`/orgs/${id}/clients/${c.clientId}`}
                    className="text-sm hover:underline"
                  >
                    {c.clientName}
                  </Link>
                  <span className="font-mono text-sm tabular-nums text-[var(--accent-like)]">
                    {c.marginPct.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
