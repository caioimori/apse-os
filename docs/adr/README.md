# Architecture Decision Records (ADR)

Registro curto de decisões arquiteturais importantes. Formato: contexto, decisão, consequências, alternativas.

## Índice

| ID | Título | Status |
|---|---|---|
| [ADR-001](./ADR-001-modular-monolith.md) | Modular Monolith | accepted |
| [ADR-002](./ADR-002-localhost-first.md) | Localhost-first com mocks determinísticos | accepted |
| [ADR-003](./ADR-003-claude-max-nao-api.md) | Claude Max CLI, nunca API paga no MVP | accepted |
| [ADR-004](./ADR-004-hexagonal-integrations.md) | Hexagonal (ports + adapters) em toda integração | accepted |
| [ADR-005](./ADR-005-rls-multi-tenant.md) | RLS multi-tenant por `org_id` desde migration 0001 | accepted |
| [ADR-006](./ADR-006-design-system-minimalista.md) | Design System minimalista (caioimori-DS) | accepted |

## Template

```md
---
id: ADR-XXX
title: {título curto}
status: proposed | accepted | deprecated | superseded by ADR-XXX
date: YYYY-MM-DD
deciders: {quem}
---

# ADR-XXX — {título}

## Contexto
Por que precisa decidir isso agora.

## Decisão
O que foi decidido. Com regras, enforcement, exemplos.

## Alternativas consideradas
Outros caminhos e por que não foram escolhidos.

## Consequências
### Positivas
### Negativas

## Referências
Links pra strategy docs, outros ADRs, runbooks.
```

## Regras
- ADR é **imutável** depois de `accepted`. Mudou? Cria novo com `supersedes: ADR-XXX`
- Toda decisão com impacto > 1 módulo OU > 1 semana de refactor → ADR obrigatório
- PR que muda arquitetura sem ADR associado é rejeitado
