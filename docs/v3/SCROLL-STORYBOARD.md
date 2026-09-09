# V3 — Scroll Storyboard: Hero → Matéria (a "primeira transição")

Uma cena scrubada. `scrub: 1`. Desktop usa `pin` curto; mobile **não usa pin** (ver `RESPONSIVE-MOTION.md`).

## Entrada única na carga da página (não scrubada, roda uma vez)

| t | Elemento | De → Para |
|---|---|---|
| 0.00s | `.hero-aperture` | `clip-path: inset(50% 0)` → `inset(0%)`, 0.9s `power3.out` |
| 0.15s | `.hero-line` ×3 | `yPercent 105` → `0`, stagger 90ms, 0.8s `power3.out` |
| 0.55s | numeral `01` | `opacity 0 → 1`, 0.6s |
| 0.70s | corpo + CTAs | `opacity 0 → 1`, y `12 → 0`, stagger 60ms |

Este é **o único momento orquestrado** do capítulo. Nada mais entra com fade-up.

## Timeline scrubada (desktop) — `end: "+=110%"`

| Progresso | Fase | O que acontece |
|---|---|---|
| **0.00–0.10** | ENTRY | Estado estável. Só o `.motion-cue` pulsa. Nada se move ainda — o leitor lê o headline. |
| **0.10–0.28** | SETTLE | `.hero-media-scroll` sobe `y: 0 → -28`, `scale 1 → 1.04`. A abertura ainda é retrato. Movimento quase imperceptível: sinaliza que a cena é viva. |
| **0.28–0.60** | TRANSFORM | **O núcleo.** `.hero-aperture` abre de `4/5` para `16/7` e a largura vai de `min(38vw,620px)` → `100%`, ancorada pela direita. Simultaneamente as 3 `.hero-line` saem por cima com `yPercent 0 → -105` (clip pela máscara, **não** fade). `.hero-heat` (gradiente quente vindo de baixo) `opacity 0 → 1`. |
| **0.60–0.78** | READ | A abertura, agora faixa larga, fica **parada**. O numeral `02` e a primeira linha de Matéria entram *através da própria máscara da abertura* (`clip-path` compartilhado) — os dois capítulos dividem o mesmo elemento. É aqui que a continuidade acontece. |
| **0.78–0.92** | HOLD | Estado estável do handoff. A faixa segura. O texto de Matéria termina de compor. |
| **0.92–1.00** | HANDOFF | `.hero-stage` despina; a faixa passa a ser o topo natural do capítulo Matéria no fluxo do documento. Sem salto. |

### Por que isso não é "translateY"

O elemento que carrega a narrativa **muda de forma** (retrato → faixa) e **muda de dono** (hero → Matéria). O texto sai por corte de máscara, não por opacidade. O fundo esquenta. São quatro propriedades independentes contando uma coisa só: *a câmera se aproxima do forno.*

## Ponteiro (desktop, `pointer: fine`)

- `.hero-media-pointer`: `x/y` ±10 px, **contra** o cursor, `quickTo` 0.6s `power3`.
- `.hero-sweep`: faixa de luz quente segue o cursor no eixo X, ±40 px, opacidade 0.18.
- O quadro (`.hero-aperture`) **não se move**. Só o conteúdo dentro dele. Nada fica preso ao mouse.

## Reduced motion

Sem entrada orquestrada, sem scrub, sem pin, sem ponteiro. A composição aparece no estado final do ENTRY (abertura aberta, linhas em `yPercent 0`), a abertura mostra o **poster**, e Matéria é uma seção normal abaixo. Todo o conteúdo presente.
