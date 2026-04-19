-- ApseOS — migration 0003
-- Clientes (PF/PJ) dentro da org. Soft-delete via status.

create type public.client_kind as enum ('PF', 'PJ');
create type public.client_status as enum ('active', 'inactive', 'archived');

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  kind public.client_kind not null,
  name text not null,
  document text,
  email text,
  phone text,
  notes text,
  status public.client_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, document)
);

create index if not exists idx_clients_org_name on public.clients(org_id, name);
create index if not exists idx_clients_org_status on public.clients(org_id, status);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;

create policy clients_select_org_member
  on public.clients for select
  using (org_id in (select public.current_user_org_ids()));

create policy clients_insert_org_member
  on public.clients for insert
  with check (org_id in (select public.current_user_org_ids()));

create policy clients_update_org_member
  on public.clients for update
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create policy clients_delete_admin
  on public.clients for delete
  using (
    org_id in (
      select org_id from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
