# ApseOS — Consolidação da Decisão Estratégica

**Data:** 2026-04-17
**Contexto:** Caio (founder SINAPSE com sócio Matheus Soier) explorou tese de fintech bootstrap Brasil-first com potencial de unicórnio. Após 4 rounds de pesquisa profunda (council estratégico + 2 benchmarks de research-orqx + análise competitiva Sonar.marketing), chegou em decisão.

---

## Decisão final

**Produto:** **ApseOS** — a camada financeira das agências brasileiras.

**One-liner:** "Conecta seu CRM (Sonar/Pipedrive/RD) e seu gateway (Asaas/Pagar.me) e mostra em tempo real quanto cada cliente está te dando de lucro."

**Posicionamento:** financial layer (não all-in-one). Especialista em lucro real por cliente, split, projeção de fluxo. Integra com — não compete com — Sonar e similares.

**Empresa builder:** SINAPSE (Caio + Matheus Soier).

---

## Caminho descartado e por quê

| Tese | Score | Por que NÃO |
|---|---|---|
| Lead marketplace de crédito vertical | 32/40 | Mercado novo pra Caio, comoditização SGE |
| OFOS (Open Finance pra contadores) | 26/30 | Ciclo venda longo, contador conservador |
| CFO Copilot WhatsApp PME genérico | 34/40 | CAC alto sem gatekeeper, Caio fora do ICP |
| Profit OS pra creator/e-com BR | 8/10 | Triple Whale risco; ICP ok mas Caio não está dentro |
| Clonar Sonar + módulo financeiro | — | Suicídio bootstrap: 9 produtos, 6-12m, R$ 100-200k, perde pra especialistas em cada categoria |

**Vencedora — Agência OS / ApseOS** ganhou porque:
- Caio É o ICP (SINAPSE = agência rodando MindLoop, mentorias, plataforma)
- Distribuição via sinapse.club + caioimori (audiência já existe)
- Soier como sócio dev/devops desbloqueia velocidade
- Sonar deixou flanco financeiro 100% aberto (validado via API docs)
- Pricing R$ 99-299 ataca abaixo dos R$ 800/mês do Sonar

---

## Análise competitiva — Sonar.marketing

**O que descobrimos via API docs:**
- Modelos Clientes, Negócios, Campanhas têm ZERO campos financeiros
- Pricing site menciona "módulo financeiro completo" — contradição/vaporware
- Tier único R$ 800/mês filtra agência boutique
- API REST + Bearer token (estilo Stripe) — querem virar plataforma
- AI fields rasos (ai_summary, ai_win_probability nos deals)

**Implicação:** janela curta (6-12m) pra dominar narrativa "financial layer" antes de Sonar atacar.

**Estratégia:** integrar com Sonar via API (não competir). Mensagem ao cliente: "Já usa Sonar? Conecte e veja seu lucro real."

---

## Como funciona (didático)

**Cenário SINAPSE rodando 4 clientes:**

1. **Dashboard** mostra MRR, lucro líquido, top clientes, alertas (ex: "Cliente XYZ deu prejuízo R$ 800")
2. **Cadastro de contrato** define split entre sócios + freelas + custos fixos. Calcula margem antes de fechar.
3. **Asaas** gera cobrança automática, recebe via PIX, ApseOS concilia e provisiona pagamento dos splits
4. **Sexta-feira** dispara PIX automático pra todos colaboradores
5. **Mês 6+** módulo de crédito (RBF) — antecipa receita futura via parceria QI Tech/Asaas Capital

**Diferencial vs Asaas/Conta Simples:** mostra LUCRO POR CLIENTE em tempo real, não apenas movimentação.

---

## Modelo de monetização (3 camadas)

| Camada | Receita | Quando |
|---|---|---|
| 1. SaaS mensal | R$ 99-299/mês por agência | Dia 1 |
| 2. Take rate cobrança | 0,5-1% sobre processado | Mês 6+ |
| 3. RBF / crédito embutido | Take rate sobre antecipação | Ano 2 |

**Path unicórnio:** R$ 99 × 100 = R$ 10k MRR (gatilho saída CLT, 6-12m) → R$ 199 × 500 = R$ 100k MRR (18-30m) → R$ 299 × 5.000 = R$ 1,5M MRR (3-5 anos).

---

## Arquitetura técnica

**Stack:**
- Next.js 15 + React 19 + Tailwind v4 + shadcn/ui
- Supabase (Postgres + Auth + RLS)
- Asaas API (cobrança/pagamento)
- Claude API (insights AI)
- Resend (email)
- Sentry + Posthog
- Vercel (deploy)

**Modularização (monorepo pnpm):**
```
apse-os/
├── apps/web/              ← Next.js
├── packages/
│   ├── db/                ← Schema + migrations
│   ├── domain/            ← Lógica pura (pricing, billing, analytics, tax)
│   ├── integrations/      ← asaas, claude, resend, sonar, pipedrive
│   ├── ui/                ← shadcn + componentes
│   ├── auth/              ← wrapper Supabase
│   └── config/
└── docs/                  ← prd, stories, architecture
```

**Princípio:** `domain/` é puro TypeScript (zero infra). Trocar Asaas por Pagar.me = trocar 1 arquivo.

**Database core:** organizations, members, clients, contracts, contract_splits, contract_costs, collaborators, collaborator_payments, invoices, transactions, costs + materialized views (mv_client_profitability, mv_org_dashboard).

**RLS multi-tenant** por org_id em todas as tabelas.

---

## Infraestrutura e custos

| Estágio | Custo/mês |
|---|---|
| Mês 1-3 (MVP, dogfood SINAPSE) | R$ 0 + R$ 40 domínio |
| Mês 6 (5-20 lighthouse) | ~R$ 200 |
| Mês 12 (100 clientes) | ~R$ 800 |
| 1k tenants | ~R$ 3-5k |

---

## Gitflow (Caio + Soier)

- main protegida
- branches: `caio/feat/*`, `soier/feat/*`
- PRs com review cruzado obrigatório
- CI: lint + typecheck + test
- Vercel preview por branch
- Conventional Commits + scope
- Merge: squash + delete branch

---

## Plano de execução — Epic 1: Fundação ApseOS

| Story | Quem | Conteúdo |
|---|---|---|
| 1.0 Setup | @devops | Pasta, monorepo, Supabase, Vercel, GitHub, branch protection |
| 1.1 Auth + multi-tenancy | @developer | Supabase Auth, organizations, members, RLS |
| 1.2 Cadastro clientes | @developer | CRUD clients PF/PJ |
| 1.3 Contratos + Split | @developer | contracts, splits, costs, preview margem |
| 1.4 Integração Asaas sandbox | @developer | customer, cobrança recorrente, webhook |
| 1.5 Pagamentos colaboradores | @developer | collaborators, splits calculados, lista a pagar |
| 1.6 Dashboard + alertas | @developer | mat views, MRR, lucro por cliente, alertas |
| 1.7 Deploy produção | @devops | Domínio, prod Vercel/Supabase, Asaas homologação |

**Tempo:** 4-6 madrugadas em dupla, 8-10 noites solo.
**Saída:** SINAPSE rodando 100% financeiro no ApseOS (cliente zero, dogfood real).

---

## Decisões pendentes (próxima sessão)

1. Confirmar nome final: ApseOS vs ApsePay vs ApseAI vs outro
2. Subdomínio temporário: `apse.sinapse.club` ou `os.sinapse.club`
3. Soier disponível pra parear nas madrugadas (define solo vs dupla flow)
4. Decisão go/no-go vs explorar outras teses

---

## Arquivos relacionados

- `docs/strategy/tese-fintech-unicornio.md` — tese council original (OFOS)
- `docs/research/fintech-marketing-growth-2026.md` — benchmark creator economy + matriz Sonar
