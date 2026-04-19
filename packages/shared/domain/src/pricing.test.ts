import { describe, expect, it } from 'vitest';
import { type PricingSplit, PricingSplitSchema, calculateMargin } from './pricing';

describe('calculateMargin', () => {
  it('retorna margem 100% sem splits', () => {
    const r = calculateMargin(100000, []);
    expect(r.grossCents).toBe(100000);
    expect(r.totalCostCents).toBe(0);
    expect(r.netCents).toBe(100000);
    expect(r.marginPct).toBe(100);
  });

  it('calcula pct split corretamente', () => {
    const splits: PricingSplit[] = [{ kind: 'revenue_share', label: 'Sócio B', pct: 50 }];
    const r = calculateMargin(100000, splits);
    expect(r.totalCostCents).toBe(50000);
    expect(r.netCents).toBe(50000);
    expect(r.marginPct).toBe(50);
  });

  it('soma pct + amount mixados', () => {
    const splits: PricingSplit[] = [
      { kind: 'collaborator', label: 'Designer', amountCents: 20000 },
      { kind: 'tool', label: 'Figma', amountCents: 5000 },
      { kind: 'tax', label: 'Simples', pct: 6 },
    ];
    const r = calculateMargin(100000, splits);
    expect(r.totalCostCents).toBe(20000 + 5000 + 6000);
    expect(r.marginPct).toBeCloseTo(69, 0);
  });

  it('margem negativa quando custo > receita', () => {
    const splits: PricingSplit[] = [
      { kind: 'collaborator', label: 'Freela caro', amountCents: 150000 },
    ];
    const r = calculateMargin(100000, splits);
    expect(r.netCents).toBe(-50000);
    expect(r.marginPct).toBe(-50);
  });

  it('gross zero não divide por zero', () => {
    const r = calculateMargin(0, []);
    expect(r.marginPct).toBe(0);
  });

  it('breakdown preserva ordem de entrada', () => {
    const splits: PricingSplit[] = [
      { kind: 'tax', label: 'A', pct: 10 },
      { kind: 'tool', label: 'B', amountCents: 1000 },
    ];
    const r = calculateMargin(50000, splits);
    expect(r.breakdown.map((b) => b.label)).toEqual(['A', 'B']);
  });
});

describe('PricingSplitSchema', () => {
  it('aceita pct only', () => {
    expect(PricingSplitSchema.safeParse({ kind: 'tax', label: 'Simples', pct: 6 }).success).toBe(
      true,
    );
  });
  it('aceita amount only', () => {
    expect(
      PricingSplitSchema.safeParse({
        kind: 'tool',
        label: 'Figma',
        amountCents: 5000,
      }).success,
    ).toBe(true);
  });
  it('rejeita ambos preenchidos', () => {
    const r = PricingSplitSchema.safeParse({
      kind: 'tax',
      label: 'Conflito',
      pct: 10,
      amountCents: 1000,
    });
    expect(r.success).toBe(false);
  });
  it('rejeita ambos nulls', () => {
    const r = PricingSplitSchema.safeParse({ kind: 'other', label: 'Vazio' });
    expect(r.success).toBe(false);
  });
  it('rejeita pct > 100', () => {
    expect(PricingSplitSchema.safeParse({ kind: 'other', label: 'X', pct: 101 }).success).toBe(
      false,
    );
  });
  it('rejeita amount negativo', () => {
    expect(
      PricingSplitSchema.safeParse({ kind: 'other', label: 'X', amountCents: -1 }).success,
    ).toBe(false);
  });
});
