# ApseOS — Contexto Claude Code

## Projeto em 1 linha
A camada financeira das agências brasileiras. SaaS que conecta CRM (Sonar/Pipedrive) + gateway (Asaas) e mostra **lucro real por cliente em tempo real**.

## Status atual
Fase de planejamento completa. Código ainda não escrito. **Esta sessão executa o build do zero.**

## Founders
- **Caio Imori** — estratégia + autoridade + noites solo de código
- **Matheus Soier** — dev/devops principal

## Cliente zero
SINAPSE empresa (dogfood). Caio e Soier usam no próprio negócio antes de vender pra outros.

---

## Documentos fonte-de-verdade (LEIA ANTES de codar)

1. `docs/strategy/apse-os-decisao.md` — decisão estratégica (pricing, ICP, Epic 1)
2. `docs/strategy/decisao-claude-max-nao-api.md` — **REGRA NON-NEGOTIABLE sobre Claude**
3. `docs/architecture/plano-modularizacao-localhost-first.md` — plano de execução completo (12 passos)
4. `docs/ROADMAP.md` — checklist acionável passo-a-passo

---

## Regras NON-NEGOTIABLE

### 1. Modular Monolith
- Módulos em `packages/modules/{nome}/`
- Nenhum módulo importa de outro diretamente
- Comunicação SÓ via `@apse/modules-X/api` (sync) ou event bus (async)
- ESLint + dependency-cruiser bloqueiam violação no CI

### 2. Localhost-first
- Tudo roda com Supabase local (Docker) + mocks pras integrações externas
- Swap mock → sandbox → production via flag `APSE_{SERVICE}_MODE` em `.env.local`
- Módulo de negócio NUNCA importa adapter direto — só factory

### 3. Claude Max, NUNCA API paga (ver `docs/strategy/decisao-claude-max-nao-api.md`)
- Zero `@anthropic-ai/sdk`
- Zero `ANTHROPIC_API_KEY` em qualquer `.env*`
- `packages/integrations/claude/production.ts` fica VAZIO no MVP
- Features AI são mock-only. Reavalia gateway quando tiver R$ 10k MRR.

### 4. Hexagonal nas integrações
Cada `packages/integrations/{nome}/`:
```
port.ts         ← interface comum (contrato)
mock.ts         ← fixture/fake determinístico (default)
sandbox.ts      ← integração homologação
production.ts   ← integração prod
index.ts        ← factory resolve via flag
```

### 5. RLS multi-tenant
Toda tabela tem `org_id` + RLS policy desde a PRIMEIRA migration. Zero exceção.

### 6. Safe Collaboration (regras globais SINAPSE)
- Nunca push direto em main
- PRs com review cruzado Caio ↔ Soier
- Conventional commits + scope
- Auto-branch, auto-sync, secret scan antes de commit

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next 15 + React 19 + Tailwind v4 + shadcn/ui |
| Auth & DB | Supabase (Postgres + Auth + RLS) — local via Docker primeiro |
| Cobrança | Asaas (mock → sandbox → prod) |
| Email | Resend (mock → prod) |
| IA | **Claude Max via Claude Code CLI** (nunca API) |
| Observability | Sentry + PostHog |
| Deploy | Vercel |
| Lint/Format | Biome |
| Test | Vitest + Playwright |

---

## Estrutura

```
ApseOS/
├── apps/
│   └── web/                           ← Next 15 (criado via pnpm create next-app)
├── packages/
│   ├── shared/
│   │   ├── db/                        ← supabase client + types gerados
│   │   ├── domain/                    ← lógica pura (pricing, billing calc, margem)
│   │   ├── ui/                        ← shadcn + componentes cross-módulo
│   │   ├── auth/                      ← wrapper Supabase Auth
│   │   ├── events/                    ← event bus in-process
│   │   ├── flags/                     ← feature flags
│   │   └── config/                    ← config/env validation (Zod)
│   ├── modules/
│   │   ├── organizations/             ← orgs + members (multi-tenant)
│   │   ├── clients/                   ← clientes (PF/PJ)
│   │   ├── contracts/                 ← contratos + splits + costs
│   │   ├── billing/                   ← invoices + transactions (usa integration asaas)
│   │   ├── collaborators/             ← colaboradores + payments
│   │   └── dashboard/                 ← views + métricas
│   └── integrations/
│       ├── asaas/                     ← port + mock + sandbox + production
│       ├── claude/                    ← port + mock APENAS (ver regra 3)
│       ├── resend/
│       ├── sonar/                     ← CRM integration
│       └── pipedrive/                 ← CRM integration
├── supabase/
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/                      ← contract tests entre módulos
│   └── e2e/                           ← Playwright
├── docs/
│   ├── strategy/                      ← decisões estratégicas
│   ├── architecture/                  ← plano de modularização, ADRs
│   ├── prd/
│   ├── stories/
│   ├── runbooks/
│   ├── adr/                           ← architecture decision records
│   └── ROADMAP.md                     ← checklist acionável
└── .claude/
    └── rules/
```

---

## Bootstrap — 3 comandos

**Pré-requisito:** Docker Desktop aberto.

```bash
# 1. Init git + pnpm (dentro de ApseOS/)
git init && pnpm init --yes

# 2. Next 15 em apps/web
cd apps/web && pnpm create next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --yes && cd ../..

# 3. Supabase local
supabase init && supabase start
```

Depois ver `docs/ROADMAP.md` → Passo 1.

---

## Delegation (regras SINAPSE)

Esta é uma sessão de **build**. Siga as regras globais em `~/.claude/rules/`:

- Orchestrator (Imperator) **delega** pra specialistas (`@developer`, `@data-engineer`, `@architect`, `@qa`, `@devops`)
- Story-first: cada entrega tem story em `docs/stories/` com AC + scope + status ≥ Ready
- Safe Collaboration: agent faz todo git; usuário nunca toca terminal

---

## Checkpoint de contexto

Ao abrir esta sessão:
1. Ler este `CLAUDE.md`
2. Ler `docs/strategy/apse-os-decisao.md` (fonte-de-verdade do produto)
3. Ler `docs/strategy/decisao-claude-max-nao-api.md` (regra crítica)
4. Ler `docs/architecture/plano-modularizacao-localhost-first.md` (plano técnico)
5. Abrir `docs/ROADMAP.md` e começar pelo primeiro item não-concluído
