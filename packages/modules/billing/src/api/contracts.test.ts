import { describe, expect, it } from 'vitest';
import {
  CreateInvoiceFromContractInputSchema,
  InvoiceStatusSchema,
  MarkPaidInputSchema,
} from './contracts';

const ORG = '00000000-0000-0000-0000-000000000001';
const CID = '00000000-0000-0000-0000-000000000002';

describe('billing contracts', () => {
  it.each(['pending', 'paid', 'overdue', 'cancelled'] as const)('status %s', (s) => {
    expect(InvoiceStatusSchema.safeParse(s).success).toBe(true);
  });

  it('CreateInvoiceFromContract input válido', () => {
    const r = CreateInvoiceFromContractInputSchema.safeParse({
      orgId: ORG,
      contractId: CID,
      dueAt: '2026-05-01',
    });
    expect(r.success).toBe(true);
  });

  it('rejeita uuid inválido', () => {
    const r = CreateInvoiceFromContractInputSchema.safeParse({
      orgId: 'x',
      contractId: CID,
      dueAt: '2026-05-01',
    });
    expect(r.success).toBe(false);
  });

  it('MarkPaid aceita só id', () => {
    const r = MarkPaidInputSchema.safeParse({ id: CID });
    expect(r.success).toBe(true);
  });
});
