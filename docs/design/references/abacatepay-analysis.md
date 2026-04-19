---
type: reference-analysis
title: AbacatePay — análise completa de design system
source: https://app.abacatepay.com
captured_at: 2026-04-19
method: Chrome CDP + puppeteer-core + full-page screenshots (28 rotas varridas)
artifacts: C:/temp/abacatepay-scrape/out/ (local — não comitar)
---

# AbacatePay — análise de design system

Referência de alto padrão pra fintech brasileira (gateway Pix + cartão + checkout). **Não é a estética que o ApseOS vai copiar 1:1**, mas serve de benchmark em: densidade, consistência de AppShell, hierarquia tipográfica, personalidade da marca aplicada em UI.

## Identidade de marca

- **Mascote:** abacate estilizado (pinpoint de reconhecimento imediato)
- **Verde mint** `rgb(158, 234, 108)` / `#9EEA6C` é o accent primário e puxa toda a ação (botões, active states, KPI accents)
- **Verde escuro** `rgb(36, 76, 78)` — duotone do mascote, usado em headlines emocionais (404 "Ops")
- **Tom verbal:** direto, levemente informal ("Ops", "Sua Loja"), bilíngue em elementos técnicos ("Sandbox Mode")
- **Banner ambiente de teste** laranja (`~rgb(255, 169, 76)`) fixo no topo full-width em modo sandbox — forte sinal contextual

## Tokens — paleta extraída

### Surfaces
| Token proposto (ApseOS) | Valor capturado | Uso observado |
|---|---|---|
| `surface-void` | `#FFFFFF` | cards de dado, inputs |
| `surface-canvas` | `#F6F8FA` (rgb 246 248 250) | background da content area |
| `surface-muted` | `#E2E7F1` (rgb 226 231 241) | table headers, dividers, border sutil |
| `surface-inverse` | `#121217` (rgb 18 18 23) | text primary (quase preto com tint cool) |

### Texto
| Uso | Valor |
|---|---|
| primary | `#121217` — quase preto com leve cool tint |
| secondary | `rgb(138, 138, 163)` — gray com leve lilás, usado em labels ("Total em vendas") |
| placeholder | mesmo secondary em inputs |
| inverso (em bg escuro) | `#FFFFFF` |

### Accents semânticos
| Token | Valor | Usado em |
|---|---|---|
| `accent-brand` | `#9EEA6C` (verde mint) | primary button, active nav item, success highlight |
| `accent-warn-ambient` | `#FEA94C` (laranja) | sandbox banner, ícone cartão crédito |
| `accent-info` | `#B26EE6` (roxo-lavanda) | ícone Pix, elementos "instant" |
| `accent-success-deep` | `#19C7A8` (teal) | ícone Pix QR Code, saldo positivo |
| `accent-secondary` | `#FF9D5C` (laranja secundário) | variante warm secundária |

### Tipografia
- **Fonte principal:** `Fustat, sans-serif` — geometric sans moderno, tem personalidade mas neutro o suficiente pra números. Google Font gratuita.
- **Tamanhos detectados:** `12px`, `14px`, `16px` (base), `18px`, `26px`, + hero maiores em KPI (aprox 36-44px)
- **Pesos:** 400 (body) · 500 (labels/nav) · 600 (headings/KPIs/CTAs)
- **Body bg:** branco puro `oklch(1 0 0)` · text: `oklch(0.21 0.006 285.885)` (~#121217)
- **Root font-size:** 16px

### Radii
Escala rica: `4 · 6 · 8 · 12 · 16 · 24` + `9999px` (pill). Valores típicos observados:
- inputs/selects: **8px**
- buttons pequenos: **8px**
- cards pequenos (KPI): **12-16px**
- cards grandes/container principal: **24px**
- pagination arrows, avatar: `9999px`

### Borders
- cor dominante: `rgb(226, 231, 241)` — azul-acinzentado muito suave
- largura: sempre `1px`
- nunca cor decorativa — apenas estrutura

### Shadows
Extremamente minimalistas — quase todo elemento usa `rgba(0,0,0,0)` (sem sombra) OU sombra ultra-sutil de `1-2px`. Cards elevados usam só border, não shadow. **Depth via hierarquia de surfaces**, não via drop-shadow.

### Motion
Observação: screenshots não capturam motion, mas por convenção Tailwind + Radix (stack deles) espera-se:
- transitions 150-200ms em hover
- sonner toasts slide+fade 500ms

## AppShell — arquitetura visual

```
┌─────────────────────────────────────────────────────────┐
│ BANNER sandbox (fixed top, full width, laranja)         │ ← 48px
├──┬──────────────────────────────────────────────────────┤
│  │ [🥑] Sua Loja / 👤 Clientes                    🔔    │ ← topbar 80-100px
│  │ ═══════════════════════════════════════════════      │
│  │                                                       │
│L │  ┌────────────────────────────────────────────┐     │
│E │  │  CONTENT CARD (surface-void, radius-24)    │     │
│F │  │  gerando seu próprio "frame" dentro        │     │
│T │  │                                             │     │
│  │  │  H1 "Clientes" (26px+, weight 600)         │     │
│S │  │                                             │     │
│I │  │  Search + filters + CTA primary (mint)     │     │
│D │  │                                             │     │
│E │  │  Table header (surface-muted bg, radius)   │     │
│  │  │  Empty state centralizado                  │     │
│  │  │  Pagination arrows circulares              │     │
│  │  └────────────────────────────────────────────┘     │
│  │                                                       │
│🤝│                                                       │
│👤│                                                       │
└──┴──────────────────────────────────────────────────────┘
```

- **Sidebar:** ~80px de largura, só ícones (não expansível), separadores visuais implícitos via grupos
- **Topbar:** breadcrumb + sininho de notificação + (sem user menu visível — provavelmente no avatar bottom-left)
- **Content card:** cria "frame" interno dentro da canvas gray — a content area tem padding generoso e radius grande (24px), dando ar de janela flutuante sobre o canvas
- **WhatsApp flutuante bottom-left:** canal de suporte persistente
- **Code bracket icon:** atalho pra developers/API keys
- **Avatar bottom-left:** user menu + config pessoal

### Sidebar icon set (de cima pra baixo)
1. 🥑 Logo abacate (volta ao home)
2. Layout/grid (loja / multi-store switcher)
3. Barras gráfico (dashboard) — **active: bg mint + ícone preto**
4. Storefront (minhas lojas)
5. Sliders (ajustes / configurações do produto)
---
6. Code brackets `</>` (developers)
7. WhatsApp (suporte)
8. Avatar (conta)

## Páginas padrão observadas

### 1. Dashboard (rota principal)
- 6 "chips" de período: `Hoje`, `Esse mês`, `Últimos 30`, `Últimos 90`, `Todo o período`, `Personalizado`
- Chip ativo = fill mint + texto preto; inativo = outline branco + texto preto
- 3 KPI blocks em row: **Total em vendas / Total de transações / Ticket Médio**
- Label em `text-secondary` uppercase-ish; valor em **hero number** 36-44px weight 600
- Bloco "Métodos de pagamentos" com progress bar segmentada colorida (cartão laranja / pix roxo / pix QR teal) + linha-item com dot + label + valor R$ right-aligned
- Linha horizontal separadora + "Total" com badge verde "+"
- 2 gráficos lado a lado: **Desempenho de vendas** (linha) / **Evolução do Ticket Médio** (linha) — com tooltip de info `(i)`

### 2. Lista (Clientes, Cobranças, etc)
- Breadcrumb topbar: `🏪 Sua Loja / 👤 Clientes`
- H1 grande da seção
- Search field largo à esquerda (com ícone lupa) + CTA primary mint à direita
- Table header em `surface-muted` bg + radius arredondado
- Colunas com padding generoso
- Empty state: texto centralizado "Nenhum dado encontrado" em gray médio
- Pagination bottom-right: 2 setas em círculos outline

### 3. Cobranças (mais densa)
- 3 KPI blocks: **Disponível pra saque / Em processamento / Bloqueado** — com ícone info `(i)` em cada
- Setinha `>` entre blocos sugere fluxo "disponível → processamento → bloqueado"
- Toolbar com: search + 2 dropdowns (status, checkout abacate) + **Exportar** (com ícone upload) + **Customizar** (com ícone pincel) + CTA primary mint "+ Criar checkout"
- Table com colunas: E-mail / Valor / Método / Status / Criação / ID / Ações

### 4. Estado vazio (404 e listas)
- Usa mascote **grande e duotone** (verde claro outline + verde escuro detail)
- Headline em verde escuro `rgb(36, 76, 78)` peso bold — emocional, não funcional
- Sub-texto 2 linhas em gray
- **Dual CTA**: secondary outline + primary mint — pattern útil pra dar escape + ação
- Tipografia do "404" é **fat bold** integrando o mascote como o "0" — identidade forte

## Padrões de interação

- **CTA primary:** fill mint `#9EEA6C`, texto preto, weight 600, padding 16px×12px, radius 8-12px
- **CTA secondary:** fill branco, border `1px` cor `rgb(226,231,241)`, texto preto
- **Destructive:** não observada na navegação, mas padrão seria texto rose/vermelho em ghost button (especulativo)
- **Input:** bg branco, border 1px cinza-azul, radius 8px, ícone à direita (search) ou esquerda (ícone semântico)
- **Select:** parece input + chevron-down à direita
- **Badge/pill:** Hoje chip sugere padrão — fill colorido + texto preto quando ativo

## 10 lições pra ApseOS v2 absorver

1. **Uma cor primary dominante que É a marca.** AbacatePay é o verde mint. ApseOS precisa eleger uma — seja "preto total" ou uma cor proprietária. Sem cor primary = aparência genérica.
2. **Banner contextual global.** "Sandbox Mode" laranja ensina sinalização de ambiente. ApseOS pode ter banner amarelo em dev/staging.
3. **Content card dentro do canvas.** Em vez de content full-bleed, envolver em card com radius-24 cria "janela" elegante.
4. **Sidebar ícones-only, 80px.** Decisão forte. Elimina ambiguidade de expand/collapse e força icon-set consistente.
5. **KPI blocks side-by-side com número hero.** Valores monetários precisam de 36-44px weight 600. Nunca em parágrafo.
6. **Breadcrumb com ícones.** Aumenta legibilidade e personalidade sem custo. `🏪 Sua Loja / 👤 Clientes`.
7. **Empty state é oportunidade de marca, não afterthought.** Mascote grande + headline emotiva + dual CTA.
8. **Chips de período > date picker.** Pra SaaS financeiro, 90% do uso é filtro temporal relativo. Chips `Hoje/Esse mês/30d/90d/Todo período` cobrem 95%, "Personalizado" cobre o resto.
9. **Toolbar rica com ícones.** Actions como "Exportar", "Customizar" com mini-ícones dão sofisticação sem gastar pixel de label.
10. **Cor semântica com saturação controlada.** Verde do brand (mint saturado), teal (success deep), roxo (Pix), laranja (warn), rose (destrutivo). Nunca mais de 2 acentos na mesma tela.

## Motion — análise honesta

Extraí CSS completo + 33 frames de screencast durante hover. Verdict: **AbacatePay é weak em motion**.

### Evidência bruta (motion-rules.json)

- **13 transitions CSS customizadas** — TODAS de libs de terceiros (sonner toast, driver.js onboarding). Zero motion "autoral".
- **14 animations** — 2 da app (`feedbackTrackLeft/Right` pro carousel de depoimentos, provavelmente fora do dashboard), resto é lib.
- **21 keyframes** — 100% utility Tailwind (spin, pulse, bounce, skeleton) ou libs.
- **25 transforms** — apenas em elementos internos de libs.

### Padrão real em elementos interativos

Via `interactive-samples.json` (30 botões/links amostrados):
- Todos usam Tailwind default `transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` + mesma curve pra bg/border/etc — **ease-in-out padrão, 150-200ms**
- **Hover effect dominante: `hover:opacity-50`** ← anti-pattern visível, transmite "disabled" em vez de "interactive"
- **Zero `transform` em hover/active** — sem lift, sem scale, sem shadow animation
- Active state dos nav items é troca de cor pura (sem bounce, sem scale)

### Veredicto

AbacatePay vende credibilidade por **estrutura e consistência**, não por motion. É um "competent minimum" — o mesmo padrão que 80% dos dashboards usam por default do Tailwind.

**Isso é exatamente o que o DESIGN_BRIEF do ApseOS diagnosticou como erro #3 ("Zero motion com propósito") na v0.1.**

Ou seja: se copiarmos só AbacatePay, vamos cair no mesmo buraco. Pra motion de verdade precisamos olhar:
- **Linear** — spring physics em abertura de modal, tactile em hover de row
- **Vercel** — transições de rota suaves, skeleton coordenado
- **Stripe** — number ticker em KPIs, countUp em totais
- **Framer Motion / GSAP** — biblioteca padrão se queremos ir além de Tailwind transition

### Recomendação pro DESIGN_BRIEF

Manter os 10 princípios mas **refinar o de motion** pra:
- Transições de cor/border em 150-200ms ease-in-out (AbacatePay-like baseline)
- PLUS: `translateY(-1px)` + shadow lift em hover de card/row (Linear-like)
- PLUS: countUp em Money quando valor muda (Stripe-like)
- PLUS: fade-in com `transform: translateY(8px)` em mount de página (Vercel-like)
- PLUS: skeleton shimmer em loading, nunca spinner

## Como o ApseOS v2 deve ser **diferente**

Não copiar direto porque:
- ApseOS é ferramenta de **analytics financeiro interno** — densidade deve ser maior que AbacatePay (gateway tem painel pra lojista casual)
- Paleta caioimori-DS existe e é B&W primeiro. Importar cor viva só se tiver uma decisão de marca consciente. **Alternativa honesta**: manter B&W puro com tipografia agressiva (Linear/Vercel way) e usar semânticos apenas em gráficos financeiros.
- Mascote do ApseOS não existe. Identidade precisa vir de tipografia display + radius proprietário + motion característico, não de ilustração.
- Mobile-first é menos crítico — usuário financeiro sempre desktop 14"+.

## Artefatos locais

Capturados em `C:/temp/abacatepay-scrape/out/` (não comitar por ser heavy + proprietário):
- `dashboard.png`, `customers.png`, `billings.png`, `charges.png`, `pix.png`, `products.png`, `subscriptions.png`, `transfers.png`, `analytics.png`, `integrations.png`, `webhooks.png`, `api-keys.png`, `settings.png`, `team.png` + ~10 outras (muitas 404)
- `tokens-dashboard.json` — 87 CSS variables + samples de bg/fg/border/radius/shadow
- `*.html` — DOM completo de cada rota

Pra capturar mais/atualizar: rodar `node C:/temp/abacatepay-scrape/scrape2.js` com Chrome em `--remote-debugging-port=9222`.

## Próximo passo

Este doc entra como **referência** pro `DESIGN_BRIEF.md`. Caio decide se quer:
- (a) **adotar uma cor primary proprietária do ApseOS** (qual?) e mimicar a estrutura AbacatePay
- (b) **manter B&W puro** estilo Linear/Vercel mas aplicar os 10 aprendizados de estrutura (AppShell, breadcrumb, KPI hero, empty state com alma)
- (c) **híbrido** — B&W pro 80% + 1 cor proprietária (roxo? azul?) como sinal de "ApseOS"

Recomendação pessoal: (b) ou (c). ApseOS transmite seriedade financeira; acento cor só se for decisão de marca consciente com Caio.
