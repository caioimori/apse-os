# ApseOS

> A camada financeira das agências brasileiras.

**One-liner:** conecta CRM (Sonar/Pipedrive) + gateway (Asaas) e mostra **lucro real por cliente em tempo real**.

---

## Estado atual — 2026-04-19

**Reset v2 em andamento.**

- v0.1 (MVP localhost funcional) preservada na tag git `v0.1-mvp-localhost`
- Motivo do reset: UX/UI v0.1 abaixo do padrão SINAPSE
- Próximo passo: rebuild design-first seguindo `docs/design/DESIGN_BRIEF.md`
- Schema Supabase intacto (projeto `vamtjndfjhqtyiejxnbx`, 6 migrations aplicadas)

## Leituras antes de codar

1. `docs/design/DESIGN_BRIEF.md` — **north star do rebuild**
2. `docs/ROADMAP.md` — Fase A (shell) → B (primitivos) → C (features)
3. `docs/prd/prd.md` — PRD MVP
4. `docs/adr/ADR-007-reset-v2-design-first.md` — decisão do reset
5. `docs/adr/ADR-001..006` — arquitetura permanece
6. `docs/architecture/module-boundaries.md` + `event-bus.md`
7. `docs/design/design-system.md` — tokens caioimori-DS
8. `CONTRIBUTING.md` — gitflow, convenções

## Stack alvo (v2)

Mesma da v0.1 — apenas a aplicação muda.

- Next 15 + React 19 + Tailwind v4
- Supabase (Auth + Postgres + RLS) — projeto remoto
- Asaas (mock → sandbox → prod via flag hexagonal)
- Resend (mock até Story pós-MVP)
- Claude via subscription Max — **nunca API paga** (ADR-003)
- Sentry + PostHog + Vercel (pós-MVP)

## Cliente zero

SINAPSE empresa. Dogfood antes de vender pra outras agências.

## Founders

- Caio Imori — estratégia + produto + algumas noites de código
- Matheus Soier — dev/devops principal

## Repo

- GitHub: https://github.com/caioimori/apse-os (público)
- Branch default: `develop`
- Proteções: PR obrigatório em `main` e `develop` via rulesets

## Como resgatar a v0.1

```bash
git checkout v0.1-mvp-localhost   # ver o código removido
git checkout develop              # voltar pra branch ativa
```
