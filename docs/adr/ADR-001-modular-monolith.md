---
id: ADR-001
title: Modular Monolith como arquitetura primária
status: accepted
date: 2026-04-18
deciders: Caio Imori, Matheus Soier
---

# ADR-001 — Modular Monolith

## Contexto
ApseOS começa 2-founders, deploy Vercel, 1 banco Supabase. Microservices seriam over-engineering. Mas código monolítico spaghetti mata o projeto em 6 meses.

## Decisão
**Modular Monolith** com fronteiras duras enforçadas por tooling.

### Regras
1. Cada módulo vive em `packages/modules/{nome}/`
2. Módulo expõe APENAS `api/index.ts` + `contracts.ts` (types públicos)
3. Cross-module import SÓ via `@apse/modules-X/api` ou event bus
4. Proibido: `@apse/modules-X/domain`, `@apse/modules-X/db`, `@apse/modules-X/internal`
5. `shared/` é pra cross-cutting (db, auth, ui, domain puro) — não é módulo de negócio
6. `integrations/` é hexagonal (ver ADR-004)

### Enforcement (CI bloqueia)
- **dependency-cruiser** com regra `no-cross-module-internal`
- **ESLint** boundary plugin
- **Biome** import ordering
- Violação em CI = build vermelho = PR bloqueado

## Alternativas consideradas
- **Microservices:** deploy/observability cost > benefit com 2 devs
- **Monolito flat:** rápido no início, impossível refatorar depois
- **DDD com bounded contexts separados em repos:** overhead de sync

## Consequências
### Positivas
- Refactor → extração pra serviço quando escalar é trivial
- Fronteiras forçadas = código testável e ownership claro
- Deploy único = ops simples

### Negativas
- Curva inicial: dev precisa entender boundaries antes de codar
- Tentação de violar boundary em "quick fix" — por isso CI enforça

## Referências
- `docs/architecture/plano-modularizacao-localhost-first.md`
- `docs/architecture/module-boundaries.md`
