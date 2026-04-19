import { sonar } from '@apse/integrations-sonar';
import { createClient } from '@apse/modules-clients/api';
import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ImportPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);
  if (!org) notFound();
  const leads = await sonar().listWon();

  async function importLeadAction(formData: FormData) {
    'use server';
    const orgId = String(formData.get('orgId') ?? '');
    const name = String(formData.get('name') ?? '');
    const kind = String(formData.get('kind') ?? 'PJ') as 'PF' | 'PJ';
    const document = String(formData.get('document') ?? '') || undefined;
    const email = String(formData.get('email') ?? '') || undefined;
    try {
      await createClient({ orgId, kind, name, document, email });
    } catch (err) {
      console.warn('[import] falhou', err);
    }
    revalidatePath(`/orgs/${orgId}/clients`);
    revalidatePath(`/orgs/${orgId}/import`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href={`/orgs/${id}`} className="hover:text-[var(--text-secondary)]">
          {org.name}
        </Link>{' '}
        · importar do CRM
      </nav>
      <header>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Importar do CRM
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {leads.length} leads ganhos no Sonar (mock) · troque pra sandbox/prod via{' '}
          <code className="font-mono text-xs">APSE_SONAR_MODE</code>
        </p>
      </header>

      {leads.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">Sem leads pra importar.</p>
      ) : (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
              <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l.externalId}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{l.kind}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-tertiary)]">
                    {l.document ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {l.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={importLeadAction}>
                      <input type="hidden" name="orgId" value={id} />
                      <input type="hidden" name="name" value={l.name} />
                      <input type="hidden" name="kind" value={l.kind} />
                      <input type="hidden" name="document" value={l.document ?? ''} />
                      <input type="hidden" name="email" value={l.email ?? ''} />
                      <button
                        type="submit"
                        className="h-8 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium hover:bg-[var(--surface-default)]"
                      >
                        Importar
                      </button>
                    </form>
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
