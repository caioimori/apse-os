import { PricingSplitSchema, SplitKindSchema } from '@apse/shared-domain';
import { z } from 'zod';

export { SplitKindSchema };
export type SplitKind = z.infer<typeof SplitKindSchema>;

export const ContractStatusSchema = z.enum(['active', 'paused', 'ended']);
export type ContractStatus = z.infer<typeof ContractStatusSchema>;

export const ContractSplitSchema = z.object({
  id: z.string().uuid(),
  contractId: z.string().uuid(),
  kind: SplitKindSchema,
  label: z.string(),
  pct: z.number().nullable(),
  amountCents: z.number().nullable(),
  orderIdx: z.number().int(),
});
export type ContractSplit = z.infer<typeof ContractSplitSchema>;

export const ContractSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string(),
  monthlyValueCents: z.number().int().nonnegative(),
  currency: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  status: ContractStatusSchema,
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Contract = z.infer<typeof ContractSchema>;

export const ContractWithSplitsSchema = ContractSchema.extend({
  splits: z.array(ContractSplitSchema),
});
export type ContractWithSplits = z.infer<typeof ContractWithSplitsSchema>;

export const CreateContractInputSchema = z.object({
  orgId: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string().min(2).max(200),
  monthlyValueCents: z.number().int().nonnegative(),
  startedAt: z.string(),
  notes: z.string().optional(),
  splits: z.array(PricingSplitSchema).max(20),
});
export type CreateContractInput = z.infer<typeof CreateContractInputSchema>;

export const EndContractInputSchema = z.object({
  id: z.string().uuid(),
  endedAt: z.string(),
});
export type EndContractInput = z.infer<typeof EndContractInputSchema>;
