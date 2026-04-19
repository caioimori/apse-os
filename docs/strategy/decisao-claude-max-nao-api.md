# Decisão — Claude via Max subscription, NUNCA API paga

**Data:** 2026-04-18
**Decisão:** Caio
**Status:** NON-NEGOTIABLE pro MVP e primeiros meses do ApseOS

---

## Regra

O ApseOS **NÃO consome Claude API paga** (`@anthropic-ai/sdk` com API key Anthropic). Todo uso de Claude durante o desenvolvimento e operação inicial do produto vem da **assinatura Max do Caio** (via Claude Code CLI).

## Por quê

1. **Custo zero adicional** — Caio já paga Max mensalmente. API seria gasto duplicado.
2. **MVP dogfood** — só Caio/SINAPSE vai usar no começo. Não precisa de IA atendendo clientes terceiros.
3. **Decisão de gateway fica pra depois** — quando ApseOS tiver clientes pagantes, aí decide se integra API Anthropic, OpenAI, Groq (free tier), Gemini (free tier) ou roda modelo local.

## Implicações no código

### 1. Features "AI-driven" do produto ficam com adapter `mock` por padrão

O plano de modularização já prevê hexagonal: cada integração externa tem `port.ts` + `mock.ts` + `production.ts`.

Pro Claude:

```
packages/integrations/claude/
├── port.ts           ← interface comum
├── mock.ts           ← fixtures canned (MVP roda com isso)
├── production.ts     ← VAZIO / COMENTADO até decidir gateway
└── index.ts          ← factory resolve adapter via flag
```

**Flag padrão:** `APSE_CLAUDE_MODE=mock`. Troca pra `production` só quando decidir gateway.

### 2. Dogfood consome Claude Code manualmente, não via API

Quando Caio quer insight IA sobre dados do ApseOS (ex: "qual cliente devo aumentar preço?"), ele roda no Claude Code do próprio terminal apontando pros arquivos/queries. **Não há chamada programática do ApseOS → Claude.**

Se evoluir pra "AI assistant embutido no dashboard", isso só depois que tiver decisão de gateway tomada — **não no MVP**.

### 3. Proibido no código

| Forbidden | Motivo |
|---|---|
| `import Anthropic from '@anthropic-ai/sdk'` em qualquer módulo do produto | Viola a decisão |
| `ANTHROPIC_API_KEY` em `.env*` | Sinal de violação |
| Features que obriguem chamada LLM em tempo real no fluxo de usuário | Adia pra pós-gateway-decision |

### 4. Permitido

| OK | Contexto |
|---|---|
| Usar Claude Code (CLI) como ferramenta de desenvolvimento | Isso é o que já estamos fazendo nesta sessão |
| Rodar scripts locais via Claude Code que leem dados do ApseOS e geram relatórios/migrações/insights | Manual, não automatizado no produto |
| Claude Agent SDK rodando local com a subscription Max, se viável | Explorar no futuro — não prioridade MVP |
| Fixtures canned em `claude/mock.ts` retornando texto "sintético" pra UI poder renderizar placeholder de "insight IA" | Mantém UX pronta, zero custo |

## Quando revisitar essa decisão

Gatilhos pra reavaliar:

1. ApseOS bate **R$ 10k MRR** (meta de Caio sair do CLT) — margem pra absorver custo API
2. Cliente pagante pede feature AI específica como diferencial
3. Free tier de Groq/Gemini resolver 80% do caso de uso com zero custo
4. Claude Agent SDK viabilizar uso da subscription em produção (se/quando Anthropic permitir)

Até um desses acontecer, **adapter `production.ts` do Claude fica vazio. Ponto.**

## Efeito no plano de modularização

Ajuste no `docs/architecture/plano-modularizacao-localhost-first.md`:

- Passo 12 original era "swap Claude mock → produção". **Novo passo 12:** "avaliar gateway LLM e decidir integração REAL (pode ser NENHUMA no MVP)".
- Mock strategy pro Claude: expande `mock.ts` pra cobrir 3-5 casos de uso com fixtures realistas, suficiente pra UI ficar pronta.
- Nenhum módulo de negócio do ApseOS pode ter caminho crítico que obrigue LLM em runtime. AI é **sempre** feature opcional/decorativa no MVP.

## Ganho real dessa decisão

| Item | Antes | Depois |
|---|---|---|
| Custo API mensal estimado (MVP) | R$ 200-800/mês | R$ 0 |
| Decisão de gateway LLM | Tem que decidir agora | Adiada até ter receita |
| Tempo até primeiro usuário (dogfood) | Mesmo | Mesmo |
| Risco vendor lock-in Anthropic | Alto | Zero (ainda não comprometido) |
