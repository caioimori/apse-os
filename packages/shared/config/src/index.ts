import { z } from 'zod';

const Mode = z.enum(['mock', 'sandbox', 'production']).default('mock');

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  APSE_ASAAS_MODE: Mode,
  APSE_RESEND_MODE: Mode,
  APSE_CLAUDE_MODE: Mode,
  APSE_SONAR_MODE: Mode,
  APSE_PIPEDRIVE_MODE: Mode,
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function loadEnv(raw: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid env: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  const env = parsed.data;
  if (raw.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is forbidden in ApseOS MVP (ver ADR-003)');
  }
  return env;
}
