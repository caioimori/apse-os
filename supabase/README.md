# supabase/

Supabase local via Docker. Estrutura criada pelo comando `supabase init`.

## Comandos

```bash
pnpm db:start   # sobe Postgres + Auth + Studio local
pnpm db:stop    # para containers
pnpm db:reset   # drop + migrate + seed (destrói dados locais)
pnpm db:types   # regera types TypeScript em packages/shared/db/types.ts
```

## Migrations

Versionadas em `migrations/`. Sequência inicial (ver `docs/ROADMAP.md` passo 1):

1. `0001_init.sql` — organizations, members + RLS
2. `0002_core.sql` — clients, contracts, contract_splits, contract_costs
3. `0003_billing.sql` — invoices, transactions, collaborators, collaborator_payments, costs
4. `0004_views.sql` — materialized views (profitability, dashboard)

**Regra:** RLS em TODAS as tabelas por `org_id` desde a primeira migration.

## Studio

Local: http://127.0.0.1:54323
