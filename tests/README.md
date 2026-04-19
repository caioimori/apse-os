# tests/

Pirâmide de testes do ApseOS.

## Estrutura

| Diretório | O que roda | Quando |
|---|---|---|
| `unit/` | lógica pura (`shared/domain`, util) — Vitest | Toda mudança |
| `integration/` | módulo + Supabase local — Vitest | Toda mudança |
| `contract/` | contratos entre módulos (A consome API pública de B) | Toda mudança |
| `e2e/` | Playwright — fluxo crítico end-to-end | PR + nightly |

## E2E crítico (bloqueia merge se falhar)

```
login → criar cliente → criar contrato com split → gerar invoice (mock Asaas) →
receber webhook simulado → ver lucro correto no dashboard
```

## Cobertura alvo

- `shared/domain`: 80%+
- `modules/*/domain`: 70%+
- `integrations/*/mock`: 100% (mocks são determinísticos)
- Resto: não é meta, é resultado
