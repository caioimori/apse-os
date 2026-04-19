'use server';

import { createInvoiceFromContract } from '@apse/modules-billing/api';
import { revalidatePath } from 'next/cache';

export async function createInvoiceFromContractAction(formData: FormData) {
  const orgId = String(formData.get('orgId') ?? '');
  const contractId = String(formData.get('contractId') ?? '');
  const dueAt = String(formData.get('dueAt') ?? '');
  if (!orgId || !contractId || !dueAt) return;
  await createInvoiceFromContract({ orgId, contractId, dueAt });
  revalidatePath(`/orgs/${orgId}/contracts/${contractId}`);
  revalidatePath(`/orgs/${orgId}/invoices`);
}
