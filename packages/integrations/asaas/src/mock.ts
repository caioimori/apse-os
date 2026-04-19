import type { AsaasPort, Charge, ChargeInput } from './port';

const store = new Map<string, Charge>();

function fakeId(): string {
  return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createMockAsaas(): AsaasPort {
  return {
    mode: 'mock',
    async createCharge(input: ChargeInput): Promise<Charge> {
      const charge: Charge = {
        externalId: fakeId(),
        status: 'pending',
        paymentUrl: `https://mock.asaas.local/pay/${input.externalInvoiceId}`,
      };
      store.set(charge.externalId, charge);
      return charge;
    },
    async getCharge(externalId) {
      return store.get(externalId) ?? null;
    },
    async cancelCharge(externalId) {
      const c = store.get(externalId);
      if (c) store.set(externalId, { ...c, status: 'cancelled' });
    },
  };
}
