import { z } from 'zod';

export const CollaboratorSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  document: z.string().nullable(),
  pixKey: z.string().nullable(),
  notes: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Collaborator = z.infer<typeof CollaboratorSchema>;

export const CreateCollaboratorInputSchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(2).max(200),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  phone: z.string().optional(),
  document: z.string().optional(),
  pixKey: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateCollaboratorInput = z.infer<typeof CreateCollaboratorInputSchema>;

export const RecordPaymentInputSchema = z.object({
  orgId: z.string().uuid(),
  collaboratorId: z.string().uuid(),
  contractId: z.string().uuid().optional(),
  amountCents: z.number().int().nonnegative(),
  referenceMonth: z.string(),
  notes: z.string().optional(),
});
export type RecordPaymentInput = z.infer<typeof RecordPaymentInputSchema>;

export const PayablePreviewSchema = z.object({
  label: z.string(),
  matchedCollaboratorId: z.string().uuid().nullable(),
  contractId: z.string().uuid(),
  contractTitle: z.string(),
  amountCents: z.number().int(),
});
export type PayablePreview = z.infer<typeof PayablePreviewSchema>;
