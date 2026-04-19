# ApseOS — Regras locais (complementam SINAPSE globais)

## Claude Max, NUNCA API
- Zero `@anthropic-ai/sdk` em qualquer `package.json`
- Zero `ANTHROPIC_API_KEY` em qualquer `.env*`
- `packages/integrations/claude/production.ts` fica vazio
- Ver `docs/strategy/decisao-claude-max-nao-api.md`

## Modular Monolith
- Módulos em `packages/modules/{nome}`
- API pública só via `api/index.ts` + `contracts.ts`
- Cross-module via `@apse/modules-X/api` OU event bus (nunca `@apse/modules-X/domain`)
- Dependency-cruiser valida no CI

## Localhost-first
- Supabase local via Docker é default em dev
- Toda integration tem `mock.ts` antes de qualquer real
- Swap via flag `APSE_{SERVICE}_MODE=mock|sandbox|production`

## RLS obrigatório
- Toda tabela tem `org_id` + RLS policy desde migration 0001
- Zero exceção, sem "depois fazemos"

## Safe Collaboration
Seguir regras globais SINAPSE. Resumo:
- Branch `caio/feat/*` ou `soier/feat/*`
- PR com review cruzado
- Conventional commits
- Secret scan antes de commit
- Agente faz todo git — usuário nunca roda comando
