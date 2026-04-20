---
type: positioning
title: What is ApseOS — identidade, posicionamento, tom
status: draft
date: 2026-04-19
author: Caio Imori
purpose: alinhar com Caio o que ApseOS É antes de rebuildar UI
---

# What is ApseOS

Doc de conversa. Minha leitura atual do projeto baseada em tudo que li — PRD, strategy, ADRs, código da v0.1. Serve pra Caio validar ou corrigir antes da Fase A.

---

## 1. Minha leitura do que ApseOS É

**Em 1 frase:** A camada financeira das agências brasileiras — SaaS que conecta CRM + gateway de cobrança e mostra lucro real por cliente em tempo real.

**Em 1 parágrafo:** ApseOS resolve o problema de que agências brasileiras têm dados de receita, custo e margem espalhados em planilhas, gateway, CRM e cabeça do sócio. Unifica num painel único que responde a pergunta crítica que todo sócio de agência faz toda semana: *"qual cliente está me dando lucro de verdade?"*. O MVP foca dogfood interno da SINAPSE empresa antes de vender pra fora.

**Em 3 verbos:** Unifica. Revela. Decide.

## 2. Quem é o usuário

**ICP primário:** sócio-operador de agência BR de marketing/branding, 2-10 pessoas, fatura R$20k-200k/mês, usa Asaas + algum CRM, tem ≥3 clientes ativos.

**Não é pra:**
- Agências grandes (>50 pessoas) que já têm ERP
- Freelancers solo (não precisa de multi-tenant)
- Empresas fora de agência (SaaS, e-commerce, consultoria geral)

**Persona canônica:**
- Caio ou Soier em 2026. Decide entre 23h e 2h da manhã. Precisa olhar e saber se demite freela, aumenta preço, ou recusa cliente. Não quer gráfico bonito sem insight.

## 3. Tom e vibe

**É:**
- Preciso como planilha de contador, mas com soul
- Sério como ferramenta financeira, mas não hostil
- Denso de informação, mas respirável
- Opinativo sobre o que importa (margem, risco) sem ser autoritário

**Não é:**
- "Fun" tipo fintech gamificada
- Minimalista ascético tipo Cal.com
- Corporate frio tipo Bloomberg
- Gradient-heavy tipo v0/Vercel AI

**Referência de tom:** Linear pra disciplina visual + Ramp pra seriedade financeira + Stripe pra sinais numéricos. Nada de AbacatePay alegria-mint.

## 4. Promessa nuclear

> "Você descobre qual cliente está te dando prejuízo antes que ele te afunde."

Tudo o mais (CRUD clientes, importar CRM, gerar cobrança) é infraestrutura pra entregar essa promessa.

## 5. O que ApseOS NÃO é (pra não confundir)

- **Não é CRM.** Não substitui Sonar/Pipedrive/RD. Consome dados deles.
- **Não é gateway de cobrança.** Não processa pagamento. Orquestra Asaas.
- **Não é contabilidade.** Não gera NF-e, DRE, fechamento contábil.
- **Não é ERP.** Não faz folha, estoque, fiscal.
- **Não é planilha bonita.** É decisão em tempo real.

## 6. Três telas que definem o produto

Se o usuário nunca voltar a usar ApseOS depois de ver, essas 3 telas DECIDEM:

1. **Dashboard com cliente em risco destacado.** "Ana, Contrato MindLoop tá com margem 3%. Tá pagando caro os splits." Caio olha e sabe imediatamente se ajusta ou corta.
2. **Contrato novo com preview de margem.** Caio fecha um contrato, ajusta split de freela/imposto, vê em tempo real se o deal vale. Sai dessa tela sabendo se topou um lucro real ou tá queimando caixa.
3. **"A pagar sexta" consolidado.** Quinta-feira 23h. Caio abre e vê lista de quem pagar, valor, chave PIX. Decide em 10min.

Se a v2 errar nessas 3, o produto não nasceu.

## 7. Decisões estratégicas vigentes (lembrança)

| Decisão | Fonte | Status |
|---|---|---|
| MVP dogfood SINAPSE antes de vender | `apse-os-decisao.md` | firme |
| Zero LLM em runtime no MVP | ADR-003 | firme |
| Modular Monolith | ADR-001 | firme |
| RLS multi-tenant desde o início | ADR-005 | firme |
| Localhost-first com mocks | ADR-002 | firme (Asaas mock até ter volume) |
| Gatilho de reavaliar LLM: R$10k MRR | ADR-003 | em aberto |
| Claude Max, nunca API paga | ADR-003 | firme (NON-NEGOTIABLE) |
| Light-first, B&W puro, Inter Variable | ADR-008 | **recém decidido 2026-04-19** |

## 8. Onde posso estar errado — perguntas pra Caio

Quero testar minha leitura em 7 perguntas antes de começar a Fase A:

### Q1 — Público
"Agências BR 2-10 pessoas" é precisamente o ICP, ou aceita também **estúdios criativos** (branding, design, produto) que trabalham tipo agência? Muda mensagem da home?

### Q2 — Dogfood vs venda
Dogfood SINAPSE é a validação OU é o produto final pra sempre? Se um cliente de fora quiser comprar daqui 30 dias e estiver rodando estável, você vende ou pede pra esperar?

### Q3 — A "camada financeira"
Esse termo é literal (financeiro puro: receita, custo, lucro) ou se estende pra **operação** (projetos, prazos, entregáveis)? Ou seja — ApseOS é **só financeiro** ou **ops financeiro**?

### Q4 — "Lucro real por cliente" = lifetime ou monthly?
Quando aparecer o KPI "Margem Cliente X", é margem do mês corrente, dos últimos 30d, ou lifetime de todos contratos dele? Muda totalmente o design do dashboard.

### Q5 — Splits = sócios ou só custos?
O split de contrato tá suportando: revenue_share (sócio), collaborator (freela), tool (Figma), tax (imposto), other. **Revenue_share** implica que sócios dividem receita — isso é o pattern comum de agência SINAPSE ou só Caio trabalha solo agora?

### Q6 — Relação com CRM
Sonar/Pipedrive puxa leads/clientes → ApseOS cadastra como client. Bidirecional? Se fecho cobrança paga no ApseOS, empurra status "won/paid" pro CRM? Ou é import-only?

### Q7 — Identidade da marca
ApseOS é um **produto dentro do ecossistema SINAPSE** (tipo "SINAPSE Apse") ou é uma **empresa própria** com marca independente? Isso decide:
- Home logada: mostra logo ApseOS ou SINAPSE?
- Email do cliente: vem de `@apseos.com` ou `@sinapse.club`?
- Pricing page: marca ApseOS ou SINAPSE?

---

## 9. Proposta de posicionamento (rascunho pra aprovar)

**Tagline:** "A camada financeira das agências brasileiras."

**Sub-tagline técnica:** "Lucro real por cliente em tempo real. CRM + gateway + custos em um só painel."

**Pitch de 30s:** "Agência brasileira sabe quanto fatura mas não sabe quanto lucra por cliente. Os dados estão espalhados entre planilha, Asaas, CRM e cabeça do sócio. ApseOS junta tudo e mostra margem em tempo real — você descobre qual cliente está dando prejuízo antes que ele te afunde. É o dashboard executivo que deveria vir junto com o Asaas."

**Manifesto em 4 linhas:**
- Número é verdade. Planilha é desculpa.
- Margem > Faturamento.
- Contrato fechado sem preview de margem é aposta cega.
- Freela cobrado a maior é dinheiro vazando da mão do sócio.

---

## 10. Próxima ação

Caio valida este doc respondendo as 7 perguntas (Q1-Q7) ou corrigindo onde minha leitura está torta. Depois:
- Atualizo este doc com as respostas viram versão 1.0
- Crio story `A.1.app-shell.md` com tokens do ADR-008 fechados e posicionamento alinhado
- Começamos a Fase A do rebuild

**Sem esta conversa, qualquer UI que eu faça pode estar tecnicamente polida mas estrategicamente errada.**
