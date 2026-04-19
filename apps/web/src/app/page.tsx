import { createServerClient } from '@apse/shared-auth/server';
import { KPIBlock, Margin, Money, StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/orgs');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 sm:px-8">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          ApseOS · MVP
        </span>
        <h1 className="text-4xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)] sm:text-5xl">
          A camada financeira das agências brasileiras.
        </h1>
        <p className="max-w-2xl text-base text-[var(--text-secondary)]">
          Lucro real por cliente em tempo real. Conecta CRM, gateway de cobrança e custos em um só
          lugar. Localhost-first, modular, minimalista.
        </p>
        <div className="mt-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90"
          >
            Entrar
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <KPIBlock
          label="MRR"
          value={<Money amount={27430} semantic="profit" />}
          delta={<Margin percent={8.4} />}
        />
        <KPIBlock
          label="Lucro líquido"
          value={<Money amount={12870} semantic="profit" />}
          delta={<Margin percent={3.1} />}
        />
        <KPIBlock
          label="Em risco"
          value={<Money amount={-1420} semantic="loss" />}
          delta={<Margin percent={-2.2} />}
        />
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-6 shadow-[var(--shadow-xs)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Status de invoices</h2>
          <span className="text-xs text-[var(--text-tertiary)]">Preview · dados fake</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill variant="paid" />
          <StatusPill variant="pending" />
          <StatusPill variant="overdue" />
          <StatusPill variant="draft" />
        </div>
      </section>

      <footer className="mt-auto border-t border-[var(--border-default)] pt-6 text-xs text-[var(--text-tertiary)]">
        SINAPSE · dogfood — construído em público.
      </footer>
    </main>
  );
}
