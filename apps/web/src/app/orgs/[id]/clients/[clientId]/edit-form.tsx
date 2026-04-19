'use client';

import type { ClientStatus } from '@apse/modules-clients/api';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { archiveClientAction, updateClientAction } from './actions';

type Props = {
  orgId: string;
  client: {
    id: string;
    email: string;
    phone: string;
    notes: string;
    status: ClientStatus;
  };
};

export function EditClientForm({ orgId, client }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [notes, setNotes] = useState(client.notes);
  const [loading, setLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const dirty = email !== client.email || phone !== client.phone || notes !== client.notes;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const result = await updateClientAction({
      id: client.id,
      email: email || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
    });
    if (result.ok) {
      setFeedback({ kind: 'ok', msg: 'Salvo' });
      router.refresh();
    } else {
      setFeedback({ kind: 'err', msg: result.error });
    }
    setLoading(false);
  }

  async function archive() {
    if (!confirm('Arquivar este cliente? Ele some da lista padrão.')) return;
    setArchiving(true);
    const result = await archiveClientAction(client.id);
    if (result.ok) {
      router.push(`/orgs/${orgId}/clients`);
      router.refresh();
    } else {
      setFeedback({ kind: 'err', msg: result.error });
      setArchiving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-xs)]"
    >
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
          className={`${inputClass} min-h-32 py-2 resize-y`}
        />
      </Field>

      {feedback ? (
        <p
          className={`rounded-[var(--radius-input)] p-3 text-xs ${
            feedback.kind === 'ok'
              ? 'bg-[var(--accent-repost-soft)] text-[var(--accent-repost)]'
              : 'bg-[var(--accent-like-soft)] text-[var(--accent-like)]'
          }`}
        >
          {feedback.msg}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        {client.status !== 'archived' ? (
          <button
            type="button"
            onClick={archive}
            disabled={archiving}
            className="h-10 rounded-[var(--radius-button)] border border-[var(--border-default)] px-4 text-xs font-medium text-[var(--accent-like)] transition hover:bg-[var(--accent-like-soft)] disabled:opacity-50"
          >
            {archiving ? 'Arquivando...' : 'Arquivar cliente'}
          </button>
        ) : (
          <span className="text-xs text-[var(--text-tertiary)]">Cliente arquivado</span>
        )}
        <button
          type="submit"
          disabled={loading || !dirty}
          className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'h-10 w-full rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: children always renders the form control
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      {children}
    </label>
  );
}
