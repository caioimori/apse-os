---
id: ADR-003
title: Claude Max CLI, NUNCA API paga no MVP
status: accepted
date: 2026-04-18
deciders: Caio Imori
---

# ADR-003 — Claude Max, não API

## Contexto
ApseOS pré-receita. Asaas + Supabase + Vercel já são custos fixos. Claude API adiciona linha variável que explode com uso. Caio já tem Claude Max assinado — gratuito à margem.

## Decisão
**Zero chamada LLM em runtime no MVP.** Features "IA" são mocks com fixtures realistas. Claude é usado APENAS via CLI (Claude Code) pra desenvolvimento, não pelo app em produção.

### Regras
1. Zero `@anthropic-ai/sdk` em `package.json`
2. Zero `ANTHROPIC_API_KEY` em `.env*`
3. `packages/integrations/claude/production.ts` fica VAZIO (export stub que throwa)
4. `integrations/claude/mock.ts` com 3-5 fixtures determinísticas
5. UI de "insight IA" renderiza placeholder consumindo mock
6. Secret scan no CI falha se achar `sk-ant-`

### Gatilhos pra reavaliar
- R$ 10k MRR consolidado (3 meses consecutivos)
- Cliente paga especificamente por feature AI
- Free tier viável (Groq/Gemini) com qualidade aceitável
- Claude Agent SDK com pricing sustentável

## Alternativas consideradas
- **API Anthropic direto:** custo variável imprevisível em MVP
- **OpenRouter/Groq:** qualidade/compliance incerta, força mudança de prompt
- **Claude Code Agent SDK:** ainda não production-ready (abr/2026)

## Consequências
### Positivas
- CapEx previsível no MVP
- Força design de features que funcionam sem LLM
- Quando plugar LLM, será decisão de produto, não de "porque dá"

### Negativas
- UX de IA é placeholder — cliente pode sentir falta
- Mitigação: mock é bom o suficiente pra validar UX; plug real só depois de validar demanda

## Referências
- `docs/strategy/decisao-claude-max-nao-api.md` — decisão completa
