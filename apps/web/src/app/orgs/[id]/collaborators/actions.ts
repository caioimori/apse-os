'use server';

import { createCollaborator } from '@apse/modules-collaborators/api';
import { revalidatePath } from 'next/cache';

export async function createCollaboratorAction(formData: FormData) {
  const orgId = String(formData.get('orgId') ?? '');
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '') || undefined;
  const pixKey = String(formData.get('pixKey') ?? '') || undefined;
  if (!orgId || !name) return;
  await createCollaborator({ orgId, name, email, pixKey });
  revalidatePath(`/orgs/${orgId}/collaborators`);
}
