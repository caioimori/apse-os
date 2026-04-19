import { listPayable } from '@apse/modules-collaborators/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { Money } from '@apse/shared-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recordPaymentAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function PayablePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();
  const payable = await listPayable(id);
  const total = payable.reduce((a, b) => a + b.amountCents, 0);
  const month = `${new Date().toISOString().slice(0, 7)}-01`;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · a pagar
      </nav>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          A pagar este mês
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Derivado dos splits de kind="collaborator" nos contratos ativos · total{' '}
          <Money amount={total / 100} />
        </p>
      </header>

      {payable.length === 0 ? (
        <section className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] p-12 text-center text-sm text-[var(--text-secondary)]">
          Nenhum split de colaborador em contratos ativos. Adicione splits de kind "collaborator" em
          contratos pra ver aqui.
        </section>
      ) : (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-4 py-3">Nome (split label)</th>
                <th className="px-4 py-3">Contrato</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Colaborador</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {payable.map((p, i) => (
                <tr
                  key={`${p.contractId}-${i}`}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{p.label}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    <Link
                      href={`/orgs/${id}/contracts/${p.contractId}`}
                      className="hover:underline"
                    >
                      {p.contractTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Money amount={p.amountCents / 100} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {p.matchedCollaboratorId ? (
                      <span className="text-[var(--accent-repost)]">✓ vinculado</span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">não vinculado</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.matchedCollaboratorId ? (
                      <form action={recordPaymentAction}>
                        <input type="hidden" name="orgId" value={id} />
                        <input
                          type="hidden"
                          name="collaboratorId"
                          value={p.matchedCollaboratorId}
                        />
                        <input type="hidden" name="contractId" value={p.contractId} />
                        <input type="hidden" name="amountCents" value={String(p.amountCents)} />
                        <input type="hidden" name="referenceMonth" value={month} />
                        <button
                          type="submit"
                          className="h-8 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium hover:bg-[var(--surface-default)]"
                        >
                          Marcar pago
                        </button>
                      </form>
                    ) : (
                      <Link
                        href={`/orgs/${id}/collaborators`}
                        className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                      >
                        cadastrar "{p.label}"
                      </Link>
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
