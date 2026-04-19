export type ChargeInput = {
  amountCents: number;
  currency: 'BRL';
  dueAt: string; // ISO date
  clientRef: { name: string; document: string | null; email: string | null };
  externalInvoiceId: string;
};

export type Charge = {
  externalId: string;
  status: 'pending' | 'paid' | 'cancelled';
  paymentUrl?: string;
};

export type WebhookPayload = {
  event: 'payment.confirmed' | 'payment.overdue' | 'payment.refunded';
  externalId: string;
  paidAt?: string;
};

export interface AsaasPort {
  mode: 'mock' | 'sandbox' | 'production';
  createCharge(input: ChargeInput): Promise<Charge>;
  getCharge(externalId: string): Promise<Charge | null>;
  cancelCharge(externalId: string): Promise<void>;
}
