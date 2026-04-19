-- ApseOS — migration 0004: contratos + splits
-- (Conteúdo idêntico à migration aplicada via MCP.)

create type public.contract_status as enum ('active', 'paused', 'ended');
create type public.split_kind as enum ('revenue_share', 'collaborator', 'tool', 'tax', 'other');

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  title text not null,
  monthly_value_cents bigint not null check (monthly_value_cents >= 0),
  currency text not null default 'BRL',
  started_at date not null,
  ended_at date,
  status public.contract_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contracts_org on public.contracts(org_id, status);
create index if not exists idx_contracts_org_client on public.contracts(org_id, client_id);

create trigger contracts_set_updated_at
  before update on public.contracts
  for each row execute function public.set_updated_at();

alter table public.contracts enable row level security;

create policy contracts_select on public.contracts for select
  using (org_id in (select public.current_user_org_ids()));
create policy contracts_insert on public.contracts for insert
  with check (org_id in (select public.current_user_org_ids()));
create policy contracts_update on public.contracts for update
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create table if not exists public.contract_splits (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  kind public.split_kind not null,
  label text not null,
  pct numeric(5,2) check (pct is null or (pct >= 0 and pct <= 100)),
  amount_cents bigint check (amount_cents is null or amount_cents >= 0),
  order_idx int not null default 0,
  created_at timestamptz not null default now(),
  check ((pct is null) <> (amount_cents is null))
);

create index if not exists idx_splits_contract on public.contract_splits(contract_id, order_idx);

alter table public.contract_splits enable row level security;

create policy splits_select on public.contract_splits for select
  using (contract_id in (
    select id from public.contracts where org_id in (select public.current_user_org_ids())
  ));
create policy splits_insert on public.contract_splits for insert
  with check (contract_id in (
    select id from public.contracts where org_id in (select public.current_user_org_ids())
  ));
create policy splits_update on public.contract_splits for update
  using (contract_id in (
    select id from public.contracts where org_id in (select public.current_user_org_ids())
  ));
create policy splits_delete on public.contract_splits for delete
  using (contract_id in (
    select id from public.contracts where org_id in (select public.current_user_org_ids())
  ));
