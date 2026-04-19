import type { AsaasPort } from './port';

export function createProductionAsaas(): AsaasPort {
  throw new Error('Asaas production adapter bloqueado até migração localhost→sandbox→prod.');
}
