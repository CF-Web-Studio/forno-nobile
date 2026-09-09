# V3 — Motion Spec / Tokens (§71)

Uma linguagem de movimento só, compartilhada por GSAP e Motion.

## Tokens (`src/shared/motion/tokens.ts`)

| Token | Valor | Uso |
|---|---|---|
| `dur.micro` | 0.28s | hover, tap |
| `dur.base` | 0.6s | reveals curtos |
| `dur.slow` | 0.9s | entrada orquestrada |
| `ease.out` | `power3.out` / `[0.16,1,0.3,1]` | tudo que entra |
| `ease.inOut` | `power2.inOut` | transformações scrubadas |
| `ease.none` | `none` | scrub puro |
| `stagger.line` | 0.09s | linhas de headline |
| `stagger.item` | 0.06s | listas curtas |
| `dist.rise` | 12px | entrada de corpo de texto |
| `spring.cta` | `{ type:'spring', stiffness:400, damping:28 }` | Motion — CTA |

GSAP usa as strings (`power3.out`); Motion usa os arrays de bézier equivalentes. Mesma curva, dois consumidores.

## Regra de decisão (§72)

Antes de qualquer efeito, as 5 perguntas. Registro do hero V3:

| Efeito | Comunica? | Percebe qualidade? | Ajuda narrativa? | Funciona no celular? | Mais simples existe? | Veredito |
|---|---|---|---|---|---|---|
| Abertura retrato → faixa | sim: a câmera se aproxima | sim | sim, é o handoff | sim (variante própria) | não | **entra** |
| Mask clip-out do headline | sim: capítulo terminou | sim | sim | sim | fade seria mais simples e pior | **entra** |
| Parallax de ponteiro no conteúdo | sim: profundidade real | sim | fraco | não (desativado) | — | **entra só em desktop** |
| Light sweep no cursor | fraco | pouco | não | não | sim | **entra em opacidade baixa, desktop** |
| Fade-up em cada bloco | não | não | não | — | sim | **cortado** |
