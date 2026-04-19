# ApseOS — ROADMAP executável

> Checklist dos 12 passos do plano localhost-first.
> Cada passo define o que é "localhost-complete" e qual integração plugar depois.
> Detalhes completos: `docs/architecture/plano-modularizacao-localhost-first.md`

---

## Passo 0 — Bootstrap (Dia 0)

- [x] `git init` + primeiro commit
- [x] `pnpm init` + `pnpm-workspace.yaml` configurado
- [x] Next 15 em `apps/web` (scaffold manual + Tailwind v4)
- [x] Supabase **remoto** em vez de local (projeto `apse-os` em sa-east-1)
- [x] Biome + dependency-cruiser configurados (`.dependency-cruiser.cjs`)
- [x] husky + secretlint no pre-commit
- [x] Design tokens caioimori-DS em `@apse/shared-ui`
- [x] Primeira migration aplicada (orgs + members + RLS)
- [x] GitHub repo criado (caioimori/apse-os, privado)
- [ ] Conectar Vercel preview (manual — 5 cliques no dashboard)

**Localhost-complete:** `pnpm dev` abre Next; migrations rodando contra Supabase remoto.

---

## Passo 1 — DB + Seeds (shared/db)

- [ ] Migration `0001_init.sql` com: organizations, members
- [ ] Migration `0002_core.sql` com: clients, contracts, contract_splits, contract_costs
- [ ] Migration `0003_billing.sql` com: invoices, transactions, collaborators, collaborator_payments, costs
- [ ] Migration `0004_views.sql` com: mv_client_profitability, mv_org_dashboard
- [ ] RLS em TODAS as tabelas por `org_id` (desde migration 0001)
- [ ] Seeds de dev com 1 org SINAPSE + 4 clients + contratos realistas
- [ ] `pnpm db:types` gera types para `packages/shared/db/types.ts`

**Localhost-complete:** `supabase db reset` roda tudo, Studio mostra dados.

---

## Passo 2 — Auth (shared/auth + modules/organizations)

- [ ] Supabase Auth com email magic link
- [ ] Telas: login, signup, invite member
- [ ] Wrapper `@apse/shared-auth` com hooks (useUser, useOrg)
- [ ] Módulo `organizations` com CRUD de org + members

**Localhost-complete:** usuário entra, vê dashboard vazio, tem org padrão criada.

---

## Passo 3 — Clients (modules/clients)

- [ ] CRUD clients PF/PJ
- [ ] Listagem + filtro + busca
- [ ] Form com validação Zod
- [ ] API pública do módulo: `getClient`, `listClients`, `createClient`

**Localhost-complete:** Caio cadastra os 4 clientes reais da SINAPSE.
**Dogfood activation #1** — começa usar.

---

## Passo 4 — Contracts + Pricing (modules/contracts + shared/domain)

- [ ] Form de contrato com splits (entre sócios + freelas + custos)
- [ ] Preview de margem antes de fechar (domain puro TypeScript)
- [ ] Histórico de contratos por cliente
- [ ] API pública: `createContract`, `calculateMargin`, `listContractsByClient`

**Localhost-complete:** cadastrar contrato reflete split correto.

---

## Passo 5 — Billing MOCK (modules/billing + integrations/asaas mock)

- [ ] `integrations/asaas/port.ts` — interface
- [ ] `integrations/asaas/mock.ts` — gera invoice fake, dispara webhook simulado 5s depois
- [ ] Módulo `billing` consome factory (flag `APSE_ASAAS_MODE=mock`)
- [ ] Fluxo end-to-end: contract → invoice criada → webhook → transaction registrada

**Localhost-complete:** cobrança funciona 100% sem Asaas real.

---

## Passo 6 — Collaborators (modules/collaborators)

- [ ] CRUD colaboradores
- [ ] Cálculo de quanto cada um recebe por contrato (usa splits)
- [ ] Lista "a pagar sexta-feira"
- [ ] API pública: `listPayable`, `markPaid`

**Localhost-complete:** Caio vê lista real de quem pagar.

---

## Passo 7 — Dashboard (modules/dashboard)

- [ ] MRR, lucro líquido, top clientes
- [ ] Alertas (cliente deu prejuízo, contrato vencendo)
- [ ] Materialized views refresh automático
- [ ] Filtros por período

**Localhost-complete:** dashboard completo com dados de mock billing.
**Dogfood activation #2** — Caio olha diariamente.

---

## Passo 8 — QA gates + E2E Playwright

- [ ] Contract tests entre todos os módulos
- [ ] E2E Playwright: login → cliente → contrato → invoice → dashboard
- [ ] Unit tests em `shared/domain` (80%+)
- [ ] CI GitHub Actions completo

**Gate:** antes de trocar mock Asaas por sandbox real, CI tem que estar verde.

---

## Passo 9 — **Swap: Asaas mock → sandbox** ⭐

- [ ] `integrations/asaas/sandbox.ts` implementa port
- [ ] Flag `APSE_ASAAS_MODE=sandbox` troca adapter
- [ ] Webhook real do Asaas sandbox configurado
- [ ] E2E do passo 8 continua passando SEM MUDAR código dos módulos

**Primeiro teste real:** integração funciona sem quebrar nada.

---

## Passo 10 — Integração CRM (Sonar ou Pipedrive)

- [ ] `integrations/sonar/mock.ts` retorna 5 clientes fake
- [ ] Tela de "importar clientes do CRM"
- [ ] Swap mock → real via flag

**Localhost-complete:** importa clientes fake → funciona.

---

## Passo 11 — Email (Resend)

- [ ] `integrations/resend/mock.ts` loga em `.tmp/emails/`
- [ ] Templates: invoice criada, pagamento recebido, alerta
- [ ] Swap mock → real via flag `APSE_RESEND_MODE=production`

---

## Passo 12 — Claude (revisão final)

**Decisão pendente — ver `docs/strategy/decisao-claude-max-nao-api.md`**

No MVP, Claude fica APENAS em modo mock. `production.ts` vazio.

- [ ] `integrations/claude/mock.ts` com 3-5 fixtures realistas
- [ ] UI renderiza placeholders de "insight IA" consumindo mock
- [ ] Zero chamada LLM em runtime no fluxo do usuário

**Reavaliar gateway quando:** R$ 10k MRR bate OU cliente pede feature AI específica OU free tier viável (Groq/Gemini) OU Claude Agent SDK produção-ready.

---

## Passo 13 (pós-MVP) — Deploy produção

- [ ] Domínio apontado
- [ ] Supabase projeto produção + migrations aplicadas
- [ ] Asaas produção (homologação aprovada)
- [ ] Vercel produção + env vars reais
- [ ] Sentry + PostHog ligados
- [ ] Backup + DR básico

**Entregável final:** SINAPSE rodando 100% financeiro no ApseOS.

---

## Estimativa total

**4-6 madrugadas em dupla (Caio + Soier) OU 8-10 noites solo.**

Dogfood real começa no Passo 3.
Cobrança real (Asaas produção) no Passo 13.
