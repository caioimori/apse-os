import { describe, expect, it } from 'vitest';
import {
  CreateOrgInputSchema,
  InviteMemberInputSchema,
  MemberRoleSchema,
  OrgSchema,
  OrgWithRoleSchema,
} from './contracts';

describe('organizations contracts', () => {
  describe('OrgSchema', () => {
    it('aceita shape válido', () => {
      const r = OrgSchema.safeParse({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'SINAPSE',
        slug: 'sinapse',
        createdAt: '2026-04-19T00:00:00Z',
      });
      expect(r.success).toBe(true);
    });

    it('rejeita id não-uuid', () => {
      const r = OrgSchema.safeParse({
        id: 'not-a-uuid',
        name: 'X',
        slug: 'x',
        createdAt: '2026-04-19T00:00:00Z',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('OrgWithRoleSchema', () => {
    it('requer role válida', () => {
      const r = OrgWithRoleSchema.safeParse({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'x',
        slug: 'x',
        createdAt: '2026-04-19T00:00:00Z',
        role: 'bogus',
      });
      expect(r.success).toBe(false);
    });

    it.each(['owner', 'admin', 'member'] as const)('aceita role %s', (role) => {
      const r = OrgWithRoleSchema.safeParse({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'x',
        slug: 'x',
        createdAt: '2026-04-19T00:00:00Z',
        role,
      });
      expect(r.success).toBe(true);
    });
  });

  describe('CreateOrgInputSchema', () => {
    it('aceita input válido', () => {
      const r = CreateOrgInputSchema.safeParse({ name: 'SINAPSE', slug: 'sinapse' });
      expect(r.success).toBe(true);
    });

    it('rejeita slug com maiúscula', () => {
      const r = CreateOrgInputSchema.safeParse({ name: 'X', slug: 'Sinapse' });
      expect(r.success).toBe(false);
    });

    it('rejeita slug com espaço', () => {
      const r = CreateOrgInputSchema.safeParse({ name: 'X', slug: 'foo bar' });
      expect(r.success).toBe(false);
    });

    it('rejeita nome muito curto', () => {
      const r = CreateOrgInputSchema.safeParse({ name: 'a', slug: 'ok' });
      expect(r.success).toBe(false);
    });
  });

  describe('InviteMemberInputSchema', () => {
    it('aceita email válido com role default', () => {
      const r = InviteMemberInputSchema.safeParse({
        orgId: '00000000-0000-0000-0000-000000000001',
        email: 'ana@empresa.com',
      });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.role).toBe('member');
    });

    it('rejeita role owner em invite', () => {
      const r = InviteMemberInputSchema.safeParse({
        orgId: '00000000-0000-0000-0000-000000000001',
        email: 'x@x.com',
        role: 'owner',
      });
      expect(r.success).toBe(false);
    });

    it('rejeita email inválido', () => {
      const r = InviteMemberInputSchema.safeParse({
        orgId: '00000000-0000-0000-0000-000000000001',
        email: 'not-an-email',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('MemberRoleSchema', () => {
    it.each(['owner', 'admin', 'member'] as const)('aceita %s', (role) => {
      expect(MemberRoleSchema.safeParse(role).success).toBe(true);
    });
  });
});
