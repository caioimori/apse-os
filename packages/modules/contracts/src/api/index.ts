import { createServerClient } from '@apse/shared-auth/server';
import { type MarginResult, type PricingSplit, calculateMargin } from '@apse/shared-domain';
import {
  type Contract,
  type ContractSplit,
  type ContractWithSplits,
  CreateContractInputSchema,
  EndContractInputSchema,
} from './contracts';

export * from './contracts';
export { calculateMargin, type MarginResult, type PricingSplit };

type ContractRow = {
  id: string;
  org_id: string;
  client_id: string;
  title: string;
  monthly_value_cents: number;
  currency: string;
  started_at: string;
  ended_at: string | null;
  status: 'active' | 'paused' | 'ended';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type SplitRow = {
  id: string;
  contract_id: string;
  kind: 'revenue_share' | 'collaborator' | 'tool' | 'tax' | 'other';
  label: string;
  pct: number | null;
  amount_cents: number | null;
  order_idx: number;
};

function rowToContract(r: ContractRow): Contract {
  return {
    id: r.id,
    orgId: r.org_id,
    clientId: r.client_id,
    title: r.title,
    monthlyValueCents: Number(r.monthly_value_cents),
    currency: r.currency,
    startedAt: r.started_at,
    endedAt: r.ended_at,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToSplit(r: SplitRow): ContractSplit {
  return {
    id: r.id,
    contractId: r.contract_id,
    kind: r.kind,
    label: r.label,
    pct: r.pct != null ? Number(r.pct) : null,
    amountCents: r.amount_cents != null ? Number(r.amount_cents) : null,
    orderIdx: r.order_idx,
  };
}

export async function listContracts(orgId: string): Promise<Contract[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('org_id', orgId)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return (data as ContractRow[]).map(rowToContract);
}

export async function listContractsByClient(clientId: string): Promise<Contract[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('client_id', clientId)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return (data as ContractRow[]).map(rowToContract);
}

export async function getContract(id: string): Promise<ContractWithSplits | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('contracts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { data: splits, error: splitsError } = await supabase
    .from('contract_splits')
    .select('*')
    .eq('contract_id', id)
    .order('order_idx', { ascending: true });
  if (splitsError) throw splitsError;

  return {
    ...rowToContract(data as ContractRow),
    splits: (splits as SplitRow[]).map(rowToSplit),
  };
}

export async function createContract(raw: unknown): Promise<ContractWithSplits> {
  const input = CreateContractInputSchema.parse(raw);
  const supabase = await createServerClient();
  const { data: contract, error } = await supabase
    .from('contracts')
    .insert({
      org_id: input.orgId,
      client_id: input.clientId,
      title: input.title,
      monthly_value_cents: input.monthlyValueCents,
      started_at: input.startedAt,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;

  const contractId = (contract as ContractRow).id;
  if (input.splits.length > 0) {
    const rows = input.splits.map((s, idx) => ({
      contract_id: contractId,
      kind: s.kind,
      label: s.label,
      pct: s.pct ?? null,
      amount_cents: s.amountCents ?? null,
      order_idx: idx,
    }));
    const { error: splitError } = await supabase.from('contract_splits').insert(rows);
    if (splitError) throw splitError;
  }

  const result = await getContract(contractId);
  if (!result) throw new Error('contract disappeared after insert');
  return result;
}

export async function endContract(raw: unknown): Promise<Contract> {
  const input = EndContractInputSchema.parse(raw);
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('contracts')
    .update({ status: 'ended', ended_at: input.endedAt })
    .eq('id', input.id)
    .select('*')
    .single();
  if (error) throw error;
  return rowToContract(data as ContractRow);
}

export function marginOfContract(c: ContractWithSplits): MarginResult {
  const splits: PricingSplit[] = c.splits.map((s) => ({
    kind: s.kind,
    label: s.label,
    pct: s.pct,
    amountCents: s.amountCents,
  }));
  return calculateMargin(c.monthlyValueCents, splits);
}
