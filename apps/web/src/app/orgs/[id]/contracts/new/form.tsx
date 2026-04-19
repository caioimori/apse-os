'use client';

import type { SplitKind } from '@apse/modules-contracts/api';
import { type PricingSplit, calculateMargin } from '@apse/shared-domain';
import { Money } from '@apse/shared-ui';
import { useRouter } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';
import { createContractAction } from './actions';

type ClientOption = { id: string; name: string; kind: 'PF' | 'PJ' };
type SplitRow = {
  uid: string;
  kind: SplitKind;
  label: string;
  mode: 'pct' | 'amount';
  value: string;
};

const emptySplit = (): SplitRow => ({
  uid: crypto.randomUUID(),
  kind: 'revenue_share',
  label: '',
  mode: 'pct',
  value: '',
});

export function NewContractForm({
  orgId,
  clients,
}: {
  orgId: string;
  clients: ClientOption[];
}) {
  const router = useRouter();
  const firstClient = clients[0];
  const [clientId, setClientId] = useState(firstClient ? firstClient.id : '');
  const [title, setTitle] = useState('');
  const [monthly, setMonthly] = useState('');
  const [startedAt, setStartedAt] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [splits, setSplits] = useState<SplitRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthlyCents = Math.round(Number(monthly.replace(',', '.') || 0) * 100);

  const pricingSplits = useMemo<PricingSplit[]>(
    () =>
      splits
        .filter((s) => s.label.trim() && s.value.trim())
        .map((s) =>
          s.mode === 'pct'
            ? { kind: s.kind, label: s.label, pct: Number(s.value.replace(',', '.')) }
            : {
                kind: s.kind,
                label: s.label,
                amountCents: Math.round(Number(s.value.replace(',', '.')) * 100),
              },
        ),
    [splits],
  );

  const margin = useMemo(
    () => calculateMargin(monthlyCents, pricingSplits),
    [monthlyCents, pricingSplits],
  );

  function addSplit() {
    setSplits((s) => [...s, emptySplit()]);
  }
  function updateSplit(i: number, patch: Partial<SplitRow>) {
    setSplits((s) => s.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function removeSplit(i: number) {
    setSplits((s) => s.filter((_, idx) => idx !== i));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createContractAction({
      orgId,
      clientId,
      title,
      monthlyValueCents: monthlyCents,
      startedAt,
      notes: notes || undefined,
      splits: pricingSplits,
    });
    if (result.ok) {
      router.push(`/orgs/${orgId}/contracts/${result.data.id}`);
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-xs)]">
        <Field label="Cliente">
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={inputClass}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.kind})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Título">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Ex: MindLoop — Hub IA"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valor mensal (R$)">
            <input
              type="text"
              required
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="15000"
              inputMode="decimal"
            />
          </Field>
          <Field label="Início">
            <input
              type="date"
              required
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Notas">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClass} min-h-20 py-2 resize-y`}
          />
        </Field>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-xs)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Splits</h2>
          <button
            type="button"
            onClick={addSplit}
            className="h-8 rounded-[var(--radius-button)] border border-[var(--border-default)] px-3 text-xs font-medium hover:bg-[var(--surface-default)]"
          >
            + Adicionar split
          </button>
        </div>

        {splits.length === 0 ? (
          <p className="text-xs text-[var(--text-tertiary)]">
            Sem splits ainda. Adicione custos (freela, ferramenta, imposto) ou partição de sócios.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {splits.map((s, i) => (
              <SplitRowEditor
                key={s.uid}
                row={s}
                onChange={(p) => updateSplit(i, p)}
                onRemove={() => removeSplit(i)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)] p-8 shadow-[var(--shadow-xs)]">
        <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
          Preview de margem
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Stat label="Receita" value={<Money amount={monthlyCents / 100} />} />
          <Stat label="Custo total" value={<Money amount={margin.totalCostCents / 100} />} />
          <Stat
            label="Lucro"
            value={
              <Money
                amount={margin.netCents / 100}
                semantic={margin.netCents >= 0 ? 'profit' : 'loss'}
              />
            }
          />
          <Stat
            label="Margem"
            value={
              <span
                className={`font-mono tabular-nums ${
                  margin.marginPct >= 0
                    ? 'text-[var(--accent-repost)]'
                    : 'text-[var(--accent-like)]'
                }`}
              >
                {margin.marginPct.toFixed(1)}%
              </span>
            }
          />
        </dl>
      </section>

      {error ? (
        <p className="rounded-[var(--radius-input)] bg-[var(--accent-like-soft)] p-3 text-xs text-[var(--accent-like)]">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 rounded-[var(--radius-button)] border border-[var(--border-default)] px-4 text-sm text-[var(--text-secondary)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !title || !clientId || monthlyCents <= 0}
          className="h-10 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--surface-base)] disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar contrato'}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'h-10 w-full rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: children renders the form control
    <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
        {label}
      </span>
      <span className="text-lg">{value}</span>
    </div>
  );
}

const KIND_LABELS: Record<SplitKind, string> = {
  revenue_share: 'Partição',
  collaborator: 'Colaborador',
  tool: 'Ferramenta',
  tax: 'Imposto',
  other: 'Outro',
};

function SplitRowEditor({
  row,
  onChange,
  onRemove,
}: {
  row: SplitRow;
  onChange: (p: Partial<SplitRow>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid items-end gap-2 rounded-[var(--radius-input)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3 sm:grid-cols-[160px_1fr_100px_160px_auto]">
      <select
        value={row.kind}
        onChange={(e) => onChange({ kind: e.target.value as SplitKind })}
        className={inputClass}
      >
        {(Object.keys(KIND_LABELS) as SplitKind[]).map((k) => (
          <option key={k} value={k}>
            {KIND_LABELS[k]}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={row.label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Ex: Soier, Figma, Simples"
        className={inputClass}
      />
      <select
        value={row.mode}
        onChange={(e) => onChange({ mode: e.target.value as 'pct' | 'amount' })}
        className={inputClass}
      >
        <option value="pct">%</option>
        <option value="amount">R$</option>
      </select>
      <input
        type="text"
        value={row.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder={row.mode === 'pct' ? '50' : '2500'}
        className={`${inputClass} font-mono`}
        inputMode="decimal"
      />
      <button
        type="button"
        onClick={onRemove}
        className="h-10 rounded-[var(--radius-button)] px-3 text-xs text-[var(--text-tertiary)] hover:bg-[var(--accent-like-soft)] hover:text-[var(--accent-like)]"
      >
        Remover
      </button>
    </div>
  );
}
