# ApseOS — ROADMAP

> **Reset 2026-04-19 — v0.1 preservada na tag git `v0.1-mvp-localhost`.**
> Motivo do reset em `docs/adr/ADR-007-reset-v2-design-first.md`.
> Brief de rebuild em `docs/design/DESIGN_BRIEF.md`.

---

## Estado atual

- **Código v0.1:** deletado de `develop`, preservado na tag `v0.1-mvp-localhost`
- **Schema Supabase:** preservado (`vamtjndfjhqtyiejxnbx` em sa-east-1, 6 migrations aplicadas)
- **Documentação:** mantida e reforçada (PRD, 7 ADRs, architecture, design, stories arquivadas, runbooks)
- **Infra:** gitflow + CI + husky + hooks + rulesets intactos

---

## v2 — rebuild design-first

Segue o `DESIGN_BRIEF.md`. Ordem rígida: **fundação visual antes de feature**.

### Fase A — Fundação visual (1 PR)
- Next 15 scaffolded de novo em `apps/web` (mínimo)
- AppShell (sidebar fixa + topbar + content area)
- Tipografia + tokens do caioimori-DS aplicados com princípios do brief
- Dark mode paridade testada por screenshot
- AppLayout compartilhado em `packages/shared/ui`
- Rota `/` com estado logado (dashboard) e deslogado (landing minimalista)

**Aceite:** Caio abre localhost, vê shell profissional que parece ApseOS (não "Next+shadcn default").

### Fase B — Primitivos financeiros polidos (1 PR)
- `Money`, `Margin`, `KPIBlock` com tipografia hero e motion sutil
- `DataTable` genérica com sort/filter/pagination
- `EmptyState` opinativo
- Toast system global (sonner ou custom)
- Sheet/Drawer pra forms longos

**Aceite:** componentes prontos em `/design-system` route pra preview visual.

### Fase C — Reconstrução incremental das features
Cada story vira um PR pequeno. Schema já está no banco — módulos TS são recriados, UI usa AppShell e primitivos da Fase A/B.

Ordem sugerida (mesma sequência funcional da v0.1 mas agora visualmente digna):
- C1 — Auth + organizations (Story 2.1 rebuild)
- C2 — Clients CRUD (Story 3.1 rebuild)
- C3 — Contracts + splits + margin preview (Story 4.1 rebuild)
- C4 — Billing + Asaas mock (Story 5.1 rebuild)
- C5 — Collaborators + payable (Story 6.1 rebuild)
- C6 — Dashboard (Story 7.1 rebuild)
- C7 — Integrações mock (Stories 10-12 rebuild)

### Pós-MVP v2
- Story 8.1 — Playwright E2E
- Story 9.1 — Asaas sandbox swap
- Story 13.1 — Production deploy (Vercel)

---

## Restrições inalteradas

Todas as ADRs anteriores seguem válidas. Nenhuma decisão arquitetural foi revertida:
- Modular Monolith (ADR-001)
- Localhost-first com mocks (ADR-002)
- Claude Max CLI, zero API (ADR-003)
- Hexagonal integrations (ADR-004)
- RLS multi-tenant (ADR-005)
- Design System caioimori-DS (ADR-006, **refinado** pelo DESIGN_BRIEF)
- Reset documentado (ADR-007)

---

## Como consultar a v0.1

```bash
# Ver o código que foi removido
git checkout v0.1-mvp-localhost

# Voltar pro main/develop
git checkout develop
```

Use a v0.1 como **referência** de contratos/APIs/queries SQL que funcionaram — nunca como template de UX/UI.
