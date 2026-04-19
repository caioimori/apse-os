create type public.invoice_status as enum ('pending', 'paid', 'overdue', 'cancelled');

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  client_id uuid not null references public.clients(id) on delete restrict,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'BRL',
  due_at date not null,
  paid_at timestamptz,
  status public.invoice_status not null default 'pending',
  external_id text,
  external_provider text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_org_status on public.invoices(org_id, status);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoices_contract on public.invoices(contract_id);
create index if not exists idx_invoices_due on public.invoices(org_id, due_at);

create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;

create policy invoices_select on public.invoices for select
  using (org_id in (select public.current_user_org_ids()));
create policy invoices_insert on public.invoices for insert
  with check (org_id in (select public.current_user_org_ids()));
create policy invoices_update on public.invoices for update
  using (org_id in (select public.current_user_org_ids()))
  with check (org_id in (select public.current_user_org_ids()));
