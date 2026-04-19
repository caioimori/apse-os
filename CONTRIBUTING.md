# Contribuindo — ApseOS

Leia antes de codar. Inegociável.

## Gitflow

```
main         ← produção. Protegido. PR-only.
 ↑ PR (release)
develop      ← integração. Default branch. PR-only.
 ↑ PR (feature/fix/chore)
{owner}/{tipo}/{slug}
   ex: caio/feat/billing-invoice-mock
       soier/fix/rls-members-policy
```

### Regras
- **Nunca push direto em `main` ou `develop`.** Sempre via PR.
- Feature branch sai de `develop`, PR volta pra `develop`.
- Release: PR de `develop` → `main` quando conjunto de features tá pronto.
- Hotfix urgente: PR direto em `main` + back-merge pra `develop`.

### Naming
- **Owner:** `caio` ou `soier` (quem tá trabalhando).
- **Tipo:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.
- **Slug:** kebab-case, ≤ 40 chars, descritivo.

### Exemplos
```
caio/feat/auth-organizations
caio/fix/money-formatter-locale
soier/chore/upgrade-next-15.1
caio/docs/adr-007-observability
```

## Commits — Conventional Commits

```
<tipo>(<escopo>): <resumo em 72 chars>

<corpo opcional explicando o "porquê">

<footer opcional: Closes #X, BREAKING CHANGE: …>
```

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.

Escopos comuns: `billing`, `contracts`, `auth`, `ui`, `db`, `ci`, `docs`.

## PRs

1. Feature branch: `git checkout -b caio/feat/{slug}` saindo de `develop`
2. Commit conventional — agentes fazem via `git commit` (nunca skipar hooks)
3. Push + abrir PR via `gh pr create --base develop`
4. Template do PR preenchido (story linkada, checklist marcado)
5. CI verde obrigatório
6. Review:
   - **Solo (Caio sem Soier):** self-approve permitido em features pequenas
   - **Dupla (Caio + Soier):** review cruzado obrigatório
7. Merge: `--squash` default, `--merge` pra release PR (develop → main)
8. Deletar branch após merge

## Gates (CI bloqueia merge se falhar)

- `biome check` — lint + format
- `tsc -b` — typecheck monorepo
- `depcruise` — boundaries (ADR-001/003/004)
- `secretlint` — secret scan
- `next build` — app builda
- `vitest` — testes unit (non-blocking enquanto suite não existe)

## Hotfixes críticos

```
git checkout main && git pull
git checkout -b caio/fix/hotfix-{slug}
# commit
git push -u origin HEAD
gh pr create --base main --title "fix: …"
```

Após merge em `main`: PR automático `main → develop` pra não perder o fix.

## Anti-padrões (bloqueados)

- ❌ Push direto em `main` ou `develop`
- ❌ `--no-verify` pra pular pre-commit
- ❌ `--force-push` em branch compartilhada
- ❌ Commit sem story associada (documentation-first)
- ❌ Merge sem CI verde
- ❌ PR sem template preenchido
- ❌ Hex hardcoded em CSS (use tokens — ADR-006)
- ❌ Import interno cross-module (ADR-001)
- ❌ `@anthropic-ai/sdk` (ADR-003)

## Delegação (Safe Collaboration)

Usuário (Caio/Soier) não roda comando técnico. Agentes cuidam de:
- criar/mergear branch, abrir/aprovar/mergear PR
- aplicar migration + rodar type regen
- resolver conflito simples antes de pedir ajuda

Se o agente precisa que você rode algo, é porque ele falhou — avise.

## Referências
- `docs/ROADMAP.md` — passos do MVP
- `docs/stories/README.md` — stories index
- `docs/adr/README.md` — decisões
- `.claude/rules/apseos-local.md` — regras do projeto
