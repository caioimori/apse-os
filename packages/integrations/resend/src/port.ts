export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export interface ResendPort {
  mode: 'mock' | 'sandbox' | 'production';
  send(message: EmailMessage): Promise<{ id: string }>;
}
