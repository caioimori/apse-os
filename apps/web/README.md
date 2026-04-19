# @apse/web

Next 15 app — **layer fino**. A maior parte da lógica vive em `packages/modules/*`.

## Inicializar (ainda não feito)

Na raiz do monorepo:

```bash
cd apps/web
pnpm create next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --yes
cd ../..
```

## Convenções

- `src/app/` — rotas Next (RSC por padrão)
- Rota importa `@apse/modules-{nome}/api` pra falar com módulo
- Nunca chamar Supabase direto — usar `@apse/shared-db`
- Nunca chamar integração direto — usar factory em `@apse/integrations-{nome}`
- Shadcn/ui em `packages/shared/ui` (compartilhado cross-módulo)
