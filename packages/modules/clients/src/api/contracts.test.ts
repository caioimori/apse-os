import { describe, expect, it } from 'vitest';
import {
  ClientKindSchema,
  ClientSchema,
  ClientStatusSchema,
  CreateClientInputSchema,
  DocumentSchema,
  ListClientsQuerySchema,
  UpdateClientInputSchema,
} from './contracts';

const ORG_ID = '00000000-0000-0000-0000-000000000001';
const CLIENT_ID = '00000000-0000-0000-0000-000000000002';

describe('clients contracts', () => {
  describe('ClientKindSchema', () => {
    it('aceita PF e PJ', () => {
      expect(ClientKindSchema.safeParse('PF').success).toBe(true);
      expect(ClientKindSchema.safeParse('PJ').success).toBe(true);
    });
    it('rejeita outros', () => {
      expect(ClientKindSchema.safeParse('OTHER').success).toBe(false);
    });
  });

  describe('ClientStatusSchema', () => {
    it.each(['active', 'inactive', 'archived'] as const)('aceita %s', (s) => {
      expect(ClientStatusSchema.safeParse(s).success).toBe(true);
    });
  });

  describe('DocumentSchema', () => {
    it('aceita CPF com máscara', () => {
      const r = DocumentSchema.safeParse('123.456.789-00');
      expect(r.success).toBe(true);
      if (r.success) expect(r.data).toBe('12345678900');
    });
    it('aceita CNPJ com máscara', () => {
      const r = DocumentSchema.safeParse('12.345.678/0001-90');
      expect(r.success).toBe(true);
      if (r.success) expect(r.data).toBe('12345678000190');
    });
    it('rejeita 10 dígitos', () => {
      expect(DocumentSchema.safeParse('1234567890').success).toBe(false);
    });
    it('rejeita string vazia', () => {
      expect(DocumentSchema.safeParse('').success).toBe(false);
    });
  });

  describe('CreateClientInputSchema', () => {
    it('aceita PF completo', () => {
      const r = CreateClientInputSchema.safeParse({
        orgId: ORG_ID,
        kind: 'PF',
        name: 'Ana Silva',
        document: '123.456.789-00',
        email: 'ana@empresa.com',
        phone: '+55 11 99999-0000',
        notes: 'Cliente premium',
      });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.document).toBe('12345678900');
    });
    it('aceita PJ mínimo (só nome e kind)', () => {
      const r = CreateClientInputSchema.safeParse({
        orgId: ORG_ID,
        kind: 'PJ',
        name: 'MindLoop Ltda',
      });
      expect(r.success).toBe(true);
    });
    it('aceita email string vazia como undefined', () => {
      const r = CreateClientInputSchema.safeParse({
        orgId: ORG_ID,
        kind: 'PF',
        name: 'Ana',
        email: '',
      });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.email).toBeUndefined();
    });
    it('rejeita email inválido', () => {
      const r = CreateClientInputSchema.safeParse({
        orgId: ORG_ID,
        kind: 'PF',
        name: 'Ana',
        email: 'not-an-email',
      });
      expect(r.success).toBe(false);
    });
    it('rejeita nome < 2 chars', () => {
      const r = CreateClientInputSchema.safeParse({ orgId: ORG_ID, kind: 'PF', name: 'A' });
      expect(r.success).toBe(false);
    });
    it('rejeita orgId não-uuid', () => {
      const r = CreateClientInputSchema.safeParse({ orgId: 'x', kind: 'PF', name: 'Ana' });
      expect(r.success).toBe(false);
    });
    it('rejeita documento com 10 dígitos', () => {
      const r = CreateClientInputSchema.safeParse({
        orgId: ORG_ID,
        kind: 'PF',
        name: 'Ana',
        document: '1234567890',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('UpdateClientInputSchema', () => {
    it('aceita update parcial', () => {
      const r = UpdateClientInputSchema.safeParse({ id: CLIENT_ID, name: 'Novo nome' });
      expect(r.success).toBe(true);
    });
    it('aceita mudança de status', () => {
      const r = UpdateClientInputSchema.safeParse({ id: CLIENT_ID, status: 'archived' });
      expect(r.success).toBe(true);
    });
    it('rejeita id não-uuid', () => {
      const r = UpdateClientInputSchema.safeParse({ id: 'x' });
      expect(r.success).toBe(false);
    });
  });

  describe('ListClientsQuerySchema', () => {
    it('aplica default status=[active]', () => {
      const r = ListClientsQuerySchema.safeParse({ orgId: ORG_ID });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.status).toEqual(['active']);
    });
    it('aceita múltiplos status', () => {
      const r = ListClientsQuerySchema.safeParse({
        orgId: ORG_ID,
        status: ['active', 'archived'],
      });
      expect(r.success).toBe(true);
    });
  });

  describe('ClientSchema', () => {
    it('aceita shape completo com nulls', () => {
      const r = ClientSchema.safeParse({
        id: CLIENT_ID,
        orgId: ORG_ID,
        kind: 'PJ',
        name: 'MindLoop',
        document: null,
        email: null,
        phone: null,
        notes: null,
        status: 'active',
        createdAt: '2026-04-19T00:00:00Z',
        updatedAt: '2026-04-19T00:00:00Z',
      });
      expect(r.success).toBe(true);
    });
  });
});
