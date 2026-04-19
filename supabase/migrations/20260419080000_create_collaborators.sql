create table if not exists public.collaborators (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  document text,
  pix_key text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_collaborators_org on public.collaborators(org_id, active);

create trigger collaborators_set_updated_at
  before update on public.collaborators
  for each row execute function public.set_updated_at();

alter table public.collaborators enable row level security;
create policy collaborators_select on public.collaborators for select
  using (org_id in (select public.current_user_org_ids()));
create policy collaborators_insert on public.collaborators for insert
  with check (org_id in (select public.current_user_org_ids()));
create policy collaborators_update on public.collaborators for update
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));

create table if not exists public.collaborator_payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  collaborator_id uuid not null references public.collaborators(id) on delete restrict,
  contract_id uuid references public.contracts(id) on delete set null,
  amount_cents bigint not null check (amount_cents >= 0),
  reference_month date not null,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_payments_org on public.collaborator_payments(org_id, reference_month);
create index if not exists idx_payments_collab on public.collaborator_payments(collaborator_id);

alter table public.collaborator_payments enable row level security;
create policy payments_select on public.collaborator_payments for select
  using (org_id in (select public.current_user_org_ids()));
create policy payments_insert on public.collaborator_payments for insert
  with check (org_id in (select public.current_user_org_ids()));
create policy payments_update on public.collaborator_payments for update
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));
