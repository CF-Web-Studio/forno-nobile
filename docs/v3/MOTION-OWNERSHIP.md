# V3 — Motion Ownership (§13)

Regra: **cada propriedade CSS tem exatamente um dono.** Dois donos nunca escrevem a mesma propriedade no mesmo nó.

Aplicado por estrutura de wrapper, não por convenção verbal.

## Mudança no Gate P1 — a biblioteca `motion` saiu

O terceiro dono previsto era a lib `motion` (Framer Motion). Ela foi **removida**:
o bundle da página Premium ficava em 160.6 KB gzip contra um teto de 135 KB.

| Estratégia | Medido (gzip) | Veredito |
|---|---|---|
| `motion` completo (estado herdado) | 160.6 KB | reprova por 25.6 KB |
| `LazyMotion` + `domAnimation` | 148.9 KB | reprova por 13.9 KB |
| **CSS puro, sem `motion`** | **118.7 KB** | **passa, 16.3 KB de folga** |

O uso real da lib era: `whileHover`/`whileTap` (scale) em 2 CTAs e um pulso
infinito no indicador de scroll. Uma `transition: transform` e um `@keyframes`
cobrem os dois. Um spring de mola em `scale: 1.03` num botão não justifica
~46 KB — e a folga é o que permite o Three.js entrar no Gate P2.

**O dono dos nós `.motion-*` agora é o CSS.** A regra de um-dono-por-propriedade
continua intacta: GSAP escreve `.hero-*`, o CSS escreve `.motion-*`.
Bônus: some o scheduler paralelo do Motion — sobra um único RAF na página
(`gsap.ticker` conduzindo o Lenis), como o PERFORMANCE-BUDGET já exigia.

## Árvore do hero Premium

```
section.hero-stage                 ← GSAP: nada (só trigger/pin)
└─ div.hero-grid
   ├─ div.hero-copy
   │  └─ span.hero-line            ← GSAP: yPercent  (mask reveal + clip-out)
   │     (dentro de .hero-line-mask ← CSS: overflow hidden, estático)
   │  └─ a.motion-cta             ← CSS: transform (hover/active)
   │  └─ div.motion-cue           ← CSS: transform, opacity (@keyframes cue-pulse)
   └─ figure.hero-aperture         ← GSAP: clipPath, aspectRatio, width
      └─ div.hero-media-scroll     ← GSAP: y, scale        (scrub de scroll)
         └─ div.hero-media-pointer ← GSAP quickTo: x, y    (parallax de ponteiro)
            └─ video / img         ← nenhum transform JS
      └─ div.hero-sweep            ← GSAP quickTo: x       (light sweep)
```

## Tabela de donos

| Nó | Propriedade | Dono | Motivo |
|---|---|---|---|
| `.hero-line` | `yPercent` | GSAP | faz parte da timeline de scroll |
| `.hero-aperture` | `clip-path` | GSAP | entrada orquestrada |
| `.hero-aperture` | `--ap` (→ `aspect-ratio`) | GSAP via proxy | **nunca** `aspect-ratio` direto — ver armadilha abaixo |
| `.hero-aperture` | `--apw` (→ `width`) | GSAP via proxy | faixa cresce ancorada pela direita |
| `.hero-media-scroll` | `y`, `scale` | GSAP | scrub |
| `.hero-media-pointer` | `x`, `y` | GSAP `quickTo` | **nó separado** do scroll — não colide |
| `.hero-sweep` | `x`, `opacity` | GSAP `quickTo` | idem |
| `.motion-cta` | `transform` | **CSS** | resposta a hover/active do usuário |
| `.motion-cue` | `transform`, `opacity` | **CSS** | `@keyframes cue-pulse` |
| `.hero-heat` | `opacity` | GSAP | scrub |

CSS e GSAP tocam em `.motion-*` e `.hero-*` respectivamente. **Nenhum nó aparece nas duas listas.**

## Armadilha: GSAP e `aspect-ratio`

`gsap.set(el, { aspectRatio: 0.8 })` **não** produz `aspect-ratio: 0.8`.
O GSAP reaproveita o denominador do valor CSS de origem: partindo de
`aspect-ratio: 16/9`, o resultado é `aspect-ratio: 1.6 / 9` — a abertura
chegou a **2194 px de altura no mobile e 9216 px no tablet**.

Regra: a razão vive em `--ap` (número puro), o CSS faz `aspect-ratio: var(--ap)`
e o GSAP tweena um objeto-proxy com `onUpdate` escrevendo a custom property.
Mesma regra para `--apw`. `qa-p1.mjs` tem um check `aperture` que reprova se a
altura passar de 1.5× a viewport, para essa regressão não voltar calada.

## Verificação

`docs/v3/QA-MATRIX.md` inclui um passo que faz `grep` por `motion.` dentro de arquivos que também chamam `gsap.to(` no mesmo seletor. Se um seletor aparecer nos dois, é regressão.
