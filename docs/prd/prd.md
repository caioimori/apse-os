---
type: prd
project: ApseOS
status: active
owner: Caio Imori
date: 2026-04-18
---

# ApseOS — PRD MVP

## Visão em 1 linha
A camada financeira das agências brasileiras. Conecta CRM (Sonar/Pipedrive) + gateway (Asaas) e mostra **lucro real por cliente em tempo real**.

## Problema
Agência brasileira tem vendas, tem cobrança e tem custo — em três ferramentas diferentes, nenhuma conversa. Sócio não sabe se o cliente dá lucro até fechar o mês (e mal sabe nem então).

## ICP
- Agência de marketing/branding BR, 2-10 pessoas
- Recebe via Asaas ou PIX
- Usa CRM (Sonar, Pipedrive, RD ou planilha)
- Fatura R$ 20k-200k/mês
- Tem ≥ 3 clientes ativos simultâneos

## Jobs-To-Be-Done
1. **Ver lucro real por cliente** sem fechar o mês
2. **Saber quem pagar sexta** sem montar planilha
3. **Alertar** quando cliente tá dando prejuízo (custo > receita)
4. **Importar contratos/clientes** do CRM sem re-digitar
5. **Cobrar automaticamente** sem abrir Asaas

## Escopo MVP (Epic 1 — SINAPSE dogfood)

### IN
- Multi-tenant (org + members) com RLS
- CRUD clientes PF/PJ
- Contratos com splits (sócio/freela/custo) + preview de margem
- Invoices (mock Asaas → sandbox → prod, via flag)
- Colaboradores + "a pagar sexta"
- Dashboard: MRR, lucro líquido, top clientes, alertas
- Import CRM (Sonar OU Pipedrive — UMA integração)
- Email transacional (Resend)
- IA: mocks apenas (ver ADR-003)

### OUT (pós-MVP)
- Conciliação bancária automática
- Relatórios fiscais (NF-e, DRE contábil)
- Multi-moeda
- App mobile nativo
- Mais de 1 CRM simultâneo
- Features AI com LLM em runtime

## Métricas de sucesso
- **Dogfood:** SINAPSE empresa roda 100% no ApseOS até Passo 13
- **Time-to-value:** nova org cadastra 1º contrato em < 10 min
- **Confiança:** lucro no dashboard bate com extrato bancário (±2%)
- **Gatilho venda:** R$ 10k MRR dispara reavaliação de LLM gateway

## Restrições NON-NEGOTIABLE
- Modular Monolith (ver ADR-001)
- Localhost-first com mocks determinísticos (ADR-002)
- Claude via Max CLI, nunca API (ADR-003)
- Hexagonal em TODA integração (ADR-004)
- RLS em TODA tabela desde migration 0001 (ADR-005)
- UX minimalista caioimori-DS desde pixel 1 (ADR-006)

## Personas
- **Caio (founder/ops):** cadastra contrato, olha dashboard, aprova pagamento
- **Soier (dev/sócio):** mesmo acima + manutenção técnica
- **Futuro cliente-agência:** mesmo fluxo do Caio

## Roadmap de releases
Ver `docs/ROADMAP.md` — 13 passos, dogfood real no Passo 3.

## Referências
- `docs/strategy/apse-os-decisao.md` — decisão estratégica completa
- `docs/strategy/decisao-claude-max-nao-api.md` — regra LLM
- `docs/strategy/tese-fintech-unicornio.md` — visão de longo prazo
- `docs/architecture/plano-modularizacao-localhost-first.md` — plano técnico
