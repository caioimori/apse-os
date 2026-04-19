# @apse/web

Next 15 (App Router) + React 19 + Tailwind v4. Frontend do ApseOS — **layer fino**. A maior parte da lógica vive em `packages/modules/*`.

```bash
pnpm --filter @apse/web dev
```

## Convenções
- `src/app/` — rotas Next (RSC por padrão)
- Rota importa `@apse/modules-{nome}/api` pra falar com módulo
- Nunca chamar Supabase direto — usar `@apse/shared-db`
- Nunca chamar integração direto — usar factory em `@apse/integrations-{nome}`
- Tokens + componentes em `@apse/shared-ui`

Ver `docs/runbooks/dev-local.md`.
