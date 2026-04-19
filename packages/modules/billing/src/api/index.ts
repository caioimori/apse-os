import { asaas } from '@apse/integrations-asaas';
import { getContract } from '@apse/modules-contracts/api';
import { createServerClient } from '@apse/shared-auth/server';
import { emit } from '@apse/shared-events';
import {
  CreateInvoiceFromContractInputSchema,
  type Invoice,
  MarkPaidInputSchema,
} from './contracts';

export * from './contracts';

type InvoiceRow = {
  id: string;
  org_id: string;
  contract_id: string | null;
  client_id: string;
  amount_cents: number;
  currency: string;
  due_at: string;
  paid_at: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  external_id: string | null;
  external_provider: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function rowToInvoice(r: InvoiceRow): Invoice {
  return {
    id: r.id,
    orgId: r.org_id,
    contractId: r.contract_id,
    clientId: r.client_id,
    amountCents: Number(r.amount_cents),
    currency: r.currency,
    dueAt: r.due_at,
    paidAt: r.paid_at,
    status: r.status,
    externalId: r.external_id,
    externalProvider: r.external_provider,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listInvoices(orgId: string): Promise<Invoice[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('org_id', orgId)
    .order('due_at', { ascending: false });
  if (error) throw error;
  return (data as InvoiceRow[]).map(rowToInvoice);
}

export async function listInvoicesByContract(contractId: string): Promise<Invoice[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('contract_id', contractId)
    .order('due_at', { ascending: false });
  if (error) throw error;
  return (data as InvoiceRow[]).map(rowToInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToInvoice(data as InvoiceRow);
}

export async function createInvoiceFromContract(raw: unknown): Promise<Invoice> {
  const input = CreateInvoiceFromContractInputSchema.parse(raw);
  const contract = await getContract(input.contractId);
  if (!contract) throw new Error('contract not found');
  if (contract.orgId !== input.orgId) throw new Error('org mismatch');

  const supabase = await createServerClient();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      org_id: input.orgId,
      contract_id: input.contractId,
      client_id: contract.clientId,
      amount_cents: contract.monthlyValueCents,
      currency: contract.currency,
      due_at: input.dueAt,
    })
    .select('*')
    .single();
  if (error) throw error;

  const row = invoice as InvoiceRow;

  // Dispara adapter pra criar a cobrança externa
  const gw = asaas();
  try {
    const charge = await gw.createCharge({
      amountCents: row.amount_cents,
      currency: 'BRL',
      dueAt: row.due_at,
      clientRef: { name: 'client', document: null, email: null },
      externalInvoiceId: row.id,
    });
    await supabase
      .from('invoices')
      .update({ external_id: charge.externalId, external_provider: 'asaas' })
      .eq('id', row.id);
    row.external_id = charge.externalId;
    row.external_provider = 'asaas';
  } catch (err) {
    console.warn('[billing] gateway failed, invoice created but no external charge', err);
  }

  const result = rowToInvoice(row);
  await emit({
    id: crypto.randomUUID(),
    type: 'invoice.created',
    orgId: result.orgId,
    payload: {
      invoiceId: result.id,
      contractId: result.contractId ?? undefined,
      amountCents: result.amountCents,
    },
    occurredAt: new Date().toISOString(),
    version: 1,
  });
  return result;
}

export async function markInvoicePaid(raw: unknown): Promise<Invoice> {
  const input = MarkPaidInputSchema.parse(raw);
  const supabase = await createServerClient();
  const paidAt = input.paidAt ?? new Date().toISOString();
  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'paid', paid_at: paidAt })
    .eq('id', input.id)
    .select('*')
    .single();
  if (error) throw error;
  const inv = rowToInvoice(data as InvoiceRow);
  await emit({
    id: crypto.randomUUID(),
    type: 'invoice.paid',
    orgId: inv.orgId,
    payload: { invoiceId: inv.id, amount: inv.amountCents, paidAt },
    occurredAt: new Date().toISOString(),
    version: 1,
  });
  return inv;
}

export async function cancelInvoice(id: string): Promise<Invoice> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return rowToInvoice(data as InvoiceRow);
}
