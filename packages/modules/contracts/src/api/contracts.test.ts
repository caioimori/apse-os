import { describe, expect, it } from 'vitest';
import { ContractStatusSchema, CreateContractInputSchema } from './contracts';

const ORG = '00000000-0000-0000-0000-000000000001';
const CLI = '00000000-0000-0000-0000-000000000002';

describe('contracts contracts', () => {
  it('status enum', () => {
    expect(ContractStatusSchema.safeParse('active').success).toBe(true);
    expect(ContractStatusSchema.safeParse('cancelled').success).toBe(false);
  });

  it('CreateContract input válido', () => {
    const r = CreateContractInputSchema.safeParse({
      orgId: ORG,
      clientId: CLI,
      title: 'MindLoop — Hub IA',
      monthlyValueCents: 1500000,
      startedAt: '2026-04-01',
      splits: [
        { kind: 'revenue_share', label: 'Soier', pct: 50 },
        { kind: 'tax', label: 'Simples', pct: 6 },
      ],
    });
    expect(r.success).toBe(true);
  });

  it('rejeita monthly_value negativo', () => {
    const r = CreateContractInputSchema.safeParse({
      orgId: ORG,
      clientId: CLI,
      title: 'X',
      monthlyValueCents: -1,
      startedAt: '2026-04-01',
      splits: [],
    });
    expect(r.success).toBe(false);
  });

  it('rejeita > 20 splits', () => {
    const splits = Array.from({ length: 21 }, (_, i) => ({
      kind: 'other' as const,
      label: `s${i}`,
      pct: 1,
    }));
    const r = CreateContractInputSchema.safeParse({
      orgId: ORG,
      clientId: CLI,
      title: 'X',
      monthlyValueCents: 100,
      startedAt: '2026-01-01',
      splits,
    });
    expect(r.success).toBe(false);
  });

  it('rejeita split com pct e amount juntos', () => {
    const r = CreateContractInputSchema.safeParse({
      orgId: ORG,
      clientId: CLI,
      title: 'X',
      monthlyValueCents: 100,
      startedAt: '2026-01-01',
      splits: [{ kind: 'other', label: 'x', pct: 10, amountCents: 1 }],
    });
    expect(r.success).toBe(false);
  });
});
