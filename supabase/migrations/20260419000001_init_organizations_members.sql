-- ApseOS — migration 0001
-- Cria organizations + members + infra base (trigger updated_at, RLS).

create extension if not exists pgcrypto;

-- Helper: trigger para manter updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Organizations (tenant raiz)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;

-- Members (user ↔ org)
create type public.member_role as enum ('owner', 'admin', 'member');

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists idx_members_org on public.members(org_id);
create index if not exists idx_members_user on public.members(user_id);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

alter table public.members enable row level security;

-- Helper: ids de orgs que o usuário atual pertence
create or replace function public.current_user_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.members where user_id = auth.uid();
$$;

-- RLS policies
create policy organizations_select_member
  on public.organizations for select
  using (id in (select public.current_user_org_ids()));

create policy organizations_insert_authenticated
  on public.organizations for insert
  with check (auth.uid() is not null);

create policy organizations_update_admin
  on public.organizations for update
  using (
    id in (
      select org_id from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy members_select_same_org
  on public.members for select
  using (org_id in (select public.current_user_org_ids()));

create policy members_insert_admin
  on public.members for insert
  with check (
    org_id in (
      select org_id from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy members_update_self_or_admin
  on public.members for update
  using (
    user_id = auth.uid()
    or org_id in (
      select org_id from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy members_delete_admin
  on public.members for delete
  using (
    org_id in (
      select org_id from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
