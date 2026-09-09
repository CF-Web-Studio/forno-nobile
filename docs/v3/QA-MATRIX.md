# V3 — QA Matrix (Gate P1)

Tudo abaixo é verificável por máquina. Nada aqui declara DESIGN PASS.

## Automático (antes de cada Gate)

| Check | Ferramenta | Critério |
|---|---|---|
| Typecheck | `tsc --noEmit` | 0 erro |
| Build | `vite build` | 0 erro |
| Console | Playwright | 0 `error` |
| Network | Playwright | 0 resposta ≥400 |
| Overflow horizontal | Playwright | `scrollWidth - clientWidth ≤ 1` |
| **Sharpness gate (§53)** | Playwright | `renderedWidth × DPR ≤ naturalWidth × 1.15` |
| Scroll states (§57) | Playwright | screenshot em 0/25/50/75/100% |
| Reduced motion | Playwright `reducedMotion:'reduce'` | conteúdo completo, 0 erro |
| Motion×GSAP (§13) | grep | nenhum seletor nas duas listas |
| Mobile pin (§16) | Playwright | scroll adicionado por motion = 0 px em ≤767 px |

## Viewports

390×844 · 430×932 · 768×1024 · 1440×900 · 1920×1080

## Execução

`node scripts/qa-p1.mjs --url=<preview>` — sai com 1 se houver qualquer FAIL.
Escreve `qa-report/v3/p1/` (gitignored): screenshots + `QA-REPORT.txt`.

Dois conjuntos de screenshot por viewport:
- `hero-000vh…125vh` — a transição do hero, o que o Gate P1 julga;
- `page-000…100` — estados de scroll da página inteira (§57), contexto.

## Duas armadilhas de medição já encontradas (não reintroduzir)

1. **`naturalWidth` mente para imagens `loading="lazy"`.** O Chromium decodifica
   em escala reduzida e `naturalWidth` passa a refletir o tamanho DECODIFICADO,
   ~= o renderizado — a imagem é comparada contra ela mesma e reprova sempre.
   O script deriva a largura real do nome do derivado (`-1280.webp`).
2. **Medir só no scroll 0 esconde metade da página.** Com lazy-loading, o que
   está abaixo da dobra nunca carrega. A varredura de nitidez roda DEPOIS do
   passe de scroll.

Também: o teto de nitidez vale para o **pixel renderizado**, que inclui
`transform: scale` e sangrias. O hero desconta o scale de 1.04 do SETTLE e a
sangria do ponteiro; a montagem desconta o push-in de 1.06 do match-cut.

## Escopo dos gates

O Gate P1 é **hero + primeira transição**. `sharpness` e `mobile-pin` são
avaliados só dentro de `.hero-stage`. Achados fora do hero saem como `INFO`:
não reprovam P1, mas ficam no relatório. Abertos hoje (escopo P3):

- `fogo-poster.jpg` 1440×DPR2 > 1280 — seção Fogo, full-bleed acima do teto.
- `macro-2-1280.webp` 359×DPR3 > 358 — seção Produto, srcset escolhendo baixo.
- `.exploded__stage` faz pin em ≤767 px — escopo P2 (Exploded).

## Humano (só o proprietário)

DESIGN PASS · VISUAL PASS · PRODUCT PASS
