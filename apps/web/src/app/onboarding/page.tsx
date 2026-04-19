import { listMyOrgs } from '@apse/modules-organizations/api';
import { requireUser } from '@apse/shared-auth/guards';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './form';

export default async function OnboardingPage() {
  await requireUser('/onboarding');
  const orgs = await listMyOrgs();

  if (orgs.length > 0) {
    redirect('/orgs');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-sm)]">
        <span className="text-xs font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">
          Onboarding
        </span>
        <h1 className="mt-1 text-2xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Crie sua primeira organização
        </h1>
        <p className="mb-6 mt-2 text-sm text-[var(--text-secondary)]">
          Toda operação (clientes, contratos, cobranças) fica escopada numa org. Você pode criar
          mais depois.
        </p>
        <OnboardingForm />
      </div>
    </main>
  );
}
