'use client';

import { maskDocumentInput } from '@/lib/format-document';
import type { ClientKind } from '@apse/modules-clients/api';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { createClientAction } from './actions';

export function ClientForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [kind, setKind] = useState<ClientKind>('PJ');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createClientAction({
      orgId,
      kind,
      name,
      document: document || undefined,
      email: email || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
    });
    if (result.ok) {
      router.push(`/orgs/${orgId}/clients/${result.data.id}`);
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-xs)]"
    >
      <fieldset className="flex gap-2">
        <KindToggle label="Pessoa jurídica" value="PJ" selected={kind} onSelect={setKind} />
        <KindToggle label="Pessoa física" value="PF" selected={kind} onSelect={setKind} />
      </fieldset>

      <Field label="Nome" required>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder={kind === 'PJ' ? 'Razão social ou nome fantasia' : 'Nome completo'}
        />
      </Field>

      <Field label={kind === 'PJ' ? 'CNPJ' : 'CPF'}>
        <input
          type="text"
          value={document}
          onChange={(e) => setDocument(maskDocumentInput(e.target.value, kind))}
          className={`${inputClass} font-mono`}
          placeholder={kind === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
          inputMode="numeric"
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="contato@empresa.com"
        />
      </Field>

      <Field label="Telefone">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="+55 11 99999-0000"
        />
      </Field>

      <Field label="Notas">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputClass} min-h-24 py-2 resize-y`}
          placeholder="Contexto do cliente, histórico, observações..."
        />
      </Field>

      {error ? (
        <p className="rounded-[var(--radius-input)] bg-[var(--accent-like-soft)] p-3 text-xs text-[var(--accent-like)]">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 rounded-[var(--radius-button)] border border-[var(--border-default)] px-4 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-default)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || name.trim().length < 2}
          className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar cliente'}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'h-10 w-full rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: children always renders the form control
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      {required ? <span className="text-[var(--accent-like)]">*</span> : null}
      {children}
    </label>
  );
}

function KindToggle({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: ClientKind;
  selected: ClientKind;
  onSelect: (v: ClientKind) => void;
}) {
  const active = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`h-9 flex-1 rounded-[var(--radius-button)] text-xs font-medium transition ${
        active
          ? 'bg-[var(--text-primary)] text-[var(--surface-base)]'
          : 'border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-secondary)] hover:bg-[var(--surface-default)]'
      }`}
    >
      {label}
    </button>
  );
}
