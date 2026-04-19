---
type: brief
title: ApseOS Design Brief — north star pro rebuild
status: active
date: 2026-04-19
author: Caio Imori
---

# Design Brief — ApseOS v2

## Por que reset

A tentativa 1 (v0.1-mvp-localhost, preservada como tag git) entregou todo o fluxo funcional — auth, clientes, contratos, cobranças, dashboard — mas com **UX/UI abaixo do padrão SINAPSE**. Caio (2026-04-19): *"literalmente uma merda"*.

Diagnóstico dos erros (pra não repetir):

1. **Tokens aplicados sem soul** — tudo usou `bg-[var(--surface-void)] border-[var(--border-default)] shadow-[var(--shadow-xs)]` em caixas retangulares idênticas. Resultado: plataforma genérica que qualquer boilerplate Next + shadcn produz.
2. **Ausência de hierarquia visual real** — headings, body, meta todos com pouca diferenciação. Nada puxa o olho.
3. **Zero motion com propósito** — `tw-animate-css` importado mas nenhuma animação aplicada. Interface estática, sem vida.
4. **Densidade errada pro contexto** — tabelas densas onde deveriam ter respiro; formulários esparsos onde deveriam ser compactos.
5. **Navegação amadora** — cards de nav em grid básico; nenhum shell consistente (sidebar + topbar). Cada página reinventa o header.
6. **Financeiro sem dignidade** — números monetários não têm destaque tipográfico suficiente; não se lê lucro/prejuízo à distância.
7. **Estados vazios genéricos** — "Sem cobranças" em caixa pontilhada. Sem personalidade, sem direção clara do próximo passo.
8. **Dark mode não validado** — existe no token, nunca foi exercitado visualmente.

## Referências que devem guiar v2

**Fundação:**
- `sinapse-plataform/src/app/globals.css` — caioimori-DS tokens completos (NÃO vem daqui o problema; vem da APLICAÇÃO dos tokens)
- Linear.app — densidade, hierarquia, motion sutil
- Vercel dashboard — monocromático com accent cirúrgico
- Stripe dashboard — números financeiros com tipografia de respeito
- @caioimori tom de voz em conteúdo

**Anti-referências (o que NÃO ser):**
- Any dashboard genérico shadcn out-of-the-box
- QuickBooks, ContaAzul (visual de planilha)
- Plataformas CRM brasileiras com abuso de cor

## Princípios invioláveis pra v2

### 1. **Identidade visual forte em cada tela**
Cada página deve ser reconhecível como ApseOS em 2 segundos. Não pode ser "Next+shadcn padrão".

### 2. **Shell consistente**
- Sidebar esquerda fixa com navegação principal (Clientes, Contratos, Cobranças, Colaboradores, Dashboard)
- Topbar com: org atual + switcher + user menu + sign out
- Content area com breadcrumb consistente
- Footer mínimo

### 3. **Tipografia como design principal**
- Display serif ou geometric sans com tracking agressivo em headings
- Números monetários em tipo proprietário (JetBrains Mono tabular + peso forte + tamanho grande quando critical)
- Escala vertical rigorosa: `text-5xl` pra KPI hero, `text-3xl` pra section heading, `text-sm` pra body, `text-xs` pra meta

### 4. **Cor com cirurgia**
- Default: monocromático completo (preto/branco + grays)
- Cor semântica APENAS em: sinal financeiro (lucro/prejuízo), status crítico (vencido, em risco), feedback de ação (salvo, erro)
- Nunca pra decoração
- Dark mode obrigatório, testado por screenshot A/B antes de merge

### 5. **Motion com propósito**
- Transições entre rotas: fade curto (150ms)
- Hover em interativos: `translateY(-1px)` + shadow lift
- Entrada de modais/drawers: slide com `--ease-craft`
- Loading: skeleton com shimmer, nunca spinner
- Números que mudam: count-up animado

### 6. **Estados vazios com personalidade**
Cada empty state tem:
- Ilustração simples ou ícone grande monocromático
- Headline com personalidade ("Ainda sem cobranças. Gera a primeira.")
- CTA único e óbvio
- Sub-texto opcional explicando valor

### 7. **Densidade adaptada ao contexto**
| Contexto | Densidade |
|---|---|
| Tabela de clientes/contratos | Alta — row height 40px, font-sm |
| Formulários | Média — gap-6 entre campos, labels claras |
| Dashboard KPIs | Baixa — respiro generoso, valor grande |
| Detalhe de entidade | Média-alta — info em grid de 2-3 colunas |

### 8. **Feedback imediato**
- Toda mutation tem optimistic UI
- Toast global pra confirmações (não inline feedback em cada form)
- Loading state em < 100ms senão skeleton

### 9. **Mobile-first no shell, desktop-first no denso**
- Shell responde bem em 375px+
- Tabelas densas assumem ≥ 1024px; em mobile viram cards empilhados

### 10. **Zero "lorem" visual**
Toda tela tem dado real OU estado vazio proposital. Nunca wireframe-ish.

## Componentes canônicos (build ordem)

1. **AppShell** (sidebar + topbar + content) — primeiro, antes de qualquer feature
2. **Money, Margin, KPIBlock** — polimento tipográfico definitivo
3. **DataTable denso com sort/filter/pagination** — genérico
4. **EmptyState** — opinativo com ícone lucide grande
5. **Toast system** — global, via sonner ou custom
6. **CommandPalette** (⌘K) — navegação rápida pós-primeiro setup
7. **Sheet/Drawer** — pra forms longos (novo contrato)
8. **ChartCard** — line + bar mínimos (Recharts monocromático)

## Checklist pra cada PR de UI v2

- [ ] Ambos modos (light + dark) validados por screenshot
- [ ] Tipografia segue escala do design system
- [ ] Zero hex hardcoded
- [ ] Motion presente em interação (hover mínimo)
- [ ] Empty state opinativo se cabível
- [ ] Responsivo em 375px e 1440px
- [ ] Componente é compartilhável (não é one-off CSS)

## Estratégia de implementação

**Fase A (v2.0) — Fundação visual** (1 PR)
AppShell + tokens refinados + AppLayout sidebar + topbar + CommandPalette stub.

**Fase B (v2.1) — Primitivos financeiros polidos** (1 PR)
Money/Margin/KPIBlock com tipografia hero. DataTable genérica. EmptyState. Toast.

**Fase C (v2.2 em diante) — Reconstrução incremental das features**
Migrar story-a-story do backup v0.1, mas agora com o shell e primitivos prontos. Cada feature vira um PR pequeno focado em cole na AppShell.

## Restrições técnicas mantidas

Todas as ADRs de v0.1 seguem válidas:
- ADR-001 modular monolith
- ADR-002 localhost-first com mocks
- ADR-003 Claude via Max CLI (zero API em runtime)
- ADR-004 hexagonal integrations
- ADR-005 RLS multi-tenant
- ADR-006 caioimori-DS (refinado por este brief)

Schema do banco Supabase (projeto `vamtjndfjhqtyiejxnbx`) fica preservado — as 6 migrations já aplicadas continuam válidas. Rebuild é só do frontend + módulos TS.

## Fonte de verdade

- Este brief
- `docs/design/design-system.md` (tokens)
- `docs/adr/*` (decisões arquiteturais)
- Tag git `v0.1-mvp-localhost` (referência executável do que funcionou por baixo — consulta, não copia)
