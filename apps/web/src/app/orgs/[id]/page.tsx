import { getOrg } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const org = await getOrg(id);

  if (!org) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <nav className="text-xs text-[var(--text-tertiary)]">
        <Link href="/orgs" className="hover:text-[var(--text-secondary)]">
          ← organizações
        </Link>
      </nav>
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          {org.slug}
        </span>
        <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {org.name}
        </h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <NavCard
          href={`/orgs/${org.id}/clients`}
          title="Clientes"
          description="Gerencia cadastros PF/PJ da organização."
        />
        <NavCard
          href={`/orgs/${org.id}/contracts`}
          title="Contratos"
          description="Cliente → receita mensal + splits + preview de margem."
        />
        <NavCard
          href={`/orgs/${org.id}/invoices`}
          title="Cobranças"
          description="Invoices geradas a partir de contratos (mock Asaas por padrão)."
        />
        <NavCard
          href={`/orgs/${org.id}/collaborators`}
          title="Colaboradores"
          description='Cadastro + lista "a pagar esse mês" derivada dos splits.'
        />
        <NavCard
          href={`/orgs/${org.id}/dashboard`}
          title="Dashboard"
          description="MRR, lucro estimado, clientes em risco + insights mock."
        />
        <NavCard
          href={`/orgs/${org.id}/import`}
          title="Importar CRM"
          description="Sonar/Pipedrive mock → puxa leads ganhos como clientes."
        />
      </section>
    </main>
  );
}

function NavCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)] transition hover:border-[var(--border-strong)]"
    >
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </Link>
  );
}
