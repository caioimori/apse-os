import type { AsaasPort } from './port';

export function createSandboxAsaas(): AsaasPort {
  throw new Error(
    'Asaas sandbox adapter não implementado — Story 9.1. Configure APSE_ASAAS_MODE=mock por enquanto.',
  );
}
