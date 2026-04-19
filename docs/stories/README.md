---
type: index
title: Stories index
---

# Stories

Convenção: `{epicNum}.{storyNum}.{slug}.md`. Status: `Draft → Ready → InProgress → InReview → Done`.

## Epic 0 — Foundation
| ID | Título | Status |
|---|---|---|
| [0.1](./0.1.bootstrap-monorepo.md) | Bootstrap monorepo + toolchain | Ready |
| [0.2](./0.2.design-system-foundation.md) | Design system foundation — componentes financeiros | Draft |

## Epic 1 — SINAPSE dogfood (MVP)
Stories criadas sob demanda antes de cada implementação (evitar docs mortas). Mapa do Roadmap:

| Passo | Story prevista | Quando criar |
|---|---|---|
| 1 | `1.1.db-seeds.md` | Antes do Passo 1 |
| 2 | `2.1.auth-organizations.md` | Antes do Passo 2 |
| 3 | `3.1.clients-crud.md` | Antes do Passo 3 |
| 4 | `4.1.contracts-pricing.md` | Antes do Passo 4 |
| 5 | `5.1.billing-mock.md` | Antes do Passo 5 |
| 6 | `6.1.collaborators.md` | Antes do Passo 6 |
| 7 | `7.1.dashboard.md` | Antes do Passo 7 |
| 8 | `8.1.qa-e2e.md` | Antes do Passo 8 |
| 9 | `9.1.asaas-sandbox-swap.md` | Antes do Passo 9 |
| 10 | `10.1.crm-integration.md` | Antes do Passo 10 |
| 11 | `11.1.email-resend.md` | Antes do Passo 11 |
| 12 | `12.1.claude-mocks.md` | Antes do Passo 12 |
| 13 | `13.1.production-deploy.md` | Antes do Passo 13 |

Cada story TEM que ter status ≥ Ready antes de código (ver `documentation-first` rule).
