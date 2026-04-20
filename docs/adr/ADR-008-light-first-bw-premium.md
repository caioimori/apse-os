---
id: ADR-008
title: Light mode first, B&W puro, Inter Variable como tipografia
status: accepted
date: 2026-04-19
deciders: Caio Imori
supersedes_parts_of: ADR-006
---

# ADR-008 — Light-first + B&W puro

## Contexto
Após análise de 3 referências (AbacatePay, Linear, Vercel) documentada em `docs/design/references/`, Caio decidiu a direção visual do ApseOS v2:

- **Light mode first** — sem dark mode no MVP
- **B&W puro** — zero accent cromático de marca (preto/branco/grays apenas, + semânticos mínimos pra sinal financeiro)
- **Premium feel** — transmitido por tipografia + espaço + motion + disciplina, não por cor
- **Tipografia: Inter Variable** (decisão delegada à análise técnica — ver justificativa)

## Decisão

### Paleta — light mode definitivo

```css
/* Surfaces */
--surface-void:      #FFFFFF;   /* cards, inputs */
--surface-base:      #FAFAFA;   /* body bg */
--surface-muted:     #F4F4F5;   /* subtle panels, table headers */
--surface-subtle:    #EFEFF1;   /* dividers, chip bg */
--surface-hover:     #E7E7EA;   /* hover states */
--surface-inverse:   #0A0A0B;   /* buttons primary, tooltip */

/* Text */
--text-primary:      #0A0A0B;   /* quase preto; nunca #000 */
--text-secondary:    #3F3F46;   /* body strong */
--text-tertiary:     #71717A;   /* labels, meta */
--text-quaternary:   #A1A1AA;   /* captions, disabled */
--text-inverse:      #FAFAFA;   /* em bg dark */

/* Borders */
--border-subtle:     rgba(10, 10, 11, 0.06);
--border-default:    rgba(10, 10, 11, 0.10);
--border-strong:     rgba(10, 10, 11, 0.16);
--border-focus:      #0A0A0B;

/* Semânticos — USO RESTRITO a sinal financeiro e feedback */
--semantic-profit:   #15803D;   /* green-700 — Money positivo */
--semantic-profit-soft: rgba(21, 128, 61, 0.08);
--semantic-loss:     #BE123C;   /* rose-700 — Money negativo */
--semantic-loss-soft: rgba(190, 18, 60, 0.08);
--semantic-warn:     #A16207;   /* yellow-700 — vencendo */
--semantic-warn-soft: rgba(161, 98, 7, 0.08);
```

### Tipografia

**Justificativa de Inter Variable (vs Fustat, Sohne, Geist):**
- **Inter Variable** é gratuita, open source, variable font axis permite peso **450** (medium-light) que Linear usa — única alternativa gratuita que entrega esse nuance
- Fustat (AbacatePay) é amigável demais, mira consumer; ApseOS é ferramenta profissional
- Sohne (Stripe) é paga, licença custa
- Geist (Vercel) é "engineer vibe", menos premium financial

```css
--font-sans: 'Inter', 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

/* Escala compacta tipo Linear */
--text-xs:   0.75rem;   /* 12px — captions, meta */
--text-sm:   0.8125rem; /* 13px — body dense */
--text-base: 0.875rem;  /* 14px — body padrão */
--text-md:   1rem;      /* 16px — emphasized */
--text-lg:   1.125rem;  /* 18px — small headings */
--text-xl:   1.5rem;    /* 24px — section headings */
--text-2xl:  2rem;      /* 32px — page title */
--text-hero: 2.5rem;    /* 40px — KPI value hero */
--text-display: 3rem;   /* 48px — landing / empty state 404 */

/* Weights — 450 é a assinatura */
--weight-regular: 400;  /* body */
--weight-medium:  450;  /* nav items, labels strong */
--weight-semibold: 500; /* buttons, h3 */
--weight-bold:    600;  /* h1-h2, KPI hero */
--weight-display: 700;  /* 404 display, empty state number */

/* Tracking */
--tracking-tight:    -0.02em;
--tracking-tighter:  -0.03em;
--tracking-display:  -0.04em;
--tracking-normal:   0;
--tracking-caps:     0.08em;  /* uppercase labels */
```

### Radii

```css
--radius-xs:    4px;   /* tags, micro elementos */
--radius-sm:    6px;   /* buttons pequenos, chips */
--radius-md:    8px;   /* buttons, inputs */
--radius-lg:    10px;  /* cards */
--radius-xl:    12px;  /* modais, large cards */
--radius-pill:  9999px; /* pills, avatars */
```

Intermediário entre Vercel (tight 6px) e AbacatePay (generoso 24px). Premium mas profissional.

### Motion — assinatura ApseOS

```css
/* Easings */
--ease-swift:   cubic-bezier(0.3, 0.57, 0.07, 0.95); /* assinatura — Vercel-way */
--ease-smooth:  cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);   /* delight moments */

/* Durations */
--duration-instant: 80ms;
--duration-fast:    150ms;  /* hover colors */
--duration-base:    200ms;  /* opacity, height, transform leves */
--duration-slow:    400ms;  /* modal enter, route transitions */
```

### Shadows

Estritos — premium não grita:
```css
--shadow-xs:  0 1px 2px rgba(10, 10, 11, 0.04);
--shadow-sm:  0 2px 4px rgba(10, 10, 11, 0.06), 0 1px 2px rgba(10, 10, 11, 0.04);
--shadow-md:  0 4px 12px rgba(10, 10, 11, 0.08), 0 1px 2px rgba(10, 10, 11, 0.04);
--shadow-lg:  0 12px 32px rgba(10, 10, 11, 0.10), 0 2px 4px rgba(10, 10, 11, 0.05);
--shadow-focus: 0 0 0 3px rgba(10, 10, 11, 0.12);
```

## Princípios de aplicação

1. **Primary button:** bg `#0A0A0B`, text `#FAFAFA`, hover reduz opacity pra `0.88`, active translateY(1px). Nunca opacity-50.
2. **Secondary button:** bg `#FFFFFF`, border 1px `--border-default`, text `#0A0A0B`, hover bg `#F4F4F5`.
3. **Input:** border 1px `--border-default`, focus border `--border-focus` + shadow `--shadow-focus`, radius `--radius-md`.
4. **Card:** bg `#FFFFFF`, border 1px `--border-subtle`, shadow `--shadow-xs`, radius `--radius-lg`. Hover: border `--border-default` + shadow `--shadow-sm` + translateY(-1px), 200ms ease-swift.
5. **Money positivo:** `font-mono tabular-nums`, cor `--semantic-profit`. Negativo: `--semantic-loss`. Neutro: `--text-primary`.
6. **H1 page:** `text-2xl` (32px), weight 600, tracking `--tracking-tight`. Nunca uppercase.
7. **Section label:** `text-xs` uppercase, tracking `--tracking-caps`, cor `--text-tertiary`, weight 500.
8. **KPI value hero:** `font-mono` (ou Inter tabular se preferir), `text-hero` (40px), weight 600, tracking `--tracking-tighter`.

## Anti-patterns bloqueados

- ❌ `hover:opacity-50` — usar bg change sempre
- ❌ `color: #000` — sempre `#0A0A0B`
- ❌ `color: #fff` em light mode — sempre `#FAFAFA`
- ❌ Gradiente decorativo — zero
- ❌ Ícone colorido — ícones em `--text-tertiary` sempre, exceto semantic (profit/loss/warn)
- ❌ Radius > 12px em cards — quebra tight feel
- ❌ Font-size custom — usar apenas escala declarada
- ❌ Cor de marca em background de seção — premium B&W NÃO TEM cor de marca

## Consequências

### Positivas
- Disciplina reduz decisões → velocidade de build
- Diferencia do mar de dashboards SaaS coloridos do BR
- Premium de verdade — foco em tipografia e densidade
- Acessibilidade: contraste alto por padrão
- Escalável — se decidir add dark mode depois, tokens invertem sem esforço

### Negativas
- Zero espaço pra "personalidade cromática" — risco de parecer austero se motion/tipografia falhar
- Exige EXECUÇÃO perfeita em tipografia/spacing/motion
- Não é "alegre" como AbacatePay — pode parecer sério demais pra alguns

## Supersedes (parcialmente) ADR-006

ADR-006 (caioimori-DS minimalista) segue válido como FILOSOFIA. Este ADR-008 **especifica** os tokens concretos pra v2 e elimina a paridade dark-mode no MVP.

## Referências
- `docs/design/DESIGN_BRIEF.md` — 10 princípios
- `docs/design/references/abacatepay-analysis.md`
- `docs/design/references/motion-references-linear-vercel.md`
- `docs/adr/ADR-007-reset-v2-design-first.md` — decisão do reset

## Próximo passo
Criar story Fase A (AppShell) em `docs/stories/A.1.app-shell.md` consumindo estes tokens.
