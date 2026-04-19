---
type: reference-analysis
title: Linear + Vercel — benchmark de motion e dark-first design
source: linear.app + vercel.com
captured_at: 2026-04-19
method: Chrome CDP + puppeteer-core · full-page PNGs + computed tokens + CSS rules extraction
artifacts: C:/temp/abacatepay-scrape/out/linear/ · /vercel/ (não comitar)
---

# Linear + Vercel — benchmark de motion

Complementa `abacatepay-analysis.md`. AbacatePay serviu pra estrutura; Linear e Vercel servem pra **motion de verdade + dark-first + tipografia que é design**.

## 1. Comparação lado a lado

| Dimensão | AbacatePay | Linear | Vercel |
|---|---|---|---|
| **Paradigma** | Light com acento mint | Dark puro com accent roxo | Dark puro com accent blue |
| **Body bg** | `#FFFFFF` | `rgb(9, 9, 9)` (quase preto) | `rgb(0, 0, 0)` puro |
| **Body text** | `#121217` | `#FFFFFF` | `rgb(237, 237, 237)` |
| **Fonte primary** | Fustat | **Inter Variable** | **Geist** (proprietária) |
| **Weights usados** | 400, 500, 600 | 400, **450**, 500 | 400, 500, 600 |
| **Accent primary** | `#9EEA6C` (mint) | `rgb(94, 105, 209)` **#5E69D1** (roxo Linear) | `rgb(0, 112, 243)` **#0070F3** (Vercel Blue) |
| **Radii dominante** | 8-24px | **9999px + 12px** (pill + card) | **6px** + 9999px |
| **Transitions CSS autorais** | 0 | ~10 | **~60** |
| **Keyframes autorais** | 2 (carousel) | ~10 | **~75** |
| **Veredicto motion** | Weak | Medium | **Strong** |

## 2. Linear — decodificado

### Paleta (dark)
| Uso | Valor |
|---|---|
| surface-void | `rgb(9, 9, 9)` |
| surface-raised | `rgb(28, 28, 29)` |
| text-primary | `#FFFFFF` |
| text-secondary | `rgb(226, 227, 229)` |
| text-tertiary | `rgb(147, 148, 150)` |
| text-quaternary | `rgb(107, 111, 118)` |
| accent-brand | `rgb(94, 105, 209)` #5E69D1 |

### Tipografia
- **Inter Variable** + `"SF Pro Display"` + system fallbacks + `"Linear Thai"` (customizada por idioma)
- Pesos **400 · 450 · 500** — `450` é sinal de sofisticação (Inter Variable medium-light, cria peso "entre" regular e medium)
- Escala compacta: **12, 13, 16, 18px** — sem font-size enorme, hierarquia vem de tracking + cor
- **Tight letter-spacing** em headings (tracking-tight consistente)

### Radii
Só dois valores em uso: **`9999px`** (pill — botões, tags) e **`12px`** (cards). Elegância pela restrição.

### Motion
~17 transitions autorais, notáveis:
- `#loadingText :: opacity 0.8s ease-out 0.8s` (delay intencional no loading)
- `#loading #logo path :: fill 0.4s` (logo morph no carregamento)
- Imagens com `transform 0.3s` em modal zoom
- Keyframe `logoBackgroundPulse` (logo pulsante — marca viva)

### Assinatura Linear
- **Pill buttons** (radius 9999px) — Linear, Supabase, Stripe Shop usam
- **Suspense fade-in** (keyframe `suspenseFadeIn`) — cada seção que carrega faz fade elegante
- **Dark quase-preto não puro** (`#090909` em vez de `#000`) — sutileza que diferencia

## 3. Vercel — decodificado

### Paleta (dark)
| Uso | Valor |
|---|---|
| surface-void | `rgb(0, 0, 0)` (preto puro) |
| surface-base | `rgb(10, 10, 10)` |
| text-primary | `rgb(237, 237, 237)` (off-white, não branco puro) |
| text-secondary | `rgb(161, 161, 161)` |
| text-tertiary | `rgb(143, 143, 143)` |
| text-quaternary | `rgb(136, 136, 136)` |
| text-dim | `rgb(82, 168, 255)` (link blue) |
| accent-blue | `rgb(0, 112, 243)` #0070F3 |
| accent-violet | `rgb(191, 122, 240)` (v0/AI brand) |

### Tipografia
- **Geist** (font-family próprio Vercel, open source via `@vercel/geist`) — geometric sans muito clean
- Pesos **400, 500, 600**
- **Escala rica**: 8, 12, 13.33, 14, 16, 20, 24, 32, 48px — Vercel respeita proporção 1.25 em headings grandes
- Tracking: tight agressivo em hero (`-0.02em` a `-0.04em` em displays)

### Radii
- **`6px` dominante** — tight, tech-first (Vercel não usa 12/16 grandes como AbacatePay)
- `9999px` em pills/badges
- `2px` e `4px` em detalhes
- **Sem radius 12/16/24** — aesthetic mais "engineer" que "consumer"

### Motion — **aqui mora a aula**
**60 transitions autorais** + **75 keyframes**:
- Curve assinatura: `cubic-bezier(0.3, 0.57, 0.07, 0.95)` — `swift-out` (rápida saída, lenta entrada)
- `transform 0.15s` em hover de chevrons/icons
- `height 0.2s` em collapsibles — altura animada
- `border-color 0.15s, box-shadow 0.15s` em inputs — feedback de foco
- Keyframes **proprietários por componente**: `copy-button fadeIn/Out`, `new-dialog fadeIn/Out`, `code-block hide/show`
- `grid-module disappear` em múltiplos breakpoints — grid colapsa com animação diferente por viewport
- **`v0-avatar drawAndErase`** — avatar "se desenha" com stroke animado (branding do v0 AI)

### Assinatura Vercel
- **Preto puro absoluto** `#000` — compromisso radical
- **Off-white** (`#EDEDED`, não `#FFF`) em texto — reduz contraste gritante
- **Link blue** (`#0070F3`) como único accent cromático + violet pra v0/AI
- **Motion em tudo que se mexe** — nenhum micro-elemento estático
- **Code blocks premium** com syntax highlight cuidadoso

## 4. Padrões de motion que o ApseOS deve roubar

### Do Linear
1. **Pill radius 9999px** em botões principais e tags (não em cards) — identidade elegante
2. **Weight `450` em body** se usarmos Inter Variable — diferencia de "só outro SaaS"
3. **`450` em hover state** de nav items — sutileza quase imperceptível
4. **Delay intencional em loading** (0.8s) — em vez de spinner instantâneo
5. **Logo com subtle pulse** durante carregamento — marca viva

### Do Vercel
6. **Curve `cubic-bezier(0.3, 0.57, 0.07, 0.95)`** como `--ease-swift-out` — assinatura de motion
7. **Transition em `border-color` + `box-shadow`** em focus de input — feedback rico
8. **`height` animada** em collapsibles (0.2s) — nada abre/fecha instantâneo
9. **Keyframe por componente** — `toast-fade-in`, `dialog-fade-in`, `code-reveal`, etc. Cada componente tem motion próprio
10. **Chevron rotation** em dropdowns/acordeões — `transform 0.15s` sempre
11. **Copy button feedback** — fade-in de ícone "copied!" separado do button parent

## 5. Diferenças ideológicas

### Radii: **tight vs generous**
- Vercel (6px) vs AbacatePay (12-24px) é decisão **tech vs friendly**
- ApseOS é ferramenta financeira profissional → **recomenda intermédio: 8-10-12** (entre Vercel e AbacatePay)

### Preto: **puro vs quase-preto**
- Vercel `#000` vs Linear `#090909`
- Linear é mais elegante pra telas grandes (menos fadiga ocular); Vercel é mais dramático
- **Recomenda Linear-way pra telas densas de trabalho**

### Tipografia: **geometric vs variable**
- Vercel Geist (geometric puro) vs Linear Inter Variable (humanist com variable weight)
- Inter Variable tem vantagem: **weight 450** que dá "peso intermediário" impossível em Geist
- **Recomenda Inter Variable** (gratuito, battle-tested, tem Variable font axis pra weight preciso)

## 6. Recomendação refinada pro ApseOS v2

**Síntese: Dark-first + Inter Variable + accent proprietário**

| Token | Valor proposto | Origem |
|---|---|---|
| `--surface-void` | `#080808` | Linear-way (quase preto) |
| `--surface-base` | `#0E0E10` | ligeiramente elevado |
| `--surface-raised` | `#161618` | cards |
| `--surface-overlay` | `#1D1D20` | modais |
| `--text-primary` | `#F5F5F7` | off-white, nunca pure white |
| `--text-secondary` | `#A1A1A8` | labels |
| `--text-tertiary` | `#6E6E76` | meta, captions |
| `--border-default` | `rgba(255,255,255,0.08)` | sutil |
| `--border-strong` | `rgba(255,255,255,0.14)` | hover |
| `--accent-brand` | **proposta: `#6D5EF0`** (roxo-azul saturado) OU `#00D4A3` (teal-mint) OU `#FF7A59` (terracota) | a decidir |
| `--accent-profit` | `#34D399` (green-400) | Money positivo |
| `--accent-loss` | `#FB7185` (rose-400) | Money negativo |
| `--radius-card` | `10px` | intermediário |
| `--radius-button` | `8px` | tight |
| `--radius-pill` | `9999px` | tags/chips |
| `--ease-swift-out` | `cubic-bezier(0.3, 0.57, 0.07, 0.95)` | Vercel-way |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | momentos de delight |
| `--duration-fast` | `150ms` | hover colors |
| `--duration-base` | `200ms` | height, opacity |
| `--duration-slow` | `400ms` | modal enter |

**Tipografia:**
- Sans: **Inter Variable** (via `next/font/google`)
- Mono: **JetBrains Mono** pra números monetários (mantido de caioimori-DS)
- Display hero: Inter Variable weight **600** + tracking `-0.03em` em KPIs

**Motion obrigatório:**
- Todo interativo: `transition: color 150ms, background-color 150ms, border-color 150ms` no mínimo
- Inputs focus: `transition: border-color 150ms, box-shadow 150ms` (Vercel-way)
- Cards hover: `transform: translateY(-1px); transition: transform 200ms`
- Modal/Sheet: `translateY(12px) + opacity` com `--ease-swift-out` 400ms
- Toasts: sonner default (já é Linear-quality)
- Loading: **skeleton shimmer** com keyframe próprio (nunca spinner genérico)
- KPI number change: countUp (usar `react-countup` ou custom)

**Anti-patterns banidos:**
- `hover:opacity-50` (AbacatePay-way — NUNCA)
- radii > 16px (aesthetic "cozy" demais pra ferramenta financeira)
- white puro em fontes (#FFF) — sempre off-white pra reduzir contraste
- preto puro em fontes claras também — usar `#121217` ou `#0E0E10` se for light mode

## 7. Decisão que fica pro Caio

Com esses 3 benchmarks, a decisão de paleta fica mais fácil:

### Opção A — "Dark Linear-way"
Preto quase puro + Inter Variable + accent roxo-azul proprietário (`#6D5EF0` ou similar). Seriedade máxima, motion rico, toolkit sofisticado.
**Prós:** alinha com sinapse-plataform; reaproveita caioimori-DS; acent diferencia de Linear sem confundir.
**Contras:** exige disciplina constante pra não virar Linear clone.

### Opção B — "Light AbacatePay-way mas sem cair no mesmo buraco"
Branco + Fustat/Inter + acento mint ou roxo. Amigável, acessível.
**Prós:** financial data legível de dia; acento pode ser marca própria.
**Contras:** é o que a v0.1 tentou e falhou; alto risco de parecer genérico de novo.

### Opção C — "Dual mode rigoroso desde o start"
Dark como padrão (pra Caio/Soier trabalhando à noite) + Light validado por screenshot em cada PR. Mesma estrutura, cores invertidas.
**Prós:** flexibilidade total; demonstra competência visual.
**Contras:** 2x o trabalho de validação visual; exige tokens perfeitos.

**Recomendação:** **Opção A dark-first primeiro**, light como Fase D pós-validação. Foco e menos risco.

## 8. Artefatos

Local (não comitar):
- `C:/temp/abacatepay-scrape/out/linear/` — 10 screenshots + 10 tokens JSONs
- `C:/temp/abacatepay-scrape/out/vercel/` — 9 screenshots + 9 tokens JSONs
- Stripe falhou por page height limit — re-rodar com `captureBeyondViewport: false` se precisar

Total extraído nas 3 sessões: **47 páginas capturadas, ~140KB de tokens JSON, identificação de 3 filosofias de DS distintas**.
