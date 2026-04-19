import { z } from 'zod';

export const ClientKindSchema = z.enum(['PF', 'PJ']);
export type ClientKind = z.infer<typeof ClientKindSchema>;

export const ClientStatusSchema = z.enum(['active', 'inactive', 'archived']);
export type ClientStatus = z.infer<typeof ClientStatusSchema>;

const onlyDigits = (s: string) => s.replace(/\D/g, '');

export const DocumentSchema = z
  .string()
  .transform(onlyDigits)
  .refine((d) => d.length === 11 || d.length === 14, {
    message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)',
  });

export const OptionalDocumentSchema = z
  .string()
  .optional()
  .transform((s) => (s ? onlyDigits(s) : undefined))
  .refine((d) => !d || d.length === 11 || d.length === 14, {
    message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)',
  });

export const ClientSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  kind: ClientKindSchema,
  name: z.string(),
  document: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  notes: z.string().nullable(),
  status: ClientStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientInputSchema = z.object({
  orgId: z.string().uuid(),
  kind: ClientKindSchema,
  name: z.string().min(2).max(200),
  document: OptionalDocumentSchema,
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  phone: z
    .string()
    .max(32)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  notes: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});
export type CreateClientInput = z.infer<typeof CreateClientInputSchema>;

export const UpdateClientInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(200).optional(),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  phone: z
    .string()
    .max(32)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  notes: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  status: ClientStatusSchema.optional(),
});
export type UpdateClientInput = z.infer<typeof UpdateClientInputSchema>;

export const ListClientsQuerySchema = z.object({
  orgId: z.string().uuid(),
  status: z.array(ClientStatusSchema).default(['active']),
  search: z.string().optional(),
});
export type ListClientsQuery = z.infer<typeof ListClientsQuerySchema>;
