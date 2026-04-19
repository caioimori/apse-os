---
type: index
title: Stories index
---

# Stories

Convenção: `{epicNum}.{storyNum}.{slug}.md`. Status: `Draft → Ready → InProgress → InReview → Done`.

## Epic 0 — Foundation
| ID | Título | Status |
|---|---|---|
| [0.1](./0.1.bootstrap-monorepo.md) | Bootstrap monorepo + toolchain | **Done** |
| [0.2](./0.2.design-system-foundation.md) | Design system primitivos financeiros | Done (parcial — Money/Margin/KPIBlock/StatusPill) |

## Epic 1 — SINAPSE dogfood MVP — ENTREGUE 2026-04-19
| ID | Título | Status | PR |
|---|---|---|---|
| [2.1](./2.1.auth-organizations.md) | Auth + organizations | **Done** | #1 |
| [3.1](./3.1.clients-crud.md) | Clients CRUD | **Done** | #3 |
| [4.1](./4.1.contracts-pricing.md) | Contracts + splits + margin | **Done** | #4 |
| [5.1](./5.1.billing-mock.md) | Billing + Asaas mock | **Done** | #5 |
| [6.1](./6.1.collaborators.md) | Collaborators + payable | **Done** | #6 |
| [7.1](./7.1.dashboard.md) | Dashboard executivo | **Done** | #7 |
| [10-12](./10-11-12.integrations-claude-mocks.md) | Sonar/Pipedrive/Resend/Claude mocks | **Done** | #8 |

## Deferidos (sob demanda)
- **8.1** QA E2E Playwright — infra pronta, tests quando dogfood revelar bugs
- **9.1** Asaas sandbox swap — quando mock não bastar
- **13.1** Production deploy — após dogfood estabilizar

---

MVP localhost-complete. Próximo trabalho = bugs e gaps que aparecerem no uso real.
