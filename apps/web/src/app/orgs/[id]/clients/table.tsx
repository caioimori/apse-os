'use client';

import { formatDocument } from '@/lib/format-document';
import type { Client } from '@apse/modules-clients/api';
import { StatusPill } from '@apse/shared-ui';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Props = {
  orgId: string;
  clients: Client[];
};

export function ClientsTable({ orgId, clients }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const needle = search.toLowerCase();
    return clients.filter((c) => {
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.document ?? '').toLowerCase().includes(needle) ||
        (c.email ?? '').toLowerCase().includes(needle)
      );
    });
  }, [clients, search]);

  return (
    <section className="flex flex-col gap-4">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome, documento ou email..."
        className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--surface-void)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
      />

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--surface-void)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-default)] bg-[var(--surface-base)]">
            <tr className="text-xs font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[var(--border-subtle)] last:border-0 transition hover:bg-[var(--surface-base)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/orgs/${orgId}/clients/${c.id}`}
                    className="font-medium text-[var(--text-primary)] hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]">
                  {c.kind}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                  {formatDocument(c.document) || '—'}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{c.email || '—'}</td>
                <td className="px-4 py-3">
                  <StatusLabel status={c.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-xs text-[var(--text-tertiary)]"
                >
                  Nenhum cliente bate com "{search}".
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusLabel({ status }: { status: Client['status'] }) {
  if (status === 'archived') return <StatusPill variant="draft" />;
  if (status === 'inactive') return <StatusPill variant="pending" />;
  return <StatusPill variant="paid" />;
}
