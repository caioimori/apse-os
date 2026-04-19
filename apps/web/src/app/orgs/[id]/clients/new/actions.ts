'use server';

import { createClient } from '@apse/modules-clients/api';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function createClientAction(input: {
  orgId: string;
  kind: 'PF' | 'PJ';
  name: string;
  document?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  notes?: string | undefined;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const c = await createClient(input);
    return { ok: true, data: { id: c.id } };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    return { ok: false, error: 'Erro desconhecido' };
  }
}
