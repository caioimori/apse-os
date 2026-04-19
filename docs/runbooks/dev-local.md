---
type: runbook
title: Dev local — setup e operação
date: 2026-04-18
---

# Runbook — Dev local

## Pré-requisitos
- **Node 20** (ver `.nvmrc` — use `fnm` ou `nvm`)
- **pnpm 9+** (`npm i -g pnpm`)
- **Docker Desktop** rodando
- **Supabase CLI** (`npm i -g supabase` ou Scoop/Homebrew)
- **Git** configurado com usuário SINAPSE

## Primeira vez (bootstrap)

```bash
# 1. Clone + install
git clone <repo> ApseOS && cd ApseOS
pnpm install

# 2. Env
cp .env.example .env.local
# Editar: APSE_*_MODE=mock (default), SUPABASE_URL aponta localhost

# 3. Supabase local
supabase start
# Output salva: ANON_KEY, SERVICE_ROLE, URLs — copiar pra .env.local

# 4. Migrations + seeds (quando existir — Story 1.1)
supabase db reset

# 5. Types
pnpm db:types

# 6. Sobe app
pnpm dev
```

Acesse:
- App: http://localhost:3000
- Supabase Studio: http://localhost:54323
- Inbucket (email mock): http://localhost:54324

## Comandos diários

```bash
pnpm dev                    # Next + watch
pnpm lint                   # Biome check
pnpm format                 # Biome format
pnpm typecheck              # tsc no-emit em todos packages
pnpm depcheck               # dependency-cruiser valida boundaries
pnpm test                   # Vitest watch
pnpm test:e2e               # Playwright
pnpm db:reset               # supabase db reset + seeds
pnpm db:types               # regenera types TS
```

## Swap de adapters

Arquivo `.env.local`:
```
APSE_ASAAS_MODE=mock        # mock | sandbox | production
APSE_RESEND_MODE=mock
APSE_CLAUDE_MODE=mock       # SEMPRE mock no MVP (ADR-003)
APSE_SONAR_MODE=mock
APSE_PIPEDRIVE_MODE=mock
```

Reiniciar `pnpm dev` após mudar flag.

## Problemas comuns

### Supabase não sobe
```bash
docker ps                   # Docker Desktop aberto?
supabase stop && supabase start
```

### Porta 3000 ocupada
```bash
# Windows
netstat -ano | findstr :3000
# Matar processo pelo PID

# WSL/Linux/Mac
lsof -ti:3000 | xargs kill
```

### Types desatualizados
```bash
pnpm db:types
# Commit resultado em packages/shared/db/types.ts
```

### dependency-cruiser falhando
Leia erro — está dizendo que módulo X importa interno de Y. Refatore pra usar `/api` ou evento (ver `module-boundaries.md`).

### Dark mode quebrado
Checar que `packages/shared/ui/styles/tokens.css` está importado em `apps/web/src/app/layout.tsx` ANTES de `globals.css` do Tailwind.

## Windows (notas)

- Preferência forte por **WSL2** pra Supabase CLI
- Se rodando PowerShell nativo: instalar Supabase CLI via Scoop
- Path com espaços (ex: `Caio Imori`) funciona, mas evite em scripts shell

## Reset completo (nuclear)

```bash
supabase stop --no-backup
rm -rf node_modules .next apps/web/.next packages/*/dist
pnpm install
supabase start
pnpm db:reset
pnpm dev
```

## Ver também
- `docs/runbooks/db-reset.md`
- `docs/architecture/module-boundaries.md`
- ADR-002 (localhost-first)
