import { getContract, listContracts } from '@apse/modules-contracts/api';
import { createServerClient } from '@apse/shared-auth/server';
import { calculateMargin } from '@apse/shared-domain';
import {
  type Collaborator,
  CreateCollaboratorInputSchema,
  type PayablePreview,
  RecordPaymentInputSchema,
} from './contracts';

export * from './contracts';

type CollaboratorRow = {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  pix_key: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

function rowToCollaborator(r: CollaboratorRow): Collaborator {
  return {
    id: r.id,
    orgId: r.org_id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    document: r.document,
    pixKey: r.pix_key,
    notes: r.notes,
    active: r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listCollaborators(orgId: string): Promise<Collaborator[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .eq('org_id', orgId)
    .order('name', { ascending: true });
  if (error) throw error;
  return (data as CollaboratorRow[]).map(rowToCollaborator);
}

export async function getCollaborator(id: string): Promise<Collaborator | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToCollaborator(data as CollaboratorRow);
}

export async function createCollaborator(raw: unknown): Promise<Collaborator> {
  const input = CreateCollaboratorInputSchema.parse(raw);
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('collaborators')
    .insert({
      org_id: input.orgId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      document: input.document ?? null,
      pix_key: input.pixKey ?? null,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToCollaborator(data as CollaboratorRow);
}

export async function recordPayment(raw: unknown): Promise<void> {
  const input = RecordPaymentInputSchema.parse(raw);
  const supabase = await createServerClient();
  const { error } = await supabase.from('collaborator_payments').insert({
    org_id: input.orgId,
    collaborator_id: input.collaboratorId,
    contract_id: input.contractId ?? null,
    amount_cents: input.amountCents,
    reference_month: input.referenceMonth,
    paid_at: new Date().toISOString(),
    notes: input.notes ?? null,
  });
  if (error) throw error;
}

/**
 * Deriva "a pagar" dos contratos ativos × splits de kind='collaborator'.
 * Tenta casar por nome (case-insensitive) com colaboradores cadastrados.
 */
export async function listPayable(orgId: string): Promise<PayablePreview[]> {
  const contracts = await listContracts(orgId);
  const active = contracts.filter((c) => c.status === 'active');
  const collabs = await listCollaborators(orgId);
  const byName = new Map(collabs.map((c) => [c.name.trim().toLowerCase(), c.id]));

  const payable: PayablePreview[] = [];
  for (const c of active) {
    const full = await getContract(c.id);
    if (!full) continue;
    const collaboratorSplits = full.splits.filter((s) => s.kind === 'collaborator');
    if (collaboratorSplits.length === 0) continue;
    const margin = calculateMargin(
      c.monthlyValueCents,
      collaboratorSplits.map((s) => ({
        kind: s.kind,
        label: s.label,
        pct: s.pct,
        amountCents: s.amountCents,
      })),
    );
    margin.breakdown.forEach((b, i) => {
      const s = collaboratorSplits[i];
      if (!s) return;
      payable.push({
        label: s.label,
        matchedCollaboratorId: byName.get(s.label.trim().toLowerCase()) ?? null,
        contractId: c.id,
        contractTitle: c.title,
        amountCents: b.costCents,
      });
    });
  }
  return payable.sort((a, b) => a.label.localeCompare(b.label));
}

export async function listPayments(orgId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('collaborator_payments')
    .select('*')
    .eq('org_id', orgId)
    .order('paid_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data ?? [];
}
