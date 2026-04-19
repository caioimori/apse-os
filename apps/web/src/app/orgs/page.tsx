import { listMyOrgs } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrgsPage() {
  const user = await requireUser('/orgs');
  const orgs = await listMyOrgs();

  if (orgs.length === 0) {
    redirect('/onboarding');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
            Logado como {user.email}
          </span>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
            Suas organizações
          </h1>
        </div>
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="h-9 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--surface-default)]"
          >
            Sair
          </button>
        </form>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {orgs.map((org) => (
          <Link
            key={org.id}
            href={`/orgs/${org.id}`}
            className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)] transition hover:border-[var(--border-strong)]"
          >
            <span className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
              {org.role}
            </span>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{org.name}</h2>
            <span className="font-mono text-xs text-[var(--text-secondary)]">{org.slug}</span>
          </Link>
        ))}

        <Link
          href="/onboarding"
          className="flex flex-col items-start justify-center gap-1 rounded-[var(--radius-card)] border border-dashed border-[var(--border-default)] p-6 text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium">Nova organização</span>
        </Link>
      </section>
    </main>
  );
}
