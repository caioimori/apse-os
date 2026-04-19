'use server';

import { createInvoiceFromContract, markInvoicePaid } from '@apse/modules-billing/api';
import { revalidatePath } from 'next/cache';

export async function markPaidAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await markInvoicePaid({ id });
  revalidatePath('/orgs/[id]/invoices', 'page');
}

export async function createInvoiceAction(formData: FormData) {
  const orgId = String(formData.get('orgId') ?? '');
  const contractId = String(formData.get('contractId') ?? '');
  const dueAt = String(formData.get('dueAt') ?? '');
  if (!orgId || !contractId || !dueAt) return { ok: false, error: 'faltam campos' };
  try {
    const inv = await createInvoiceFromContract({ orgId, contractId, dueAt });
    revalidatePath(`/orgs/${orgId}/invoices`);
    revalidatePath(`/orgs/${orgId}/contracts/${contractId}`);
    return { ok: true, id: inv.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'erro' };
  }
}
