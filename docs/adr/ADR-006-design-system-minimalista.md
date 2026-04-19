---
id: ADR-006
title: Design System minimalista — caioimori-DS (herdado de sinapse-plataform)
status: accepted
date: 2026-04-18
deciders: Caio Imori
---

# ADR-006 — Design System minimalista

## Contexto
ApseOS é ferramenta financeira. Cliente olha dashboard às 23h pra decidir se demite freelancer. Ruído visual = decisão errada. Bonito ≠ bom: **clareza é o design**.

O ecossistema SINAPSE já tem design system maduro (`caioimori-DS`) validado no `sinapse-plataform`. Reusar tokens = consistência de marca + zero bikeshedding.

## Decisão
Adotar **caioimori-DS** como design system único do ApseOS desde o primeiro componente.

### Princípios (em ordem de prioridade)
1. **Monocromático primeiro** — preto/branco/grays resolvem 95% da UI
2. **Cor = semântica, nunca decoração** — verde = receita, vermelho = prejuízo, amarelo = alerta
3. **Densidade de informação alta sem poluição** — fintech exige tabelas densas legíveis
4. **Tipografia hierárquica clara** — Inter (sans) + JetBrains Mono (número/moeda)
5. **Motion discreto** — 200ms fast / 320ms normal; spring só em feedback tátil
6. **Glass/blur com moderação** — só em nav sticky e overlays, nunca em cards de dado
7. **Dark mode paridade desde dia 1** — não é afterthought

### Tokens (resumo — spec completo em `docs/design/design-system.md`)

**Surfaces (light):** `#FFFFFF` → `#FAFAFA` → `#F5F5F7` → `#EFEFEF` → `#E8E8E8` → `#E0E0E0` → `#111111`
**Surfaces (dark):** `#000000` → `#0A0A0A` → `#111111` → `#1A1A1A` → `#222222` → `#2A2A2A` → `#F5F5F7`

**Texto (light):** `#000` / rgba(0,0,0, 0.65 / 0.45 / 0.30 / 0.15)
**Texto (dark):** `#FFF` / rgba(255,255,255, 0.65 / 0.45 / 0.30 / 0.15)

**Accents semânticos:**
- Receita / sucesso: `emerald-600` light / `emerald-400` dark
- Prejuízo / destrutivo: `rose-600` light / `rose-400` dark
- Info / neutro: `blue-600` light / `blue-400` dark
- Alerta: `amber-600` light / `amber-400` dark

**Radius:** card 16px · button 8px · input 8px · modal 20px · badge full
**Motion:** instant 80ms · fast 200ms · normal 320ms · slow 500ms

### Stack
- Tailwind v4 com `@theme` mapeando os tokens CSS
- shadcn/ui (base) + componentes proprietários em `packages/shared/ui/`
- Tokens em `packages/shared/ui/styles/tokens.css` — fonte única

### Regras anti-padrão (lint bloqueia)
- Proibido: hex hardcoded fora de `tokens.css`
- Proibido: classes Tailwind de cor (`bg-blue-500`) — use `bg-accent-info`
- Proibido: font sans custom fora do Inter
- Proibido: animação > 500ms (exceto feedback de ação longa)

## Alternativas consideradas
- **Material UI:** opinativo demais, pesado, "não-nosso"
- **Design system do zero:** 3 semanas de bikeshedding antes da primeira feature
- **Chakra/Radix puro:** bom, mas perde consistência com ecossistema SINAPSE

## Consequências
### Positivas
- Consistência visual com sinapse-plataform e marca @caioimori
- Zero decisão de cor por componente — sempre token
- Dark mode "grátis"
- Onboarding de dev/design instantâneo se já conhece caioimori-DS

### Negativas
- Fork futuro exige versionamento (se ApseOS divergir de sinapse-plataform)
- Mitigado: tokens publicados como package `@apse/shared-ui` com version pinning

## Referências
- Tokens originais: `sinapse-plataform/src/app/globals.css`
- Spec completo: `docs/design/design-system.md`
