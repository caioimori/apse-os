'use server';

import { createContract } from '@apse/modules-contracts/api';
import type { PricingSplit } from '@apse/shared-domain';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function createContractAction(input: {
  orgId: string;
  clientId: string;
  title: string;
  monthlyValueCents: number;
  startedAt: string;
  notes?: string | undefined;
  splits: PricingSplit[];
}): Promise<ActionResult<{ id: string }>> {
  try {
    const c = await createContract(input);
    return { ok: true, data: { id: c.id } };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    return { ok: false, error: 'Erro desconhecido' };
  }
}
