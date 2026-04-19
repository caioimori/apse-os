---
type: architecture
title: Event Bus — contrato e catálogo
status: active
date: 2026-04-18
---

# Event Bus

Comunicação assíncrona in-process entre módulos. Ver ADR-001 e `module-boundaries.md`.

## Implementação
- **MVP:** event bus in-process (`packages/shared/events/`)
- **Pós-MVP (quando escalar):** mesmo contrato, backend Postgres LISTEN/NOTIFY ou Inngest
- Módulos NUNCA sabem qual backend está ativo

## Contrato base

```ts
// packages/shared/events/types.ts
export type DomainEvent<T extends string, P> = {
  id: string;              // uuid
  type: T;                 // "invoice.paid"
  orgId: string;           // tenant obrigatório
  payload: P;
  occurredAt: string;      // ISO
  version: number;         // schema version
};

export type Handler<E extends DomainEvent<any, any>> =
  (event: E) => Promise<void>;

export function emit<E extends DomainEvent<any, any>>(e: E): Promise<void>;
export function on<E extends DomainEvent<any, any>>(
  type: E['type'],
  handler: Handler<E>
): () => void; // unsubscribe
```

## Regras

1. **org_id é obrigatório** em todo evento (tenant isolation)
2. **Payload é zod-validated** no emit e no handler
3. **Idempotência** — handler deve tolerar replay (use `id` pra dedupe se preciso)
4. **Sem throw entre handlers** — erro em handler A não afeta B
5. **Versionamento** — mudança breaking em payload = `version: 2` + handlers old-version enquanto migra

## Catálogo de eventos MVP

| Evento | Emitter | Subscribers | Payload (resumido) |
|--------|---------|-------------|--------------------|
| `contract.created` | contracts | billing, dashboard | `{ contractId, clientId, splits }` |
| `contract.updated` | contracts | billing, dashboard | `{ contractId, changes }` |
| `invoice.created` | billing | dashboard | `{ invoiceId, contractId, amount, dueDate }` |
| `invoice.paid` | billing | collaborators, dashboard | `{ invoiceId, amount, paidAt }` |
| `invoice.overdue` | billing | dashboard, email | `{ invoiceId, daysOverdue }` |
| `collaborator.paid` | collaborators | dashboard, email | `{ collaboratorId, amount, invoiceId }` |
| `cost.recorded` | contracts | billing, dashboard | `{ contractId, amount, category }` |
| `org.created` | organizations | — | `{ orgId, ownerId }` |
| `member.invited` | organizations | email | `{ orgId, email, role }` |

Schemas completos em `packages/shared/events/catalog.ts`.

## Desenvolvimento

### Emit
```ts
// em modules-billing
import { emit } from '@apse/shared-events';
import { InvoicePaidEvent } from '@apse/shared-events/catalog';

await emit<InvoicePaidEvent>({
  id: crypto.randomUUID(),
  type: 'invoice.paid',
  orgId,
  payload: { invoiceId, amount, paidAt: new Date().toISOString() },
  occurredAt: new Date().toISOString(),
  version: 1,
});
```

### Subscribe
```ts
// em modules-collaborators/src/events/subscribes.ts
import { on } from '@apse/shared-events';

export function registerSubscribers() {
  on('invoice.paid', async (e) => {
    await markPayableForCollaborators(e.orgId, e.payload.invoiceId);
  });
}
```

Registro dos subscribers acontece em `apps/web/src/app/bootstrap.ts`.

## Testes
- **Emit test:** mock bus; asserciona payload e type
- **Subscribe test:** dispara evento sintético; asserciona efeito
- **E2E:** fluxo real cria invoice, paga, verifica `collaborator_payments` row

## Anti-padrões (proibido)
- Emitir evento sem `org_id`
- Handler que retorna dado pro emitter (use query síncrona via API)
- Encadear 5+ eventos em sequência (refatora pra orquestração explícita)
- Confiar em ordem de entrega entre handlers
