# ApseOS — Plano de Modularização Localhost-First

**Owners:** Caio (estratégia + solo nights) · Matheus Soier (dev principal)
**Data:** 2026-04-17
**Stack:** Next.js 15 · React 19 · Tailwind v4 · shadcn · Supabase (Postgres + Auth + RLS) · Asaas · Claude API · Resend · Vercel · pnpm
**Filosofia:** Boundary antes de feature. Mock antes de integração. Módulo usável incrementalmente.

> Referência: o processo já validado em `sinapse-plataform/docs/architecture/processo-modularizacao-estrategica.md`. Este plano aplica a mesma doutrina ao ApseOS desde o dia 0 (greenfield, sem débito pra migrar).

---

## 0. Resumo executivo

1. **Greenfield modular desde o commit 1.** Monorepo pnpm com `apps/web` + `packages/*`.
2. **Módulos por domínio de negócio** (auth, organizations, clients, contracts, billing, collaborators, dashboard) + `integrations/*` (asaas, claude, resend, sonar, pipedrive) + `shared/*`.
3. **Hexagonal (ports & adapters) nas integrações.** Cada integração externa tem interface (`port`) + adapter mock + adapter real. Swap via feature flag.
4. **Localhost-complete por módulo:** roda ponta-a-ponta com mocks determinísticos + Supabase local (Docker). Zero dependência externa até marcos específicos.
5. **Dogfood cedo:** Caio começa usar ApseOS pra SINAPSE **antes** de integrar Asaas produção. Integrações reais entram uma por vez, atrás de flag.

---

## 1. Setup inicial (Dia 0)

Todos os comandos rodam em `C:\Users\Caio Imori\Workspace\sinapse\apse-os\` (novo).

### 1.1 Pré-requisitos (verificar)

```bash
node --version       # >= 20
pnpm --version       # >= 9 — se não tiver: npm i -g pnpm
docker --version     # Docker Desktop rodando (pra Supabase local)
supabase --version   # >= 1.200 — se não: npm i -g supabase
gh --version         # GitHub CLI autenticado
```

### 1.2 Bootstrap do monorepo

```bash
# 1. Criar pasta e inicializar
cd "C:/Users/Caio Imori/Workspace/sinapse"
mkdir apse-os && cd apse-os
git init
pnpm init

# 2. Estrutura base
mkdir -p apps/web packages/{db,domain,ui,auth,config,events,flags} \
         packages/integrations/{asaas,claude,resend,sonar,pipedrive} \
         packages/modules/{organizations,clients,contracts,billing,collaborators,dashboard} \
         docs/{architecture,stories,prd} \
         supabase tests

# 3. pnpm workspace
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "apps/*"
  - "packages/*"
  - "packages/modules/*"
  - "packages/integrations/*"
EOF

# 4. Next.js na app web
cd apps/web
pnpm create next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm
cd ../..

# 5. shadcn + libs base
cd apps/web && pnpm dlx shadcn@latest init -d && cd ../..
pnpm add -w -D typescript biome turbo dependency-cruiser vitest @playwright/test
pnpm add -w zod

# 6. Supabase local
supabase init
supabase start   # sobe Postgres + Auth + Studio em Docker

# 7. Git + branch protection
git checkout -b main
git add -A && git commit -m "chore: bootstrap apse-os monorepo"
gh repo create SINAPSE-AI/apse-os --private --source=. --remote=origin --push
gh api -X PUT repos/SINAPSE-AI/apse-os/branches/main/protection \
   -f required_pull_request_reviews.required_approving_review_count=1
```

### 1.3 Config raiz

- `turbo.json` — pipeline build/lint/test/dev
- `biome.json` — lint + format (mais rápido que ESLint+Prettier)
- `tsconfig.base.json` — paths `@apse/*` apontando pra `packages/*`
- `.dependency-cruiser.js` — bloqueia import cross-módulo por dentro (domain/infra)
- `.env.local` — flags default `mode=mock` em todas integrações

---

## 2. Estrutura de pastas final

```
apse-os/
├── apps/
│   └── web/                          # Next 15 — thin layer (rotas + composição)
│       └── src/app/
│           ├── (auth)/               # login, signup
│           ├── (app)/
│           │   ├── clients/          # importa @apse/clients/api
│           │   ├── contracts/        # importa @apse/contracts/api
│           │   ├── billing/
│           │   ├── collaborators/
│           │   └── dashboard/
│           └── api/
│               ├── webhooks/asaas/   # recebe webhook real (depois) OU simulador
│               └── mocks/            # endpoints de simulação localhost
│
├── packages/
│   ├── db/                           # Supabase schema, migrations, seeds, types gerados
│   │   ├── migrations/
│   │   ├── seed.sql
│   │   └── types.ts                  # gerado por `supabase gen types`
│   │
│   ├── domain/                       # LÓGICA PURA (zero I/O, zero infra)
│   │   ├── pricing/                  # cálculo de margem, split preview
│   │   ├── billing/                  # regras de cobrança (sem chamar Asaas)
│   │   ├── analytics/                # agregações, KPIs
│   │   └── tax/                      # impostos, simples nacional
│   │
│   ├── auth/                         # wrapper Supabase Auth
│   ├── ui/                           # shadcn + design tokens ApseOS
│   ├── events/                       # bus in-process (emit/on)
│   ├── flags/                        # feature flags client + SSR
│   ├── config/                       # env loader, schemas zod env
│   │
│   ├── modules/                      # MÓDULOS DE NEGÓCIO
│   │   ├── organizations/            # multi-tenancy: orgs, members, convites
│   │   ├── clients/                  # CRUD clientes PF/PJ
│   │   ├── contracts/                # contratos + splits + costs
│   │   ├── billing/                  # ciclo cobrança (orquestra asaas adapter)
│   │   ├── collaborators/            # freelas + pagamentos semanais
│   │   └── dashboard/                # views materializadas, alertas
│   │       └── (cada módulo segue template §3)
│   │
│   └── integrations/                 # PORTS & ADAPTERS
│       ├── asaas/
│       │   ├── port.ts               # interface AsaasPort
│       │   ├── mock.ts               # adapter localhost (fake determinístico)
│       │   ├── sandbox.ts            # adapter Asaas sandbox
│       │   ├── production.ts         # adapter Asaas produção
│       │   └── index.ts              # factory baseado em flag
│       ├── claude/
│       ├── resend/
│       ├── sonar/
│       └── pipedrive/
│
├── supabase/                         # config local (gerado por supabase init)
├── tests/
│   ├── contract/                     # contract tests entre módulos
│   └── e2e/                          # Playwright — ciclo dogfood completo
└── docs/
```

**Regra visual de ouro:** se um arquivo importa de 2 módulos de negócio diferentes, ou está em `apps/web/src/app/` (composição de UI) ou está errado.

---

## 3. Contrato de módulo (template)

Cada módulo de negócio expõe **exatamente 3 arquivos públicos**:

| Arquivo | Função |
|---|---|
| `api/index.ts` | Funções públicas tipadas — única porta de entrada |
| `contracts.ts` | Zod schemas de input/output |
| `events.ts` | Eventos emitidos/consumidos |

Estrutura interna de cada módulo:

```
packages/modules/clients/
├── api/
│   └── index.ts              # PUBLIC
├── contracts.ts              # PUBLIC (zod)
├── events.ts                 # PUBLIC
├── domain/                   # PRIVADO — entidades, regras puras
│   ├── client.ts
│   └── client.rules.ts
├── application/              # PRIVADO — use cases
│   ├── createClient.ts
│   └── listClients.ts
├── infra/                    # PRIVADO — Supabase queries
│   └── clientRepository.ts
├── ui/                       # PRIVADO — componentes React
│   ├── ClientForm.tsx
│   └── ClientList.tsx
└── __tests__/
```

### Exemplo concreto: módulo `clients` expondo API pro módulo `contracts`

**`packages/modules/clients/contracts.ts`**
```ts
import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  kind: z.enum(["PF", "PJ"]),
  name: z.string().min(2),
  document: z.string(),           // CPF ou CNPJ
  email: z.string().email().optional(),
  createdAt: z.date(),
});
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientInput = ClientSchema.omit({
  id: true, createdAt: true
});
export type CreateClientInput = z.infer<typeof CreateClientInput>;
```

**`packages/modules/clients/api/index.ts`**
```ts
import { createClient }  from "../application/createClient";
import { listClients }   from "../application/listClients";
import { getClientById } from "../application/getClientById";

export const clientsAPI = {
  create:  createClient,   // (input: CreateClientInput) => Promise<Client>
  list:    listClients,    // (orgId: string) => Promise<Client[]>
  getById: getClientById,  // (id: string) => Promise<Client | null>
};
export type { Client, CreateClientInput } from "../contracts";
```

**`packages/modules/contracts/application/createContract.ts`** (consumidor)
```ts
import { clientsAPI } from "@apse/modules-clients/api";
// NUNCA: import { ... } from "@apse/modules-clients/infra/..."  ← BLOQUEADO

export async function createContract(input: CreateContractInput) {
  const client = await clientsAPI.getById(input.clientId);
  if (!client) throw new Error("Cliente não existe");
  // ...
}
```

Enforcement: regra `no-restricted-imports` no Biome + `dependency-cruiser` no CI bloqueia `modules/*/domain/**` e `modules/*/infra/**` de fora do próprio módulo.

---

## 4. Mock strategy — integração real × mock localhost

Cada integração externa segue padrão **port + adapters** com flag `APSE_{SERVICE}_MODE = mock | sandbox | production`.

| Integração | Mock localhost (grátis, determinístico) | Sandbox (grátis, fora) | Produção | Como swapar |
|---|---|---|---|---|
| **Asaas cobrança** | `mock.ts` cria `invoice` fake no DB local + agenda job que "dispara webhook" simulado após N segundos | Asaas sandbox (sandbox.asaas.com) | Asaas produção | `APSE_ASAAS_MODE=sandbox` no `.env.local` |
| **Asaas webhook** | Endpoint `/api/mocks/asaas/trigger-payment` dispara payload compatível com webhook real | URL pública via ngrok/Vercel preview | URL Vercel produção | Mesmo handler, payload 100% igual |
| **Claude API** | `mock.ts` retorna respostas canned de `packages/integrations/claude/fixtures/*.json` | — | `anthropic` SDK real | `APSE_CLAUDE_MODE=production` + key |
| **Resend email** | `mock.ts` faz `console.log(email)` + escreve em `.tmp/emails/*.eml` | Resend free tier (3k/mês) | Resend pago | `APSE_RESEND_MODE=sandbox` |
| **Sonar CRM** | `mock.ts` devolve 5 clientes fake fixos (seed) | Sonar API real com token de teste | Sonar produção | `APSE_SONAR_MODE=production` |
| **Pipedrive** | `mock.ts` com 3 deals fake | Pipedrive sandbox | Pipedrive produção | idem |
| **Supabase Auth** | Supabase **local** (Docker) — não é mock, é a coisa real local | — | Supabase cloud | Mudar `SUPABASE_URL` |

### Exemplo de port + adapter (Asaas)

```ts
// packages/integrations/asaas/port.ts
export interface AsaasPort {
  createCustomer(input: CreateCustomerInput): Promise<{ id: string }>;
  createRecurringCharge(input: CreateChargeInput): Promise<Charge>;
  cancelCharge(chargeId: string): Promise<void>;
}

// packages/integrations/asaas/mock.ts
export const asaasMock: AsaasPort = {
  async createCustomer(input) {
    const id = `mock_cus_${crypto.randomUUID()}`;
    await db.insert("mock_asaas_customers", { id, ...input });
    return { id };
  },
  async createRecurringCharge(input) {
    const charge = { id: `mock_chr_${crypto.randomUUID()}`, status: "PENDING", ...input };
    await db.insert("mock_asaas_charges", charge);
    // simula webhook assíncrono em 5s
    setTimeout(() => triggerMockWebhook("PAYMENT_CONFIRMED", charge), 5000);
    return charge;
  },
  async cancelCharge(id) { await db.update("mock_asaas_charges", id, { status: "CANCELLED" }); }
};

// packages/integrations/asaas/index.ts
import { asaasMock } from "./mock";
import { asaasSandbox } from "./sandbox";
import { asaasProduction } from "./production";
import { env } from "@apse/config";

export const asaas: AsaasPort = {
  mock: asaasMock,
  sandbox: asaasSandbox,
  production: asaasProduction,
}[env.APSE_ASAAS_MODE];
```

Módulo `billing` **nunca** importa `mock.ts`. Só importa `asaas` (factory). Trocar mock → real = editar `.env.local`.

---

## 5. Ordem de construção — 12 passos

| # | Módulo/Área | Entrega (localhost-complete) | Integração real a plugar depois | Esforço |
|---|---|---|---|---|
| 1 | **Setup + CI** | Monorepo rodando, Supabase local up, `pnpm dev` sobe Next + Studio, GitHub Actions verde (lint+typecheck+test) | — | 1 sessão (4h) |
| 2 | **db base + seeds** | Migrations core (organizations, members, clients, contracts, splits, costs, collaborators, collab_payments, invoices, transactions, costs). RLS por `org_id`. Seed: 1 org SINAPSE + 4 clientes fake + 2 colaboradores + 3 contratos | — | 1 sessão (4h) |
| 3 | **auth + organizations** | Login Supabase local, signup cria org, trocar org, convidar member. Tudo funciona no localhost sem email real | Resend (mock → sandbox no passo 11) | 1-2 sessões |
| 4 | **clients** | CRUD PF/PJ com validação CPF/CNPJ, busca, soft delete. UI completa | Sonar/Pipedrive importer (passo 10) | 1 sessão |
| 5 | **contracts + domain/pricing** | Criar contrato com splits (sócios + freela), costs fixos, preview de margem em tempo real. **Zero** integração externa. Calculadora 100% em `domain/pricing/` | — | 2 sessões |
| 6 | **billing (mock)** | Gera invoice ao aprovar contrato. Mock Asaas cria charge, webhook simulado muda status pra PAID, conciliação automática, transactions registradas | Asaas sandbox (passo 9) | 2 sessões |
| 7 | **collaborators + pagamentos** | Lista "a pagar sexta", calcula splits automáticos ao receber invoice. Export CSV/PIX manual. | Asaas transfer API (pós-passo 9) | 1-2 sessões |
| 8 | **dashboard + alertas** | Materialized views (mv_client_profitability, mv_org_dashboard). MRR, lucro líquido, top clientes, alerta "cliente X deu prejuízo". Refresh por trigger após transaction | Claude insights (passo 12) | 2 sessões |
| 9 | **🔌 Swap Asaas mock → sandbox** | Mesma app, muda flag. Teste: criar cobrança real no Asaas sandbox, receber webhook real via ngrok/preview | — (é a própria integração) | 1 sessão |
| 10 | **integrations/sonar (mock→real)** | Import de clientes do Sonar (OAuth). Mock vira real | Sonar produção | 1-2 sessões |
| 11 | **resend (mock→sandbox)** | Convites, notificações de pagamento, alertas | Resend prod | 0.5 sessão |
| 12 | **claude (mock→real)** | Insights no dashboard (resumo semanal, anomalias) | Claude prod | 1 sessão |

**Total estimado:** 14-18 sessões em dupla (~30-40h) OU 20-28 noites solo.

---

## 6. Dogfood activation checkpoint

**Caio começa a usar ApseOS PRA VALER na SINAPSE após o passo 8** (dashboard funcionando), **ainda com Asaas em mock**.

| Fase dogfood | Quando | O que Caio faz na SINAPSE real |
|---|---|---|
| **Alpha interno** | Pós-passo 5 (contracts) | Cadastra os 4 clientes SINAPSE + contratos com splits reais (Caio/Matheus). Valida se os números batem com planilha atual |
| **Beta mock** | Pós-passo 8 (dashboard) | Usa dashboard diariamente. Cobranças ainda geradas no Asaas manualmente, mas resultado reconciliado via import CSV → mock |
| **Beta sandbox** | Pós-passo 9 (Asaas real sandbox) | Sub-conta Asaas de teste emite cobranças reais (de R$ 1 pra validar fluxo). Ainda não é o Asaas de produção SINAPSE |
| **Produção** | Pós-passo 12 | SINAPSE migra produção Asaas pro ApseOS. Primeiro cliente pagante não-SINAPSE pode entrar |

**Regra:** antes do passo 9, qualquer cobrança real SINAPSE ainda roda no Asaas atual (fora do ApseOS). ApseOS só LÊ dados via import pra dogfood. Zero risco financeiro.

---

## 7. Schema DDL inicial (core + RLS)

```sql
-- organizations (tenants)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  unique(org_id, user_id)
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  kind text not null check (kind in ('PF','PJ')),
  name text not null,
  document text not null,
  email text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table contracts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  title text not null,
  monthly_value numeric(12,2) not null,
  status text not null default 'draft' check (status in ('draft','active','paused','cancelled')),
  starts_at date not null,
  ends_at date,
  created_at timestamptz default now()
);

create table contract_splits (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  recipient_type text not null check (recipient_type in ('member','collaborator','fixed_cost')),
  recipient_id uuid,                        -- member_id ou collaborator_id (nullable p/ custo fixo)
  percentage numeric(5,2),                  -- soma deve dar 100 por contract
  fixed_amount numeric(12,2),
  label text
);

create table contract_costs (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  label text not null,
  amount numeric(12,2) not null,
  recurrence text not null check (recurrence in ('monthly','once'))
);

create table collaborators (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  pix_key text,
  document text,
  created_at timestamptz default now()
);

create table collaborator_payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  collaborator_id uuid not null references collaborators(id) on delete restrict,
  contract_id uuid references contracts(id) on delete set null,
  amount numeric(12,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  due_date date not null,
  paid_at timestamptz
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  contract_id uuid not null references contracts(id) on delete restrict,
  client_id uuid not null references clients(id),
  amount numeric(12,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','overdue','cancelled')),
  due_date date not null,
  paid_at timestamptz,
  external_id text,                         -- id no Asaas (mock ou real)
  external_provider text default 'mock'     -- 'mock' | 'asaas'
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  kind text not null check (kind in ('revenue','cost','payout')),
  amount numeric(12,2) not null,
  invoice_id uuid references invoices(id),
  contract_id uuid references contracts(id),
  occurred_at timestamptz not null default now()
);

-- Materialized views
create materialized view mv_client_profitability as
select
  c.org_id, c.id as client_id, c.name,
  sum(case when t.kind='revenue' then t.amount else 0 end) as revenue,
  sum(case when t.kind in ('cost','payout') then t.amount else 0 end) as costs,
  sum(case when t.kind='revenue' then t.amount else -t.amount end) as profit
from clients c
left join contracts ct on ct.client_id = c.id
left join transactions t on t.contract_id = ct.id
group by c.org_id, c.id, c.name;

create materialized view mv_org_dashboard as
select
  org_id,
  sum(case when kind='revenue' then amount else 0 end) as total_revenue,
  sum(case when kind in ('cost','payout') then amount else 0 end) as total_costs,
  sum(case when kind='revenue' then amount else -amount end) as net_profit
from transactions
group by org_id;

-- RLS universal
alter table organizations enable row level security;
alter table members enable row level security;
alter table clients enable row level security;
alter table contracts enable row level security;
alter table contract_splits enable row level security;
alter table contract_costs enable row level security;
alter table collaborators enable row level security;
alter table collaborator_payments enable row level security;
alter table invoices enable row level security;
alter table transactions enable row level security;

-- Policy template (repetir pra cada tabela com org_id)
create policy "members access own org" on clients
  for all using (
    org_id in (select org_id from members where user_id = auth.uid())
  );
```

**Migrations versionadas em** `supabase/migrations/` (`0001_init.sql`, `0002_mvs.sql`, `0003_rls.sql`).

**Seed** em `supabase/seed.sql`: 1 org SINAPSE, 2 members (Caio+Soier), 4 clients, 3 contracts, 2 collaborators — reproduz cenário real pra dogfood desde t=0.

---

## 8. Estratégia QA — construir em partes sem quebrar o todo

| Nível | Ferramenta | Quando roda | Foco |
|---|---|---|---|
| **Unit (domain)** | Vitest | Pré-commit + CI | `packages/domain/*` — pricing, splits, margem. 100% puro, 0 mock |
| **Integration (módulo)** | Vitest + Supabase local | CI | Cada módulo contra DB local. Valida `api/index.ts` ponta-a-ponta |
| **Contract tests** | Vitest | CI | Inter-módulo. `contracts→clients→getById` sempre retorna shape esperado |
| **E2E dogfood** | Playwright | CI nightly + pré-release | Fluxo crítico completo (ver §8.1) |
| **Static (boundaries)** | dependency-cruiser | Pré-commit + CI | Bloqueia import cross-módulo em domain/infra |
| **Type check** | tsc -b | Pré-commit + CI | Monorepo inteiro |

### 8.1 E2E dogfood crítico (Playwright)

Cenário único, não-negociável, roda a cada push em main:

```
1. Login Caio → 2. Criar org SINAPSE → 3. Cadastrar cliente "Módulo" →
4. Criar contrato R$ 5k/mês com split 50/50 Caio/Soier →
5. Aprovar contrato → mock Asaas gera invoice →
6. Disparar webhook mock → invoice vira PAID →
7. Dashboard mostra MRR R$ 5k, lucro líquido correto, cliente "Módulo" no top
```

Se este E2E quebrar → build rejeitado.

### 8.2 Rollback por feature flag

Toda feature nova entra atrás de flag `feature_flags` (tabela Supabase). Se quebra produção:
```sql
update feature_flags set enabled = false where key = 'billing.auto_webhook_retry';
```
Zero deploy, zero rollback git. Só funciona porque flags foram previstas **antes** da feature.

---

## 9. Anti-patterns — 10 erros a evitar

| # | Anti-pattern | Por que dói | Alternativa correta |
|---|---|---|---|
| 1 | Chamar `fetch("https://asaas.com/...")` direto de componente React ou Server Action | Acopla UI a fornecedor externo. Impede mock. | Sempre via `@apse/integrations/asaas` → factory resolve mock/sandbox/prod |
| 2 | Query cross-módulo direto no Supabase (`select * from contracts` dentro do módulo `clients`) | Quebra encapsulamento. Mudança em `contracts` quebra `clients` silenciosamente. | `contractsAPI.listByClient(clientId)` |
| 3 | Importar `@apse/modules-clients/infra/...` de outro módulo | Rompe boundary. ESLint + dep-cruiser **devem** bloquear. | Só `@apse/modules-clients/api` |
| 4 | Lógica de pricing em Server Action/React | Impossível testar sem render. | `packages/domain/pricing/` puro + teste unit direto |
| 5 | Webhook Asaas real apontando pra localhost sem ngrok/preview URL | Simplesmente não chega. | No modo mock, endpoint `/api/mocks/asaas/trigger-*` substitui — payload idêntico |
| 6 | Pular flag e trocar adapter direto no código ("só pra testar") | Vai pra produção assim. | Flag SEMPRE — `.env.local` vs `.env.production` |
| 7 | Materialized view recriada a cada request | Mata Postgres. | `refresh materialized view concurrently` em trigger pós-transaction + job periódico |
| 8 | Seed com dados genéricos ("user1", "client1") | Dogfood fica surreal, bugs reais não aparecem. | Seed com nomes SINAPSE-real (Módulo, Astro, etc.) |
| 9 | RLS definida "depois que virar produção" | Vaza dados entre tenants no primeiro bug. | RLS desde migration 0003, testada no CI |
| 10 | Módulo `dashboard` lendo tabelas de `clients`/`contracts`/`billing` direto | Dashboard vira god-module acoplado a tudo. | Dashboard lê só `mv_*` (views materializadas) — contrato de leitura explícito |

---

## 10. Checklist "módulo pronto" (15 itens)

Antes de marcar um módulo como entregue, Caio/Soier validam:

- [ ] `api/index.ts` existe e exporta funções tipadas (sem `any`)
- [ ] `contracts.ts` tem Zod schemas de todos os I/O públicos
- [ ] `events.ts` lista eventos emitidos + consumidos (se houver)
- [ ] Nenhum import de outro módulo bate em `domain/*` ou `infra/*` (dep-cruiser verde)
- [ ] Migrations versionadas em `supabase/migrations/`
- [ ] RLS policy criada e testada (teste que user de outra org NÃO vê)
- [ ] Seed inclui dados realistas do módulo
- [ ] Testes unit em `domain/` com cobertura ≥80% da lógica pura
- [ ] Teste de integração cobre o happy path via `api/index.ts`
- [ ] UI funciona com Supabase local + mocks (zero serviço externo)
- [ ] Feature flag criada pro módulo (`modules.{name}.enabled`)
- [ ] Se tem integração externa: port + mock + (sandbox OU production) implementados
- [ ] Stories `docs/stories/` atualizadas com status >= Done
- [ ] Caio conseguiu usar o módulo na SINAPSE real (dogfood passou)
- [ ] E2E dogfood continua verde após merge

---

## Anexo A — Referências cruzadas

- `C:\Users\Caio Imori\Workspace\sinapse\solucao-financeira\docs\strategy\apse-os-decisao.md` — decisão estratégica
- `C:\Users\Caio Imori\Workspace\sinapse\sinapse-plataform\docs\architecture\processo-modularizacao-estrategica.md` — padrão validado de modularização
- Constitution SINAPSE — Artigos III (Doc-First), VIII (Delegation), IX (Safe Collab), X (Security)
