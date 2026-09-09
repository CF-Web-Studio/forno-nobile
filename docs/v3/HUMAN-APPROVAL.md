# V3 — Registro de Aprovação Humana

**BUILD PASS ≠ DESIGN PASS.** Claude só pode declarar condições verificáveis.
Somente o proprietário declara DESIGN / VISUAL / PRODUCT PASS.

| Gate | Escopo | Status técnico | Status de design | Data |
|---|---|---|---|---|
| **P1** | Premium Hero + primeira transição | **PASS** (61/61, 0 FAIL) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| P2 | Montagem V3 (ex-"Exploded") | **PASS** (71/71, 0 FAIL) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| P3 | Premium completo | **PASS** (71/71, 0 FAIL, 0 INFO) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| PRO | Profissional V3 | **PASS** (contraste e nitidez) | AWAITING HUMAN APPROVAL | 2026-09-09 |
| ESS | Essencial V3 (refino) | **PASS** (71/71, 0 FAIL) | AWAITING HUMAN APPROVAL | 2026-09-09 |
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

- **2026-09-09 — Fase 4 (Premium completo): status TÉCNICO PASS.**
  A partir daqui o QA cobre a **página inteira** — não existe mais
  "fora de escopo", e nenhum achado é rebaixado para INFO. 71/71 PASS.
  Fechado nesta fase: handoff READ do storyboard (0.60–0.78) implementado;
  Fogo contido + tipografia atravessando a banda; `-1920` removido do srcset;
  CTA do drawer mobile corrigido (4.23:1 → 5.09:1); Hero antigo e ~72 linhas
  de CSS órfão removidos.

- **2026-09-09 — Fase 5 (Profissional).** O `§19` apontava "salto insuficiente";
  a causa era arquitetural, não de acabamento: os dois heroes eram foto
  full-bleed + tipo à esquerda. Virou **capa editorial em split**. Corrigidas
  6 reprovações reais de contraste, entre elas um bug de cascata em que
  `.btn:hover` sequestrava o `--_bg` do botão outline.
- **2026-09-09 — Correção de método, decidida pelo proprietário.** O check
  `contraste-sobre-midia` que eu havia criado não era confiável e foi
  **removido**, não rebaixado: ver "O que este QA NÃO cobre" em `QA-MATRIX.md`.
  A suavidade do hero do Essencial virou **exceção declarada por arquivo**,
  com motivo escrito, visível no relatório como `EXCE`.

- **2026-09-09 — Fase 6 (Essencial): 71/71 PASS.** Refino, não redesenho — o
  §24 manda preservar o que funciona. Três reprovações reais de contraste:
  `--color-terra` usado como TEXTO sobre claro (4.37:1 no papel, 3.88:1 no
  fundo alternativo) onde já existia `--color-terra-600`; e o CTA do drawer com
  a mesma colisão de especificidade dos outros dois tiers (3.58:1).
- **2026-09-09 — Os três tiers em 71 PASS / 0 FAIL.** O mesmo bug de CTA de
  drawer existia nos três, e só apareceu quando o QA passou a cobrir a página
  inteira em vez de uma seção.

## Pontos que precisam de decisão do proprietário no Gate P1

1. ~~**Fase READ/HANDOFF do storyboard não implementada.**~~ **RESOLVIDO na
   Fase 4:** `.hero-handoff` revela `02 / Farinha, água, sal e fogo.` pela
   máscara da própria abertura em 0.60–0.78, como o storyboard previa.
2. **Largura da faixa limitada pelo asset.** O storyboard pede largura → 100%.
   Em DPR 2 isso violaria o gate de nitidez (§53): `hero.mp4` tem 1280 reais.
   A faixa para em 736 px (DPR 2) / 1280 px (DPR 1). É a "abertura contida" do
   `ASSET-AUDIT.md`. Com um hero 4K real, o teto sobe sozinho.
3. **`FORNO-NOBILE-ASSETS` voltou ao disco** (verificado 2026-09-09) — resolve o
   ASSET_BLOCKED 1. Regerar derivados é escopo fora do P1.
