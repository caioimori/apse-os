# ApseOS — ROADMAP executável

> Checklist dos 12 passos do plano localhost-first.
> Status 2026-04-19: **MVP localhost-complete**. Passos 0-7 + 10-12 concluídos.

---

## Passo 0 — Bootstrap ✅ DONE

- [x] Monorepo pnpm + Next 15 + Tailwind v4 + Biome
- [x] Supabase remoto apse-os (sa-east-1) — migrations via MCP
- [x] dependency-cruiser + husky + secretlint
- [x] Design tokens caioimori-DS em `@apse/shared-ui`
- [x] GitHub público + rulesets main/develop + PR template + CODEOWNERS + CONTRIBUTING
- [ ] Vercel preview (manual, 2 cliques)

---

## Passo 1 — DB ✅ DONE (incremental por story)

Migrations aplicadas (cada uma na story que precisou):
- [x] 0001 organizations + members + RLS
- [x] 0002 fix set_updated_at search_path
- [x] 0003 clients
- [x] 0004 contracts + contract_splits
- [x] 0005 invoices
- [x] 0006 collaborators + collaborator_payments

Seeds: deferidos (Caio cadastra dados reais direto — dogfood).
Types: `pnpm db:types:remote` mantém `packages/shared/db/src/types.ts` atualizado.

---

## Passo 2 — Auth ✅ DONE · PR #1

`@apse/shared-auth` + `@apse/modules-organizations`. Magic link Supabase. Middleware protege rotas.

---

## Passo 3 — Clients ✅ DONE · PR #3

CRUD PF/PJ com máscara CPF/CNPJ. Lista/busca/edit/arquivar.
**Dogfood activation #1** — Caio pode cadastrar MindLoop + clientes reais.

---

## Passo 4 — Contracts + Pricing ✅ DONE · PR #4

Migration contracts + contract_splits. Domain `calculateMargin()`. Preview tempo real no form.

---

## Passo 5 — Billing MOCK ✅ DONE · PR #5

`@apse/integrations-asaas` hexagonal. Mock determinístico. "Gerar cobrança" + "Simular pagamento".

---

## Passo 6 — Collaborators ✅ DONE · PR #6

Cadastro + lista "a pagar esse mês" derivada dos splits de kind='collaborator'.

---

## Passo 7 — Dashboard ✅ DONE · PR #7

`@apse/modules-dashboard` consolida MRR, custos, margem média, top clientes, clientes em risco.
**Dogfood activation #2** — Caio olha dashboard diariamente.

---

## Passo 8 — QA gates + E2E Playwright (deferido)

- [x] Biome + tsc + dependency-cruiser + secretlint + contract tests no CI
- [ ] Playwright E2E (infra `@playwright/test` já instalada, scripts ainda não escritos)

Decisão: escrever E2E quando dogfood produzir bug real. Não escrever antes.

---

## Passo 9 — Swap Asaas mock → sandbox

Stub em `packages/integrations/asaas/sandbox.ts`. Implementação real adiada até `APSE_ASAAS_MODE=sandbox` valer a pena — hoje mock serve o dogfood.

---

## Passo 10 — CRM integration ✅ DONE (mock) · PR #8

`@apse/integrations-sonar` com 5 fixtures (3 won, 2 open).
`@apse/integrations-pipedrive` compartilha port do Sonar (mock vazio).
UI `/orgs/[id]/import` → importa lead como cliente.

---

## Passo 11 — Email ✅ DONE (mock) · PR #8

`@apse/integrations-resend` mock loga em console + inbox in-memory.
Swap `APSE_RESEND_MODE=production` quando plugar Resend real.

---

## Passo 12 — Claude ✅ DONE (mock-only, ADR-003) · PR #8

`@apse/integrations-claude` com 4 kinds de insights fixtures.
`production.ts` throws — ADR-003 NON-NEGOTIABLE.
Dashboard exibe 3 insights no topo.

---

## Passo 13 (pós-MVP) — Deploy produção

- [ ] Vercel com env vars reais
- [ ] Asaas sandbox → production (Passo 9)
- [ ] Resend production (Passo 11)
- [ ] Sentry + PostHog
- [ ] Domínio + DNS
- [ ] Backup + DR básico

---

## Estado atual

**MVP funcional em develop.** Caio pode logar, criar org, cadastrar clientes/contratos/colaboradores, gerar cobranças mock, marcar pagas, ver dashboard, importar do CRM mock. Tudo com RLS multi-tenant, modular monolith, zero LLM em runtime, design caioimori-DS dark-compatible.

**Próximo passo:** dogfood real com dados da SINAPSE. Bugs e gaps que aparecerem viram stories pós-MVP.
