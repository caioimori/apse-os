---
type: index
title: Stories index
---

# Stories

> **Reset 2026-04-19.** Stories v0.1 arquivadas junto com o código na tag git `v0.1-mvp-localhost`.
> Motivo: `docs/adr/ADR-007-reset-v2-design-first.md`. Direção do rebuild: `docs/design/DESIGN_BRIEF.md`.

Convenção: `{epicNum}.{storyNum}.{slug}.md`. Status: `Draft → Ready → InProgress → InReview → Done`.

---

## v2 — rebuild design-first

Ordem rígida: **shell visual → primitivos polidos → features**. Stories criadas no início de cada fase.

### Fase A — Fundação visual
- `A.1.app-shell.md` (próxima)

### Fase B — Primitivos financeiros polidos
- `B.1.financial-primitives.md`
- `B.2.data-table-empty-states.md`

### Fase C — Reconstrução incremental das features
- `C1` Auth + organizations
- `C2` Clients CRUD
- `C3` Contracts + splits + margin
- `C4` Billing + Asaas mock
- `C5` Collaborators + payable
- `C6` Dashboard
- `C7` Integrações mock

---

## Histórico v0.1 (arquivada)

Stories entregues e depois substituídas pelo reset. Preservadas em `git checkout v0.1-mvp-localhost`:

| ID | Título | Status | PR |
|---|---|---|---|
| 0.1 | Bootstrap monorepo | archived | #1 |
| 2.1 | Auth + organizations | archived | #1 |
| 3.1 | Clients CRUD | archived | #3 |
| 4.1 | Contracts + splits + margin | archived | #4 |
| 5.1 | Billing + Asaas mock | archived | #5 |
| 6.1 | Collaborators + payable | archived | #6 |
| 7.1 | Dashboard | archived | #7 |
| 10-12 | Integrações mock | archived | #8 |

Serviram de prova-de-conceito funcional. UX rejeitada. Schema do banco sobreviveu intacto.
