# V3 — Responsive Motion (§15, §16)

Implementado com `gsap.matchMedia()`. **Quatro setups independentes**, não um desktop multiplicado por 0.6.

| Setup | Query | Pin | Scrub | Ponteiro | Abertura |
|---|---|---|---|---|---|
| DESKTOP | `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` | sim, `+=110%` | sim | sim | retrato 4:5 → faixa 16:7 |
| TABLET | `(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)` | sim, `+=70%` | sim | **não** | 3:4 → 16:8 |
| MOBILE | `(max-width: 767px) and (prefers-reduced-motion: no-preference)` | **não** | não | **não** | paisagem 16:10 fixa |
| REDUCED | `(prefers-reduced-motion: reduce)` | não | não | não | estado final estático |

## Mobile — regra dura

**Zero pin. Zero scroll artificial. Zero `100vh`.**

O hero mobile é fluxo de documento normal:
- altura `min-height: 100svh` (nunca `vh`), conteúdo empilhado;
- a abertura entra com um `clip-path` curto disparado por `ScrollTrigger` **sem scrub e sem pin** (`toggleActions: play none none reverse`) — dura 0.7s e acaba;
- a transição para Matéria é um `mask wipe` de 0.5s no próprio elemento, também sem pin;
- **soma de scroll adicionado pelo motion: 0 px.**

Motivo: o V2 prendia a tela por ~1435 px no mobile (`pin` + `end:"+=170%"` sobre viewport de 844 px). É a causa direta de "mobile travado / scroll preso".

## Limpeza

Cada `matchMedia` devolve sua função de cleanup; `gsap.matchMedia().revert()` no unmount mata timelines, pins e listeners. `ScrollTrigger.refresh()` no `resize` com debounce de 150 ms.
