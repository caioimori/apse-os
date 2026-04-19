import type { ResendPort } from './port';

const sent: Array<{ id: string; at: string; to: string | string[]; subject: string }> = [];

export function createMockResend(): ResendPort {
  return {
    mode: 'mock',
    async send(msg) {
      const id = `mock_mail_${Date.now().toString(36)}`;
      sent.push({ id, at: new Date().toISOString(), to: msg.to, subject: msg.subject });
      console.warn(`[resend:mock] ${id} → ${String(msg.to)}: ${msg.subject}`);
      return { id };
    },
  };
}

export function readMockInbox() {
  return sent.slice();
}
