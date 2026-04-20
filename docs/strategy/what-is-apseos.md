---
type: strategy
title: O que é ApseOS — posicionamento v1.0
date: 2026-04-20
status: active
supersedes: what-is-apseos draft (2026-04-19)
---

# ApseOS — sala de comando financeira da agência

Documento fonte-de-verdade do posicionamento. Tudo que for gerado a partir daqui (LP, onboarding, UI, copy, roadmap) obedece este doc.

---

## 1. Frase-cliente (a que vai na LP)

> **"ApseOS é a sala de comando da sua agência. Abre de manhã, vê em 10 segundos como a empresa tá indo, e sabe exatamente o que fazer hoje pra crescer — do primeiro lead ao último cliente fiel."**

---

## 2. Categoria

**ApseOS não é CRM. Não é ERP. Não é dashboard. Não é gerenciador de tarefas.**

É **Core Financeiro da agência** — camada única que centraliza atração, conversão, retenção e escala, orientada por margem real.

Comparação honesta:

| Ferramenta | Foco | Lacuna |
|---|---|---|
| Pipedrive / RD | Pipeline de vendas | Zero visão de margem pós-fechamento |
| iClips | Gestão operacional | Financeiro é adicional, não core |
| Kamino / Conta Azul | Financeiro / ERP | Não fala com conversão nem retenção |
| Asana / ClickUp | Tarefa / projeto | Não sabe o que é um cliente |
| **ApseOS** | **Receita + margem + retenção** | — |

---

## 3. Os 4 pilares (funil completo)

| Pilar | Pergunta que responde | Entrega principal |
|---|---|---|
| **Atração** | Meus leads valem a pena? | Lead scoring financeiro, fit de ticket, previsão de margem por segmento |
| **Conversão** | Fecho esse deal ou perco dinheiro? | Preview de margem em proposta, simulação "e se?", alerta de deal ruim |
| **Retenção** | Qual cliente tá fugindo? | Score de risco, queda de margem antecipada, ação sugerida |
| **Escala** | Pra onde direciono investimento? | Segmento mais lucrativo, vertical com menor churn, benchmark histórico próprio |

---

## 4. Princípio central — decide, não opera

| Dentro do ApseOS | Fora do ApseOS |
|---|---|
| "Qual cliente renegociar?" | "Quem vai escrever o post dessa semana?" |
| "Esse deal tem margem boa?" | "Quem tá editando o vídeo?" |
| "Quanto entra semana que vem?" | "Qual é a pauta do reel?" |
| "Qual vertical escalar?" | "Quem revisa o design?" |

**Filtro único:** se a feature ajuda a **operar** (executar tarefa), fica fora. Se ajuda a **decidir** (crescer com margem), fica dentro.

---

## 5. Hábito — o primeiro app do dia

Meta: ApseOS é a **primeira aba** que o dono de agência abre de manhã. Substitui 4 ansiedades em 1 app:

| Sentimento | Hoje faz | Com ApseOS faz |
|---|---|---|
| "Tô ganhando dinheiro?" | Abre banco | Abre ApseOS |
| "Posso gastar essa grana?" | Pergunta ao sócio | Abre ApseOS |
| "Tô perdendo cliente?" | Checa WhatsApp | Abre ApseOS |
| "Posso fechar esse deal?" | Calcula no papel | Abre ApseOS |

**Loop Hooked aplicado:**
- **Trigger externo** — push 7h30 com Morning Brief
- **Trigger interno** — ansiedade de "tô saudável hoje?"
- **Ação** — 1 tela, 10 segundos, 3 decisões prontas
- **Recompensa variável** — score que oscila, insight novo, descoberta diária
- **Investimento** — cada dado inserido melhora previsão de amanhã

---

## 6. Home = Morning Brief (tela âncora)

Uma tela. Aberta em 2 segundos. Lida em 10.

```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│   BOM DIA, CAIO                       sexta, 22 abr        │
│                                                             │
│   ┌────────────────────────────────────────────────┐       │
│   │  SAÚDE FINANCEIRA       82 / 100    ↑3         │       │
│   │  [sparkline 30 dias]                            │       │
│   └────────────────────────────────────────────────┘       │
│                                                             │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│   │ MARGEM MÊS   │ │ A RECEBER    │ │ EM RISCO     │      │
│   │    14%       │ │  R$ 42.800   │ │     3        │      │
│   │   ↑2pp       │ │  7 dias      │ │  clientes    │      │
│   └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                             │
│   3 AÇÕES DO DIA                                            │
│   ─────────────────────────────────────────                │
│   ▸ Renegociar cliente Acme (margem -6pp em 60d)           │
│   ▸ Cobrar NF #203 vencida há 3d (R$ 4.200)                │
│   ▸ Fechar proposta do lead MindLoop (margem ok 22%)       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Regra 1-3-3:**
- **1 score** dominante (0-100)
- **3 KPIs** suportando
- **3 ações** executáveis

---

## 7. Arquitetura de módulos (sidebar slim, icon-only)

5 módulos. Nada de sub-menu. Zero configurações/ajuda no sidebar principal.

| Ícone | Módulo | Função |
|---|---|---|
| ▫ | **Home** | Morning Brief — tela âncora |
| ▫ | **Clientes** | Retenção, margem real, score de risco |
| ▫ | **Pipeline** | Atração + conversão com preview de margem |
| ▫ | **Financeiro** | Caixa, recebimentos, cobrança, forecast |
| ▫ | **Inteligência** | Insights, benchmark próprio, escala |

Revisitar depois de validação com cliente zero (SINAPSE empresa) — pode ajustar pra mais ou menos.

---

## 8. IA — infraestrutura invisível

**ApseOS não vende IA. Vende clareza. A IA é o motor invisível que gera a clareza.**

| Onde IA trabalha | O que usuário vê |
|---|---|
| Lead scoring financeiro | Card mostra "margem esperada 18%" |
| Movimentação automática de leads no pipeline | Lead pulou stage sozinho |
| Churn preditivo | Cliente aparece em "risco" |
| Categorização de custos importados | Despesa já taxonomizada |
| Ranking de ações do dia | Lista 1-2-3 no Morning Brief |
| Insight engine (job diário) | "Sabia que seus clientes de e-com têm 2x churn?" |
| Forecast de caixa | Alerta de gap antes de acontecer |
| Redação de email (renegociação/cobrança) | 1 clique → texto pronto pra revisar |

Zero "fale com a IA". Zero chat. A inteligência é o comportamento, não a interface.

---

## 9. Princípios de design (AbacatePay-inspired, ApseOS-DNA)

Referência visual: AbacatePay (densidade baixa, clareza brutal, hierarquia forte). DNA próprio: B&W puro (ADR-008), Inter Variable.

**Leis invioláveis:**

1. **3 cores, nunca 4** — branco, preto, 1 accent
2. **1 fonte, 2 pesos** — Inter Variable (400 + 600)
3. **Radius 24px** em cards principais (âncora AbacatePay)
4. **Border > shadow** — depth via surface
5. **Número grande, label pequena** — KPI domina, contexto sussurra
6. **Densidade baixa** — espaço respira
7. **Vocabulário de dono** — nada de jargão técnico

**Limites forçados (escassez = simplicidade):**

| Elemento | Máximo |
|---|---|
| Módulos no sidebar | 5 |
| CTAs principais por tela | 2 |
| KPIs na home | 3 + 1 score |
| Ações sugeridas | 3 |
| Colunas de tabela visíveis | 6 |
| Níveis de menu | 1 |

---

## 10. Vocabulário — termos de dono

| NÃO usa | Usa |
|---|---|
| Taxa de churn | Clientes saindo |
| LTV | Quanto cada cliente rende |
| Margem de contribuição | Lucro real por cliente |
| Pipeline velocity | Deals andando |
| CAC | Custo pra conquistar 1 cliente |
| Forecast | Previsão de caixa |
| Dashboard | Home / Sala de comando |
| Métricas | Números que importam |
| Churn preditivo | Quem está fugindo |

---

## 11. Wedge de entrada

Agência não compra "plataforma completa" cold. Entra por dor quente.

**Entrada única: "Clientes em Risco"** (Dor #1 + #2 da pesquisa combinadas).

- Import CSV clientes + contratos com splits
- Margem real calculada em tempo real
- Lista ranqueada por score de risco
- Ação sugerida por cliente

Tempo pra valor: **10 minutos**. Pitch: *"Descubra em 10 minutos qual cliente está te dando prejuízo."*

Tudo depois (pipeline, forecast, benchmark) é **expansão do hábito**, não entrada.

---

## 12. Pricing

| Plano | Preço | Limite | ICP |
|---|---|---|---|
| **Entrada** | R$ 97/mês | até 10 clientes | Agência micro / em recuperação |
| **Sweet spot** | R$ 297/mês | até 50 clientes | Core da base (78% do mercado) |
| **Pro** | R$ 497/mês | ilimitado + pipeline + IA extra | Agências em escala |

Stack atual fragmentado custa R$ 650-1050/mês (Pipedrive + Kamino/iClips + Conta Azul). ApseOS substitui com payback imediato.

---

## 13. Defensibilidade

1. **Dado histórico** — quanto mais tempo de uso, mais preciso o forecast/score. Lock-in orgânico.
2. **Inteligência composta** — cada ação do usuário alimenta o motor de sugestão.
3. **Hábito diário** — substituir 4 ansiedades = substituir Pipedrive, planilha, contador mental.
4. **Benchmark próprio** (fase 2, opt-in) — rede de agências compara sem expor dado individual.
5. **Fonte única** — quem centraliza receita + margem + retenção não é deslocável por ponto-ferramenta.

---

## 14. Anti-posicionamento

O que ApseOS **não é** — e por que recusa ser:

- **Não é CRM** (mercado saturado, virou commodity)
- **Não é ERP** (contador já cobre)
- **Não é gestor de tarefas** (Asana/ClickUp fazem bem)
- **Não é plataforma de execução** (iClips ocupa esse espaço)
- **Não é "IA pra agência"** (IA é motor, não personalidade)
- **Não é relatório mensal em PDF** (relatório é a tela, todos os dias)

---

## 15. Roadmap (fase 1 → fase 3)

**Fase 1 (0-6m)** — Core da retenção + home-hábito
- Morning Brief
- Clientes (margem real + risco)
- Financeiro básico (a receber, a pagar, forecast)
- IA: churn preditivo + ranking de ações + categorização

**Fase 2 (6-12m)** — Conversão inteligente
- Pipeline com margem projetada
- Automover de leads (IA move por sinal)
- Simulador de proposta
- Insight engine avançado

**Fase 3 (12m+)** — Escala e rede
- Benchmark opt-in entre agências
- IA conversacional (pergunte ao ApseOS)
- Redação automática de comunicação
- Integrações (Asaas, CRMs externos, contabilidade)

---

## 16. Cliente zero

SINAPSE empresa (dogfood). Caio + Soier usam antes de vender pra fora. Dados reais de:
- Clientes SINAPSE (projetos cliente-facing)
- Custos de entrega (freela, ferramenta, sócio-time)
- Pipeline de novos deals
- Retenção dos ativos

Cliente zero valida Fase 1 inteira antes de qualquer venda externa.

---

*ApseOS v1.0 · posicionamento travado · abril 2026*
