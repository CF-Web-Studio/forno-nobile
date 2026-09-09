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

## O que este QA NÃO cobre (dívida técnica conhecida)

**Contraste de texto sobre foto ou vídeo não é verificado.** O CSS não sabe a
cor do pixel por trás do texto. Duas tentativas falharam e foram removidas:

1. Subir a árvore de pais até uma cor opaca — quando há uma foto no meio,
   compara a cor do texto com ela mesma e devolve **1.00:1**, valor impossível.
2. `elementsFromPoint` + heurística de scrim — deu falso positivo em rodapé,
   labels de formulário e preços, que estão sobre cor sólida.

Medir isso de verdade exige amostrar os pixels de um screenshot (precisa de um
decodificador PNG). **Um gate em que não se confia contamina todos os outros
números**, então o check numérico ficou restrito ao que é exato: texto sobre
cor sólida. Onde há texto sobre mídia, a garantia é de projeto (scrim), não
verificada por máquina.

O script **não inventa um número quando não pode medir**. Ele classifica como
`contraste-nao-medido` (aparece como `EXCE`, nunca some do relatório) quando:

- a cor de fundo teve de vir do `body`/`html` **e** o texto cai sobre mídia
  full-bleed — era o caso do header fixo e transparente sobre o hero, que
  produzia "creme sobre creme" = **1.00:1**, valor impossível;
- a cor veio do `body`/`html` **e** o elemento não tem retângulo — a nav de
  desktop com `display:none` no mobile.

Um componente oculto **com fundo próprio** continua sendo medido: foi assim que
as três reprovações do CTA de drawer (uma por tier) apareceram.

## Exceções de nitidez — declaradas, nunca implícitas

`scripts/qa-tier.mjs` tem `SHARPNESS_EXCEPTIONS`, um mapa por tier. Cada
exceção lista **arquivos específicos** e exige motivo escrito; aparece no
relatório como `EXCE`, nunca some. Não é rebaixar FAIL — é registrar uma
decisão de produto onde ela foi tomada.

Aberta hoje: **Essencial**, `hero-forno-*` e `fachada-noite-*`. O teto de 1280
vem do `PERFORMANCE-BUDGET`, que é documento do **Premium**; o hero full-bleed
é a identidade do Essencial (§24: preservar o que funciona, não overengineer).

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
