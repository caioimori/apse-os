'use server';

import { recordPayment } from '@apse/modules-collaborators/api';
import { revalidatePath } from 'next/cache';

export async function recordPaymentAction(formData: FormData) {
  const orgId = String(formData.get('orgId') ?? '');
  const collaboratorId = String(formData.get('collaboratorId') ?? '');
  const contractId = String(formData.get('contractId') ?? '') || undefined;
  const amountCents = Number(formData.get('amountCents') ?? 0);
  const referenceMonth = String(formData.get('referenceMonth') ?? '');
  if (!orgId || !collaboratorId || !referenceMonth) return;
  await recordPayment({ orgId, collaboratorId, contractId, amountCents, referenceMonth });
  revalidatePath(`/orgs/${orgId}/payable`);
}
