import type { CrmPort } from '@apse/integrations-sonar/port';

// Pipedrive compartilha o CrmPort do sonar. Mock reusa a mesma shape.
export function pipedrive(): CrmPort {
  const mode = (process.env.APSE_PIPEDRIVE_MODE ?? 'mock') as 'mock' | 'sandbox' | 'production';
  if (mode === 'mock') {
    return {
      provider: 'pipedrive',
      mode: 'mock',
      async listLeads() {
        return [];
      },
      async listWon() {
        return [];
      },
    };
  }
  throw new Error(`Pipedrive ${mode} adapter não implementado.`);
}
