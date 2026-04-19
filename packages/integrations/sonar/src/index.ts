import { createMockSonar } from './mock';
import type { CrmPort } from './port';

export type { CrmLead, CrmPort } from './port';

export function sonar(): CrmPort {
  const mode = (process.env.APSE_SONAR_MODE ?? 'mock') as 'mock' | 'sandbox' | 'production';
  if (mode === 'mock') return createMockSonar();
  throw new Error(`Sonar ${mode} adapter não implementado (Story 10.x pós-MVP).`);
}
