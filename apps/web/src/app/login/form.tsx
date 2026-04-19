'use client';

import { createBrowserClient } from '@apse/shared-auth/browser';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get('next') ?? '/orgs';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createBrowserClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius-input)] border border-[var(--accent-repost-soft)] bg-[var(--accent-repost-soft)] p-4 text-sm text-[var(--accent-repost)]">
        Link enviado pra <strong>{email}</strong>. Verifica a caixa de entrada.
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail('');
          }}
          className="mt-3 block text-xs underline hover:no-underline"
        >
          Usar outro email
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
            placeholder="voce@empresa.com"
          />
        </label>
        {error ? <p className="text-xs text-[var(--accent-like)]">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || email.length === 0}
          className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
      <Link
        href="/"
        className="mt-6 inline-block text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
      >
        ← Voltar
      </Link>
    </>
  );
}
