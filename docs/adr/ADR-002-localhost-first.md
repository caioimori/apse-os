---
id: ADR-002
title: Localhost-first com mocks determinísticos
status: accepted
date: 2026-04-18
deciders: Caio Imori, Matheus Soier
---

# ADR-002 — Localhost-first

## Contexto
Dev depender de Asaas sandbox, Supabase cloud, Resend live pra subir o projeto = friction enorme. Bugs aparecem só em staging. Onboarding de novo dev é pesadelo.

## Decisão
**Tudo roda localhost por default.** Integrações externas começam em `mock.ts` determinístico. Swap pra sandbox/produção via flag de env.

### Arquitetura
- Supabase local via Docker (`supabase start`)
- Cada integration: `mock.ts` (default), `sandbox.ts`, `production.ts`
- Factory em `index.ts` resolve por flag `APSE_{SERVICE}_MODE=mock|sandbox|production`
- Módulo de negócio importa SÓ via factory — nunca adapter direto
- Mocks SÃO CÓDIGO DE PRODUÇÃO: testados, versionados, review obrigatório

### Flags (env)
```
APSE_ASAAS_MODE=mock
APSE_RESEND_MODE=mock
APSE_CLAUDE_MODE=mock          # sempre mock no MVP (ver ADR-003)
APSE_SONAR_MODE=mock
APSE_PIPEDRIVE_MODE=mock
```

### Gate de swap
Antes de trocar `mock → sandbox`: E2E Playwright completo tem que passar com mock.

## Alternativas consideradas
- **MSW/nock only:** mock no nível HTTP; quebra a abstração port/adapter
- **Supabase cloud sempre:** custo de onboarding + dependência de rede
- **Staging shared:** race conditions entre devs

## Consequências
### Positivas
- `pnpm dev` funciona offline
- Dev novo sobe projeto em < 10min
- Testes E2E são determinísticos (mock controla tempo)
- Swap pra prod é trivial (flag only)

### Negativas
- Dois caminhos pra manter (mock + real) — amortizado por port comum
- Mock pode divergir da API real → mitigação: contract tests contra sandbox semanal (pós-Passo 9)

## Referências
- `docs/architecture/plano-modularizacao-localhost-first.md`
- ADR-004 (hexagonal)
