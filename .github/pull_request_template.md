## O que muda

<!-- 1-3 bullets em português. Foque no "por quê" antes do "o quê". -->

## Story
<!-- `docs/stories/X.Y.*.md` — link obrigatório (documentation-first). -->
Closes #

## ADRs impactados
<!-- Lista ADRs afetados ou "nenhum". -->

## Checklist
- [ ] Story associada existe e está >= Ready
- [ ] AC cobertos por testes (ou justificativa)
- [ ] `pnpm lint && pnpm typecheck && pnpm depcheck` passando local
- [ ] Migrations (se houver) respeitam ADR-005 (RLS + `org_id`)
- [ ] Zero `@anthropic-ai/sdk` / `ANTHROPIC_API_KEY` (ADR-003)
- [ ] Boundaries respeitados — sem import de `domain/` ou `db/` cross-module (ADR-001)
- [ ] Tokens do design system aplicados — nenhum hex hardcoded fora de `tokens.css` (ADR-006)
- [ ] Documentação (runbook / ADR) atualizada se aplicável

## Review
<!-- Solo (Caio): marcar "self-approve OK". -->
<!-- Dupla: @matheussoier ou @caioimori no assignee + reviewer. -->

## Como testar
<!-- Passos curtos pro reviewer reproduzir. -->

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
