# ApseOS

> A camada financeira das agências brasileiras.

**One-liner:** "Conecta seu CRM (Sonar/Pipedrive/RD) e seu gateway (Asaas/Pagar.me) e mostra em tempo real quanto cada cliente está te dando de lucro."

---

## Estado atual

**Código:** ainda não escrito. Fase de planejamento completa.

**Documentação:**
- `docs/strategy/apse-os-decisao.md` — decisão estratégica consolidada (MVV, pricing, competição, Epic 1)
- `docs/strategy/tese-fintech-unicornio.md` — tese original do council
- `docs/strategy/decisao-claude-max-nao-api.md` — política de uso do Claude (Max subscription, não API)
- `docs/architecture/plano-modularizacao-localhost-first.md` — arquitetura modular + plano de execução localhost-first
- `docs/research/benchmark-auditoria-sinapse-implementa.md` — benchmark competitivo (compartilhado)

## Stack

- Next 15 + React 19 + Tailwind v4 + shadcn/ui
- Supabase (Postgres + Auth + RLS) — local via Docker primeiro
- Asaas (cobrança/pagamento) — sandbox → produção
- **Claude:** via subscription Max do Caio (Claude Code), **NUNCA API paga**. Ver `docs/strategy/decisao-claude-max-nao-api.md`.
- Resend (email)
- Sentry + Posthog
- Vercel (deploy)

## Cliente zero

SINAPSE empresa (dogfood — Caio e Soier usam no próprio negócio antes de vender pra outros).

## Founders

- Caio Imori — estratégia, autoridade, algumas noites solo de código
- Matheus Soier — dev/devops principal

## Próximos passos

Ver seção final de `docs/architecture/plano-modularizacao-localhost-first.md` — 12 passos de construção + 3 comandos de bootstrap.

**Decisões pendentes antes de começar:**
1. Nome final: ApseOS confirmado?
2. Subdomínio: `apse.sinapse.club` ou `os.sinapse.club`?
3. Soier disponível pra parear nas madrugadas?
