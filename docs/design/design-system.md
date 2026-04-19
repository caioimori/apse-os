---
type: design
title: ApseOS Design System — minimalista baseado em caioimori-DS
status: active
date: 2026-04-18
owner: Caio Imori
---

# ApseOS Design System

Ver ADR-006 pra decisão. Este doc é a **spec implementável**.

## Filosofia

**Clareza > bonito.** ApseOS é ferramenta pra decisão financeira às 23h. Ruído visual custa dinheiro.

Três leis:
1. **Monocromático primeiro** — cor só onde a semântica exige
2. **Densidade legível** — dashboards financeiros precisam de muito dado por tela
3. **Consistência > criatividade** — todo componente novo reusa tokens

## Tokens

Fonte única: `packages/shared/ui/styles/tokens.css` (copiado de `sinapse-plataform/src/app/globals.css`).

### Surfaces — Light
```css
--surface-void:     #FFFFFF;  /* cards, modais */
--surface-base:     #FAFAFA;  /* body bg */
--surface-default:  #F5F5F7;  /* muted/secondary */
--surface-raised:   #EFEFEF;  /* hover */
--surface-overlay:  #E8E8E8;  /* dividers */
--surface-hover:    #E0E0E0;
--surface-alt:      #D5D5D5;
--surface-muted:    #999999;  /* disabled state */
--surface-deep:     #111111;  /* inverse */
```

### Surfaces — Dark
```css
--surface-void:     #000000;
--surface-base:     #0A0A0A;
--surface-default:  #111111;
--surface-raised:   #1A1A1A;
--surface-overlay:  #222222;
--surface-hover:    #2A2A2A;
--surface-alt:      #333333;
--surface-muted:    #666666;
--surface-deep:     #F5F5F7;
```

### Texto
```css
/* light */
--text-primary:   #000;
--text-secondary: rgba(0,0,0, .65);
--text-tertiary:  rgba(0,0,0, .45);
--text-muted:     rgba(0,0,0, .30);
--text-disabled:  rgba(0,0,0, .15);

/* dark → mesmas opacidades, base #FFF */
```

### Accents semânticos (ApseOS-specific)

| Token | Light | Dark | Uso em ApseOS |
|---|---|---|---|
| `--accent-success` (repost) | `#059669` | `#34D399` | Receita, pago, lucro |
| `--accent-danger` (like) | `#E11D48` | `#FB7185` | Prejuízo, atrasado, destrutivo |
| `--accent-info` | `#2563EB` | `#60A5FA` | Neutro/info, links |
| `--accent-warn` | `#D97706` | `#FBBF24` | Alerta, vencendo |

**Soft variants:** mesma cor com opacidade 0.10 (light) / 0.14 (dark) — pra backgrounds de badge.

### Borders
```css
--border-subtle:  rgba(0,0,0, .04);   /* light; dark: rgba(255,255,255, .04) */
--border-default: rgba(0,0,0, .08);
--border-strong:  rgba(0,0,0, .15);
--border-hover:   rgba(0,0,0, .20);
```

### Radius
```css
--radius-card:   16px;
--radius-button: 8px;
--radius-input:  8px;
--radius-modal:  20px;
--radius-badge:  9999px;
```

### Motion
```css
--duration-instant: 80ms;
--duration-fast:    200ms;  /* default interactions */
--duration-normal:  320ms;  /* transitions between views */
--duration-slow:    500ms;  /* loading feedback */

--ease-precise:   cubic-bezier(0.4, 0, 0.6, 1);
--ease-craft:     cubic-bezier(0.165, 0.84, 0.44, 1);
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-decisive:  cubic-bezier(0.65, 0.05, 0, 1);
--ease-smooth:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Typography

- **Sans (UI, body):** `Inter` (next/font/google)
- **Mono (valores monetários, códigos):** `JetBrains Mono`
- **Heading:** mesma `Inter`, peso 600, tracking `-0.02em`
- **Display:** `Inter` 700, tracking `-0.03em`

**Escala (rem, base 16px):**
```
text-xs   0.75   (12px) — labels, captions
text-sm   0.875  (14px) — secondary, tables densas
text-base 1.000  (16px) — body
text-lg   1.125  (18px) — emphasis
text-xl   1.250  (20px) — subheads
text-2xl  1.500  (24px) — h3
text-3xl  1.875  (30px) — h2
text-4xl  2.250  (36px) — h1 / KPI grande
```

**Números financeiros:** SEMPRE `font-mono`, `tabular-nums` (alinhamento decimal).

### Shadows
```css
--shadow-xs: 0 1px 2px  rgba(0,0,0, .06);
--shadow-sm: 0 2px 4px  rgba(0,0,0, .08);
--shadow-md: 0 4px 16px rgba(0,0,0, .12);
--shadow-lg: 0 8px 32px rgba(0,0,0, .16);
--shadow-xl: 0 16px 48px rgba(0,0,0, .20);
```
Uso: `xs` em cards estáticos, `md` em dropdown, `lg` em modal, `xl` em sheet/drawer.

### Glass (uso restrito)
```css
--glass-bg:       rgba(255,255,255, .7);
--glass-blur:     blur(12px);
--glass-saturate: saturate(1.8);
```
**Onde usar:** nav sticky, header de modal, nada mais.
**Onde NÃO usar:** cards de dado financeiro (legibilidade primeiro).

## Componentes canônicos

Stack: shadcn/ui (base) + wrappers em `@apse/shared-ui`.

### Foundational
- `Button` — variants: `primary` (black/white), `secondary` (surface-default), `ghost`, `destructive`
- `Input` — altura 40px desktop / 44px mobile
- `Label` — `text-sm font-medium text-secondary`
- `Card` — `surface-void` + `shadow-xs` + `radius-card`
- `Badge` — usa accent soft bg

### Financeiros (ApseOS-specific, em `shared/ui/finance/`)
- `Money` — renderiza R$ com tabular-nums, sinal via cor semântica
- `Margin` — % com ícone up/down, verde/vermelho semântico
- `KPIBlock` — label + valor grande + delta
- `DataTable` — denso, row height 40px, sort/filter sticky
- `StatusPill` — paid/pending/overdue com accent soft
- `Sparkline` — monocromático, accent só no último ponto

## Layout

- **App shell:** sidebar 240px (colapsa 64px) + topbar 56px + content
- **Max content width:** 1440px (dashboards podem ir até full)
- **Grid base:** 8px (todos paddings/gaps múltiplos de 8)
- **Container padding:** 24px mobile / 32px desktop

## Dark mode
- Default: segue preferência do sistema (`prefers-color-scheme`)
- Toggle explícito em user settings (persiste em `localStorage`)
- **Paridade total** — todo componente testado nos dois modos antes de merge

## Acessibilidade mínima
- Contraste WCAG AA (texto 4.5:1, UI 3:1)
- Foco visível em todo interativo (`ring-2 ring-primary`)
- Navegação teclado completa (dialogs com focus trap)
- `aria-label` em ícones-only

## Anti-padrões (lint/review bloqueia)

| ❌ Não fazer | ✅ Fazer |
|---|---|
| `className="bg-blue-500"` | `className="bg-[var(--accent-info)]"` ou token Tailwind mapeado |
| `style={{ color: '#059669' }}` | Token `text-accent-success` |
| Font custom via `<link>` | `next/font` com Inter/JetBrains |
| Animação 800ms+ | Máx `--duration-slow` (500ms) |
| Glass em card de dado | `shadow-xs` + surface sólida |
| Border decorativa colorida | `border-default` monocromático |
| Emoji em UI de produção | Ícone lucide-react |
| Cor sem semântica ("porque fica legal") | Monocromático |

## Setup no projeto

1. Copiar `sinapse-plataform/src/app/globals.css` pra `packages/shared/ui/styles/tokens.css`
2. Importar em `apps/web/src/app/layout.tsx`
3. Mapear no `@theme` do Tailwind v4 (ver `apps/web/tailwind.config.ts`)
4. Instalar shadcn: `pnpm dlx shadcn@latest init` + `add button input card table badge`
5. Criar `packages/shared/ui/finance/` com `Money`, `Margin`, `KPIBlock`, `DataTable`, `StatusPill`
6. Storybook opcional pós-MVP

## Referências
- Tokens: `sinapse-plataform/src/app/globals.css`
- shadcn/ui: https://ui.shadcn.com
- Tailwind v4 `@theme`: https://tailwindcss.com/docs/v4
