---
id: ADR-007
title: Reset v2 — rebuild design-first preservando docs e schema
status: accepted
date: 2026-04-19
deciders: Caio Imori
---

# ADR-007 — Reset v2

## Contexto
A implementação v0.1 (Stories 0.1 → 7.1 + 10-12, 9 PRs merged em `develop`, tag `v0.1-mvp-localhost`) entregou o fluxo funcional mas com UX/UI insatisfatória. Caio (2026-04-19): *"literalmente uma merda"*.

Diagnóstico completo em `docs/design/DESIGN_BRIEF.md`.

## Decisão
Resetar o código (apps/ e packages/) preservando toda a documentação, schema do banco, infra de CI/git/rules e DESIGN_BRIEF. Rebuild virá em fases (A → B → C) seguindo o brief, com AppShell e primitivos antes de qualquer feature.

### O que é DELETADO
- `apps/web/` — Next 15 app antigo
- `packages/shared/*` — ui, auth, db, domain, events, config, flags
- `packages/modules/*` — organizations, clients, contracts, billing, collaborators, dashboard
- `packages/integrations/*` — asaas, resend, sonar, pipedrive, claude

### O que é PRESERVADO
- `docs/**` — PRD, ADRs 001-007, architecture, design (incl. DESIGN_BRIEF.md), runbooks, stories, ROADMAP
- `supabase/migrations/**` — 6 migrations já aplicadas no remoto
- `.claude/rules/apseos-local.md`
- `.github/**` — workflows, templates, CODEOWNERS
- `.husky/**`, `.secretlintrc.json`, `.secretlintignore`
- `biome.json`, `.dependency-cruiser.cjs`, `tsconfig.base.json`, `.editorconfig`, `.nvmrc`, `.gitignore`
- `pnpm-workspace.yaml` — estrutura monorepo pronta pra reuso
- `package.json` (root) — scripts base
- `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`
- `.env.example`
- Tag git `v0.1-mvp-localhost` (referência executável do que funcionou)

### O que é REUTILIZADO no rebuild
- Schema Supabase (zero migrations novas necessárias pra Fase A/B)
- Tokens do design system (`docs/design/design-system.md`), mas aplicados com princípios do DESIGN_BRIEF
- ADRs 001-006 seguem válidas
- Gitflow, CI pipeline, hooks, rulesets — tudo já configurado

## Alternativas consideradas
- **Refactor incremental da v0.1:** rejeitado — o problema é de fundação (falta de AppShell, tipografia, motion). Refactor viraria reescrita parcial disfarçada.
- **Iterar só nos estilos:** rejeitado — sem shell consistente, cada página continua reinventando layout.
- **Contratar design profissional antes:** válido pós-MVP; por ora Caio lidera o design seguindo brief.

## Consequências
### Positivas
- Brief claro impede repetir os 8 erros diagnosticados
- Schema preservado = rebuild começa com DB populado (facilita iteração visual)
- Tag v0.1 é resgatável se algo específico do código foi útil
- ADRs + design system + runbooks mantêm continuidade arquitetural

### Negativas
- Retrabalho de ~9 PRs de código
- Mock de dados precisa ser recriado pra telas ganharem vida durante build
- Confiança de quem assiste (Soier futuro) pode tremer — mitigado por brief sério e tag preservada

## Referências
- `docs/design/DESIGN_BRIEF.md`
- Tag git `v0.1-mvp-localhost` — snapshot completo do código removido
- `docs/ROADMAP.md` (atualizado com Fase A/B/C)
