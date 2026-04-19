import { createMockResend } from './mock';
import type { ResendPort } from './port';

export type { ResendPort, EmailMessage } from './port';
export { readMockInbox } from './mock';

export function resend(): ResendPort {
  const mode = (process.env.APSE_RESEND_MODE ?? 'mock') as 'mock' | 'sandbox' | 'production';
  if (mode === 'mock') return createMockResend();
  throw new Error(`Resend ${mode} adapter não implementado (Story 11.x pós-MVP).`);
}
