---
id: ADR-005
title: RLS multi-tenant por org_id desde migration 0001
status: accepted
date: 2026-04-18
deciders: Caio Imori, Matheus Soier
---

# ADR-005 — RLS multi-tenant

## Contexto
ApseOS é SaaS multi-tenant. Dados de uma agência vazarem pra outra = evento de extinção. "Depois a gente adiciona RLS" é como dizer "depois a gente adiciona segurança".

## Decisão
**Toda tabela com dado de tenant TEM `org_id uuid not null` + RLS policy desde a PRIMEIRA migration.** Zero exceção.

### Padrão obrigatório por tabela
```sql
-- 1. Coluna org_id sempre presente
create table clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  -- ... colunas de negócio
  created_at timestamptz not null default now()
);

-- 2. Índice em org_id (SEMPRE primeira coluna de índices compostos)
create index idx_clients_org on clients(org_id);

-- 3. RLS ligado
alter table clients enable row level security;

-- 4. Policy de isolamento
create policy clients_tenant_isolation on clients
  for all
  using (org_id = (select org_id from members where user_id = auth.uid() limit 1))
  with check (org_id = (select org_id from members where user_id = auth.uid() limit 1));
```

### Enforcement
- Code review checklist: toda nova tabela tem `org_id` + RLS?
- Test obrigatório: `should_not_see_other_org_data` em `tests/integration/rls/`
- CI valida com `supabase db diff` + asserção RLS enabled

### Exceções legítimas (tabelas sem org_id)
- `organizations` — tabela raiz
- `members` — tem `org_id` mas policy usa `user_id = auth.uid()`
- Tabelas de sistema: `migrations_log`, `webhook_events_inbox` (se infra-level)

Toda exceção precisa de comentário `-- NO RLS: {razão}` e aprovação em PR.

## Alternativas consideradas
- **Filtro no app:** uma query sem `where org_id` vaza tudo. Confiar em dev é inaceitável
- **Schema-per-tenant:** inviável com Supabase e deploy simples
- **Policy global via função:** tentamos; degrada performance de query

## Consequências
### Positivas
- Vazamento cross-tenant = impossível via SQL
- Onboarding de dev: "esquece `org_id`? Postgres rejeita"
- Auditoria simples: `rls_enabled=true` em todas tabelas de negócio

### Negativas
- Queries cross-org (admin dashboard do ApseOS) precisam de `service_role` explícito
- Performance: policy adiciona latência; mitigado com índice em `org_id`

## Referências
- Plano original em `docs/architecture/plano-modularizacao-localhost-first.md`
- Supabase RLS docs
