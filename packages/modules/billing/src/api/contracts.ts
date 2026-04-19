import { z } from 'zod';

export const InvoiceStatusSchema = z.enum(['pending', 'paid', 'overdue', 'cancelled']);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  contractId: z.string().uuid().nullable(),
  clientId: z.string().uuid(),
  amountCents: z.number().int().nonnegative(),
  currency: z.string(),
  dueAt: z.string(),
  paidAt: z.string().nullable(),
  status: InvoiceStatusSchema,
  externalId: z.string().nullable(),
  externalProvider: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const CreateInvoiceFromContractInputSchema = z.object({
  orgId: z.string().uuid(),
  contractId: z.string().uuid(),
  dueAt: z.string(),
});
export type CreateInvoiceFromContractInput = z.infer<typeof CreateInvoiceFromContractInputSchema>;

export const MarkPaidInputSchema = z.object({
  id: z.string().uuid(),
  paidAt: z.string().optional(),
});
export type MarkPaidInput = z.infer<typeof MarkPaidInputSchema>;
