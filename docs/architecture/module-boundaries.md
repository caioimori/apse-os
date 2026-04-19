---
type: architecture
title: Module Boundaries — contratos cross-module
status: active
date: 2026-04-18
---

# Module Boundaries

Complementa ADR-001. Define O QUE cada módulo expõe, O QUE importa de quem e COMO se comunicam.

## Estrutura canônica por módulo

```
packages/modules/{nome}/
├── package.json          ← name: "@apse/modules-{nome}"
├── src/
│   ├── api/              ← PÚBLICO — exports cross-module
│   │   ├── index.ts      ← re-exports nomeados
│   │   └── contracts.ts  ← types/zod schemas públicos
│   ├── domain/           ← INTERNO — lógica pura, nunca exportado
│   ├── db/               ← INTERNO — queries, repos
│   ├── events/           ← PÚBLICO via bus — emits + subscribes
│   ├── ui/               ← PÚBLICO — pages, components do módulo
│   └── index.ts          ← re-export APENAS de api/*
└── tests/
```

## Regras de import

### Permitido
```ts
// ✅ módulo A consome API pública de B
import { getContract } from '@apse/modules-contracts/api';

// ✅ consome contract (types/schemas)
import type { Contract } from '@apse/modules-contracts/api/contracts';

// ✅ subscribe a evento
import { on } from '@apse/shared-events';
on('contract.created', handler);

// ✅ shared é livre
import { z } from '@apse/shared-domain';
```

### PROIBIDO (dependency-cruiser bloqueia)
```ts
// ❌ nunca acessa interno de outro módulo
import { calculateMargin } from '@apse/modules-contracts/domain';
import { contractsRepo } from '@apse/modules-contracts/db';

// ❌ ciclo entre módulos
// modules-billing → modules-contracts → modules-billing

// ❌ integração direto no módulo
import { AsaasClient } from '@apse/integrations-asaas/production';
// use factory: import { asaas } from '@apse/integrations-asaas';
```

## Grafo de dependências permitido (MVP)

```
dashboard ──▶ billing ──▶ contracts ──▶ clients ──▶ organizations
                │            │             │            │
                ▼            ▼             ▼            ▼
            collaborators  shared/*    shared/*     shared/*
                │
                ▼
            shared/*
```

**Todos os módulos** podem importar de `packages/shared/*`.
**Nenhum módulo** importa de outro sem ser via `/api` ou evento.

## Comunicação cross-module

### Síncrona — query
Use quando: leitura, cálculo, validação imediata.
```ts
// em modules-dashboard
import { getProfitabilityByClient } from '@apse/modules-billing/api';
const margin = await getProfitabilityByClient({ orgId, clientId });
```

### Assíncrona — evento
Use quando: side effect, notificação, fan-out.
```ts
// em modules-billing (emitter)
import { emit } from '@apse/shared-events';
await emit('invoice.paid', { invoiceId, orgId, amount });

// em modules-collaborators (subscriber)
import { on } from '@apse/shared-events';
on('invoice.paid', async (e) => {
  await markPayableForCollaborators(e);
});
```

### Nunca
- Import direto de `domain/`, `db/`, `internal/` de outro módulo
- Chamar repositório de outro módulo
- Compartilhar transação DB cross-module (use event → nova tx)

## API pública — checklist

Antes de adicionar função em `api/index.ts`:
- [ ] Assinatura estável (mudança é breaking change)
- [ ] Input/output validados com zod
- [ ] Sem vazar tipos internos (ex: entidades Prisma/Supabase raw)
- [ ] Documentada com JSDoc
- [ ] Com contract test em `tests/contract/{modulo}.spec.ts`

## Contract tests

`tests/contract/` valida que API pública de cada módulo:
1. Aceita o contrato declarado
2. Retorna o contrato declarado
3. Não quebra consumidores existentes

Roda em CI a cada PR. Falha = boundary violation.

## Enforcement tooling

- **dependency-cruiser** (`.dependency-cruiser.cjs`) — grafo de imports
- **ESLint boundary plugin** — no-internal-import, no-circular
- **Biome** — import ordering/sorting
- **TypeScript project references** — compile-time isolation
- **pnpm workspace** — impede phantom dependencies

## Criar novo módulo — checklist
1. `pnpm scaffold:module {nome}` (script em Passo 0)
2. Define `api/contracts.ts` com zod schemas
3. Declara eventos em `src/events/emits.ts` + `src/events/subscribes.ts`
4. Migration com `org_id` + RLS (ADR-005)
5. Story em `docs/stories/` validada antes de codar
6. Contract test em `tests/contract/`
