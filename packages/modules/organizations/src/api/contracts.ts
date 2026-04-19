import { z } from 'zod';

export const MemberRoleSchema = z.enum(['owner', 'admin', 'member']);
export type MemberRole = z.infer<typeof MemberRoleSchema>;

export const OrgSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
});
export type Org = z.infer<typeof OrgSchema>;

export const OrgWithRoleSchema = OrgSchema.extend({
  role: MemberRoleSchema,
});
export type OrgWithRole = z.infer<typeof OrgWithRoleSchema>;

export const CreateOrgInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'slug deve ser minúsculo, números e hífen'),
});
export type CreateOrgInput = z.infer<typeof CreateOrgInputSchema>;

export const InviteMemberInputSchema = z.object({
  orgId: z.string().uuid(),
  email: z.string().email(),
  role: MemberRoleSchema.exclude(['owner']).default('member'),
});
export type InviteMemberInput = z.infer<typeof InviteMemberInputSchema>;
