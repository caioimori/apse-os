---
type: runbook
title: Database — reset, migrations, seeds
date: 2026-04-18
---

# Runbook — Database

## Reset total do DB local

```bash
supabase db reset
# roda: stop → start → migrations (ordem) → seeds → analyze
```

Tempo esperado: 30-60s. Dados do dev são apagados.

## Nova migration

```bash
supabase migration new {nome_descritivo}
# cria supabase/migrations/{timestamp}_{nome}.sql
```

### Checklist obrigatório (ADR-005)

Toda nova tabela de negócio DEVE ter:
- [ ] `id uuid primary key default gen_random_uuid()`
- [ ] `org_id uuid not null references organizations(id) on delete cascade`
- [ ] `created_at timestamptz not null default now()`
- [ ] `updated_at timestamptz` (com trigger ou `now()` no update)
- [ ] Índice em `org_id` (primeira coluna de índices compostos)
- [ ] `alter table ... enable row level security;`
- [ ] Policy de isolamento por `org_id` (template no ADR-005)
- [ ] Test em `tests/integration/rls/` provando isolamento

### Template mínimo
```sql
-- supabase/migrations/{timestamp}_{nome}.sql

create table if not exists {tabela} (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  -- colunas de negócio
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_{tabela}_org on {tabela}(org_id);

alter table {tabela} enable row level security;

create policy {tabela}_tenant_isolation on {tabela}
  for all
  using (org_id in (select org_id from members where user_id = auth.uid()))
  with check (org_id in (select org_id from members where user_id = auth.uid()));

-- Trigger updated_at
create trigger {tabela}_updated_at
  before update on {tabela}
  for each row execute function set_updated_at();
```

## Regenerar types TS

Depois de aplicar migration:
```bash
pnpm db:types
# equivale a: supabase gen types typescript --local > packages/shared/db/types.ts
```

Commitar o resultado. PR sem types atualizado é rejeitado.

## Seeds (dev)

Arquivo: `supabase/seed.sql`

Convenção ApseOS:
- 1 org SINAPSE (UUID fixo pra dev reproduzível)
- 1 user owner (email `caio@sinapse.local`)
- 4 clients realistas (MindLoop, etc.)
- 4-6 contracts com splits
- Invoices em estados variados (paid, pending, overdue)

Seeds rodam automaticamente em `supabase db reset`.

## Prod migrations

**Passo 13** — ver story `13.1.production-deploy.md` quando existir.

Fluxo:
1. PR com migration + types
2. Review + merge
3. CI roda `supabase db push --linked` em staging
4. Smoke test em staging
5. Promote pra prod com approval manual (@devops)

**Nunca** rodar `supabase db reset` em staging/prod.

## Backup local

Snapshot do DB atual:
```bash
supabase db dump -f backup_$(date +%Y%m%d).sql
```

Restore:
```bash
psql "postgresql://postgres:postgres@localhost:54322/postgres" < backup_YYYYMMDD.sql
```

## Ver também
- ADR-005 (RLS)
- `docs/architecture/module-boundaries.md`
