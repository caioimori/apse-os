import { Suspense } from 'react';
import { LoginForm } from './form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-sm)]">
        <h1 className="mb-1 text-2xl font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          Entrar no ApseOS
        </h1>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          Enviamos um link mágico pro seu email.
        </p>
        <Suspense
          fallback={
            <div className="h-10 animate-pulse rounded-[var(--radius-input)] bg-[var(--surface-default)]" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
