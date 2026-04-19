'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { createOrgAction } from './actions';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createOrgAction({ name, slug: slug || slugify(name) });
    if (result.ok) {
      router.push('/orgs');
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
        Nome da organização
        <input
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
          placeholder="SINAPSE"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
        Slug
        <input
          type="text"
          required
          pattern="[a-z0-9-]+"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="h-10 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
          placeholder="sinapse"
        />
        <span className="text-[10px] text-[var(--text-tertiary)]">
          Minúsculo, números e hífen. Usado em URLs internas.
        </span>
      </label>

      {error ? (
        <p className="rounded-[var(--radius-input)] bg-[var(--accent-like-soft)] p-3 text-xs text-[var(--accent-like)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || name.length < 2}
        className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar organização'}
      </button>
    </form>
  );
}
