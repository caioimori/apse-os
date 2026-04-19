# packages/

Todo código compartilhado e modular do ApseOS vive aqui.

## Organização

```
packages/
├── shared/          ← infraestrutura reutilizável (db, auth, ui, domain puro)
├── modules/         ← módulos de negócio (clients, contracts, billing, etc.)
└── integrations/    ← adapters pra serviços externos (asaas, claude, etc.)
```

## Regras de dependência

| De → Para | Permitido? |
|---|---|
| `modules/X` → `shared/*` | ✅ |
| `modules/X` → `integrations/*` (via factory) | ✅ |
| `modules/X` → `modules/Y/api` (import da API pública) | ✅ |
| `modules/X` → `modules/Y/domain` (import interno) | ❌ **PROIBIDO** |
| `shared/X` → `modules/*` | ❌ **PROIBIDO** (shared não conhece módulos) |
| `integrations/X` → `modules/*` | ❌ **PROIBIDO** (integrations não conhece módulos) |

Dependency-cruiser valida no CI.

## Estrutura padrão de módulo

```
modules/{nome}/
├── api/             ← API pública (ÚNICA forma de outros módulos usarem este)
│   └── index.ts
├── application/     ← use cases / services
├── domain/          ← lógica de negócio pura
├── infra/           ← repos Supabase, adapters locais
├── ui/              ← componentes React do módulo
├── events/          ← eventos emitidos e consumidos
├── contracts.ts     ← schemas Zod da API pública
└── package.json
```

**Arquivos públicos:** `api/`, `contracts.ts`, `events/`. Resto é privado.

## Estrutura padrão de integration

```
integrations/{nome}/
├── port.ts          ← interface comum (contrato)
├── mock.ts          ← fake determinístico (default pra localhost)
├── sandbox.ts       ← integração homologação
├── production.ts    ← integração prod
├── index.ts         ← factory escolhe adapter via flag APSE_{SERVICE}_MODE
└── package.json
```

**Módulo de negócio NUNCA importa adapter direto — só `index.ts` (factory).**

## Estrutura padrão de shared

Cada shared é um package independente e estável. Se mudar muito, vira módulo.

```
shared/{nome}/
├── src/
│   └── index.ts     ← API pública
└── package.json
```
