import { describe, expect, it } from 'vitest';
import { CreateCollaboratorInputSchema, RecordPaymentInputSchema } from './contracts';

const ORG = '00000000-0000-0000-0000-000000000001';
const CID = '00000000-0000-0000-0000-000000000002';

describe('collaborators contracts', () => {
  it('CreateCollaborator aceita mínimo', () => {
    expect(CreateCollaboratorInputSchema.safeParse({ orgId: ORG, name: 'Soier' }).success).toBe(
      true,
    );
  });
  it('rejeita nome curto', () => {
    expect(CreateCollaboratorInputSchema.safeParse({ orgId: ORG, name: 'A' }).success).toBe(false);
  });
  it('RecordPayment aceita input completo', () => {
    const r = RecordPaymentInputSchema.safeParse({
      orgId: ORG,
      collaboratorId: CID,
      amountCents: 50000,
      referenceMonth: '2026-04-01',
    });
    expect(r.success).toBe(true);
  });
  it('RecordPayment rejeita amount negativo', () => {
    const r = RecordPaymentInputSchema.safeParse({
      orgId: ORG,
      collaboratorId: CID,
      amountCents: -1,
      referenceMonth: '2026-04-01',
    });
    expect(r.success).toBe(false);
  });
});
