# V3 — Registro de Aprovação Humana

**BUILD PASS ≠ DESIGN PASS.** Claude só pode declarar condições verificáveis.
Somente o proprietário declara DESIGN / VISUAL / PRODUCT PASS.

| Gate | Escopo | Status técnico | Status de design | Data |
|---|---|---|---|---|
| **P1** | Premium Hero + primeira transição | **PASS** (61/61, 0 FAIL) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| P2 | Montagem V3 (ex-"Exploded") | **PASS** (71/71, 0 FAIL) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| P3 | Premium completo | — | não iniciado | — |
| PRO | Profissional V3 | — | não iniciado | — |
| ESS | Essencial V3 (refino) | — | não iniciado | — |
| CF | CF Web Studio V3 | — | não iniciado | — |
| DEPLOY | merge em main + Pages | — | **requer "APROVADO PARA DEPLOY" explícito** | — |

## Histórico

- **2026-09-09 — V2 REPROVADO VISUALMENTE pelo proprietário.** Estava em produção; permanece no ar até o V3 ser aprovado (não houve pedido de rollback).
- **2026-09-09 — Gate P1: status TÉCNICO PASS.** `tsc` 0 erro, build 0 erro,
  118.7 KB gzip / 135 KB, 61 checks Playwright PASS / 0 FAIL em 5 breakpoints
  + touch/pointer + reduced-motion. Screenshots em `qa-report/v3/p1/`.
  **Isto não é DESIGN PASS.** Só o proprietário declara.

- **2026-09-09 — Gate P2 (Montagem): status TÉCNICO PASS.** O exploded empilhado
  foi substituído por sequência de ingredientes + match-cut (ver
  `docs/PENDING-ASSETS.md`). 118.7→119.2 KB gzip, 71 checks PASS / 0 FAIL.
  Correção de método: a suíte tinha 2 pontos cegos (naturalWidth de imagens
  lazy; medição só no scroll 0) que produziam falsos positivos E escondiam
  achados reais. Ambos corrigidos — ver `QA-MATRIX.md`.

## Pontos que precisam de decisão do proprietário no Gate P1

1. **Fase READ/HANDOFF do storyboard não implementada.** `SCROLL-STORYBOARD.md`
   0.60–0.78 prevê o numeral `02` e a primeira linha de Matéria entrando
   *através da máscara da própria abertura*. Hoje há só um hold vazio — por isso
   a metade esquerda fica preta no fim da faixa. É a maior lacuna do P1.
2. **Largura da faixa limitada pelo asset.** O storyboard pede largura → 100%.
   Em DPR 2 isso violaria o gate de nitidez (§53): `hero.mp4` tem 1280 reais.
   A faixa para em 736 px (DPR 2) / 1280 px (DPR 1). É a "abertura contida" do
   `ASSET-AUDIT.md`. Com um hero 4K real, o teto sobe sozinho.
3. **`FORNO-NOBILE-ASSETS` voltou ao disco** (verificado 2026-09-09) — resolve o
   ASSET_BLOCKED 1. Regerar derivados é escopo fora do P1.
