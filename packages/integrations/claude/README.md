# @apse/integrations-claude

Integração Claude — **MVP roda APENAS em modo mock**.

## Regra NON-NEGOTIABLE

ApseOS **NUNCA** consome Claude API paga. Ver `docs/strategy/decisao-claude-max-nao-api.md`.

## Estado dos adapters

| Adapter | Status | Quando usar |
|---|---|---|
| `mock.ts` | ✅ Ativo | Default MVP. Fixtures canned. |
| `sandbox.ts` | ❌ Não existe | — |
| `production.ts` | 🚫 **PROIBIDO** | Só após decisão de gateway + R$ 10k MRR |

## Fixtures esperadas (mock)

- Insight sobre rentabilidade de cliente
- Sugestão de aumento de preço
- Análise de tendência de fluxo
- Resumo mensal (relatório)
- Placeholder genérico

## Flag

`APSE_CLAUDE_MODE=mock` (único valor aceito no MVP)

## Reavaliar quando

- R$ 10k MRR bate
- Cliente pagante pede feature AI específica
- Free tier Groq/Gemini viável
- Claude Agent SDK produção-ready com subscription
