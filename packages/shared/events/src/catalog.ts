import { z } from 'zod';
import type { DomainEvent } from './index';

export const ContractCreatedPayload = z.object({
  contractId: z.string().uuid(),
  clientId: z.string().uuid(),
});
export type ContractCreatedEvent = DomainEvent<
  'contract.created',
  z.infer<typeof ContractCreatedPayload>
>;

export const InvoicePaidPayload = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number(),
  paidAt: z.string(),
});
export type InvoicePaidEvent = DomainEvent<'invoice.paid', z.infer<typeof InvoicePaidPayload>>;

export const OrgCreatedPayload = z.object({
  orgId: z.string().uuid(),
  ownerId: z.string().uuid(),
});
export type OrgCreatedEvent = DomainEvent<'org.created', z.infer<typeof OrgCreatedPayload>>;
