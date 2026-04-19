import { z } from 'zod';

export const SplitKindSchema = z.enum(['revenue_share', 'collaborator', 'tool', 'tax', 'other']);
export type SplitKind = z.infer<typeof SplitKindSchema>;

export const PricingSplitSchema = z
  .object({
    kind: SplitKindSchema,
    label: z.string().min(1),
    pct: z.number().min(0).max(100).nullable().optional(),
    amountCents: z.number().int().min(0).nullable().optional(),
  })
  .refine(
    (s) => (s.pct != null) !== (s.amountCents != null),
    'split: informar pct OU amountCents (exatamente um)',
  );
export type PricingSplit = z.infer<typeof PricingSplitSchema>;

export type MarginResult = {
  grossCents: number;
  totalCostCents: number;
  netCents: number;
  marginPct: number;
  breakdown: Array<{ label: string; kind: SplitKind; costCents: number }>;
};

export function calculateMargin(grossCents: number, splits: readonly PricingSplit[]): MarginResult {
  const breakdown = splits.map((s) => {
    const costCents =
      s.amountCents != null ? s.amountCents : Math.round((grossCents * (s.pct ?? 0)) / 100);
    return { label: s.label, kind: s.kind, costCents };
  });
  const totalCostCents = breakdown.reduce((a, b) => a + b.costCents, 0);
  const netCents = grossCents - totalCostCents;
  const marginPct = grossCents === 0 ? 0 : (netCents / grossCents) * 100;
  return { grossCents, totalCostCents, netCents, marginPct, breakdown };
}
