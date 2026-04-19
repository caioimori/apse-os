---
id: ADR-004
title: Hexagonal (ports + adapters) em TODA integração externa
status: accepted
date: 2026-04-18
deciders: Caio Imori, Matheus Soier
---

# ADR-004 — Hexagonal em integrações

## Contexto
Módulo de negócio (billing) acoplado direto ao SDK do Asaas = impossível testar, impossível trocar gateway, impossível rodar localhost.

## Decisão
**Toda integração externa segue estrutura hexagonal idêntica:**

```
packages/integrations/{nome}/
├── port.ts         ← interface TypeScript (contrato)
├── mock.ts         ← fake determinístico (default dev + testes)
├── sandbox.ts      ← integração homologação
├── production.ts   ← integração prod
├── index.ts        ← factory: resolve por APSE_{NOME}_MODE
└── fixtures/       ← dados do mock (JSON versionado)
```

### Regras
1. Módulo de negócio importa APENAS `@apse/integrations-{nome}` (que re-exporta factory)
2. Módulo NUNCA importa `production.ts`, `sandbox.ts`, `mock.ts` direto
3. Port define SÓ o que o domínio precisa — não espelha SDK externo
4. Mock é deterministico: mesmo input → mesmo output, tempo controlado via clock injetado
5. Contract tests rodam contra TODOS adapters (mock + sandbox) em CI

### Integrações cobertas
- `asaas` — cobrança
- `resend` — email
- `claude` — LLM (mock-only no MVP, ver ADR-003)
- `sonar` — CRM
- `pipedrive` — CRM
- Futuros: qualquer API externa paga ou de terceiro

## Alternativas consideradas
- **Import direto do SDK:** rápido, mas quebra localhost-first e testabilidade
- **Repository pattern só:** não cobre webhooks e side effects
- **Service layer genérico:** sem enforcement estrutural

## Consequências
### Positivas
- Swap de gateway (Asaas → Stripe Brasil) = implementar novo adapter, zero mudança em módulo
- Testes de billing rodam em ms (mock em memória)
- Mock é documentação executável da API externa

### Negativas
- Boilerplate de port + 3 adapters por integração
- Mitigado: template + scaffolding script (`pnpm scaffold:integration`)

## Referências
- `docs/architecture/plano-modularizacao-localhost-first.md`
- ADR-002 (localhost-first)
