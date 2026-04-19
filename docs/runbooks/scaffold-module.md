---
type: runbook
title: Scaffolding — novo módulo e nova integração
date: 2026-04-18
---

# Runbook — Scaffolding

Procedimento padrão pra criar novo módulo ou nova integração respeitando boundaries (ADR-001) e hexagonal (ADR-004).

## Novo módulo de negócio

### 1. Story primeiro
Não scaffold sem story `Ready` em `docs/stories/`. Regra `documentation-first`.

### 2. Criar estrutura
```bash
pnpm scaffold:module {nome}
# ou manualmente:
mkdir -p packages/modules/{nome}/src/{api,domain,db,events,ui}
mkdir -p packages/modules/{nome}/tests
```

### 3. `package.json`
```json
{
  "name": "@apse/modules-{nome}",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./api": "./src/api/index.ts",
    "./api/contracts": "./src/api/contracts.ts",
    "./ui": "./src/ui/index.ts"
  },
  "dependencies": {
    "@apse/shared-db": "workspace:*",
    "@apse/shared-domain": "workspace:*",
    "@apse/shared-events": "workspace:*",
    "zod": "catalog:"
  }
}
```

### 4. Arquivos mínimos

`src/api/contracts.ts`:
```ts
import { z } from 'zod';
export const {Nome}Schema = z.object({ /* ... */ });
export type {Nome} = z.infer<typeof {Nome}Schema>;
```

`src/api/index.ts`:
```ts
export * from './contracts';
// public functions: get*, list*, create*, update*, delete*
```

`src/events/emits.ts` e `src/events/subscribes.ts` conforme `event-bus.md`.

### 5. Migration
`supabase migration new create_{nome}` — ver `db-reset.md` pra checklist RLS.

### 6. Contract test
`tests/contract/{nome}.spec.ts` — valida API pública.

### 7. Atualizar `module-boundaries.md`
Adicionar módulo no grafo de dependências.

---

## Nova integração externa

### 1. Story primeiro
Ex: `X.Y.{servico}-integration.md`.

### 2. Estrutura hexagonal
```bash
mkdir -p packages/integrations/{servico}/fixtures
cd packages/integrations/{servico}
touch port.ts mock.ts sandbox.ts production.ts index.ts
```

### 3. `port.ts` — contrato
```ts
export interface {Servico}Port {
  // métodos que o domínio precisa, não o SDK externo
  createInvoice(input: CreateInvoiceInput): Promise<Invoice>;
  // ...
}
```

### 4. `mock.ts` — default
```ts
import type { {Servico}Port } from './port';
export function createMock{Servico}(): {Servico}Port {
  return {
    async createInvoice(input) {
      // determinístico, fixture-based
      return fixtures.invoice(input);
    }
  };
}
```

### 5. `sandbox.ts` e `production.ts`
Implementam mesma interface. `production.ts` pode começar vazio (throw "not implemented") — preencher só quando for trocar.

### 6. `index.ts` — factory
```ts
import type { {Servico}Port } from './port';
import { createMock{Servico} } from './mock';

export function {servico}(): {Servico}Port {
  const mode = process.env.APSE_{SERVICO}_MODE ?? 'mock';
  switch (mode) {
    case 'mock': return createMock{Servico}();
    case 'sandbox': return createSandbox{Servico}();
    case 'production': return createProduction{Servico}();
    default: throw new Error(`Unknown mode: ${mode}`);
  }
}
```

### 7. Adicionar flag em `.env.example`
```
APSE_{SERVICO}_MODE=mock
```

### 8. Contract tests
`tests/contract/integrations/{servico}.spec.ts` — roda contra mock sempre, contra sandbox em CI noturno.

---

## Regras NON-NEGOTIABLE
- Módulo nunca importa `production.ts` direto — só factory
- Fixtures do mock são versionadas (`fixtures/*.json`)
- Nomes em kebab-case no filesystem, camelCase em código
- Toda struct com `org_id` quando cruza boundary
