'use server';

import { archiveClient, updateClient } from '@apse/modules-clients/api';

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateClientAction(input: {
  id: string;
  email?: string | undefined;
  phone?: string | undefined;
  notes?: string | undefined;
}): Promise<ActionResult> {
  try {
    await updateClient(input);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    return { ok: false, error: 'Erro desconhecido' };
  }
}

export async function archiveClientAction(id: string): Promise<ActionResult> {
  try {
    await archiveClient(id);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    return { ok: false, error: 'Erro desconhecido' };
  }
}
