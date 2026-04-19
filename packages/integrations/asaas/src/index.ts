import { createMockAsaas } from './mock';
import type { AsaasPort } from './port';
import { createProductionAsaas } from './production';
import { createSandboxAsaas } from './sandbox';

export type { AsaasPort, Charge, ChargeInput, WebhookPayload } from './port';

export function asaas(): AsaasPort {
  const mode = (process.env.APSE_ASAAS_MODE ?? 'mock') as 'mock' | 'sandbox' | 'production';
  switch (mode) {
    case 'mock':
      return createMockAsaas();
    case 'sandbox':
      return createSandboxAsaas();
    case 'production':
      return createProductionAsaas();
    default:
      throw new Error(`APSE_ASAAS_MODE inválido: ${mode}`);
  }
}
