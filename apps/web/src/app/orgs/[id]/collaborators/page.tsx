import { listCollaborators } from '@apse/modules-collaborators/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createCollaboratorAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function CollaboratorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();
  const collabs = await listCollaborators(id);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · colaboradores
      </nav>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
            Colaboradores
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {collabs.length} cadastrado{collabs.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href={`/orgs/${id}/payable`}
          className="h-9 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium inline-flex items-center hover:bg-[var(--surface-default)]"
        >
          Ver "a pagar"
        </Link>
      </header>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
          Novo colaborador
        </h2>
        <form action={createCollaboratorAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="orgId" value={id} />
          <input
            name="name"
            required
            minLength={2}
            placeholder="Nome"
            className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="email (opcional)"
            className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm"
          />
          <input
            name="pixKey"
            placeholder="Chave PIX (opcional)"
            className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm font-mono"
          />
          <button
            type="submit"
            className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] text-sm font-medium text-[var(--surface-base)]"
          >
            Adicionar
          </button>
        </form>
      </section>

      {collabs.length > 0 ? (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">PIX</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {collabs.map((c) => (
                <tr key={c.id} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {c.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">
                    {c.pixKey ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {c.active ? (
                      <span className="text-[var(--accent-repost)]">Ativo</span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">Inativo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </main>
  );
}
