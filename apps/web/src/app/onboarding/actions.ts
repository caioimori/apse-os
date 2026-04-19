'use server';

import { createOrg } from '@apse/modules-organizations/api';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function createOrgAction(input: {
  name: string;
  slug: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const org = await createOrg(input);
    return { ok: true, data: { id: org.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { ok: false, error: message };
  }
}
