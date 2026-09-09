# V3 — Asset Audit (Premium)

Medido em 2026-09-09 com `ffprobe` sobre os arquivos **realmente servidos** (`public/media/premium`).

## 🔴 BLOQUEIO 1 — ASSET_ROOT desapareceu

`C:\Users\teste\Downloads\FORNO-NOBILE-ASSETS` **não existe mais** no filesystem.
Verificado: `Downloads/` está acessível, a pasta não está lá.

Consequências:
- Não é possível regerar derivados a partir do ORIGINAL (§22).
- **Proibido** criar derivado-de-derivado para "melhorar" nitidez (§22) — isso só degradaria.
- O trabalho V3 usa exclusivamente os derivados já commitados no repo.

Ver `docs/PENDING-ASSETS.md`.

## Resolução real do que é servido

| Asset | Resolução nativa útil | Observação |
|---|---|---|
| `videos/hero.mp4` | **1280×720** @24fps, 1.78 Mbps | teto real de nitidez |
| `videos/fogo.mp4` | 1280×720 @24fps | |
| `videos/macro.mp4` | 1280×720 @24fps | |
| `images/hero-*.jpg` | 768 / 1280 / **1920** | o `-1920` é **upscale**: a fonte era ~16:9 720p-class |
| `images/exploded-poster-*` | 768 / 1280 / 1920 | idem |
| `images/macro-1,2`, `forno-fogo` | 768 / 1280 / 1920 | idem |
| `layers/*.webp` | **1254×1254** (7 camadas RGBA) | canvas idêntico |

**Teto de nitidez confiável do Premium = 1280 px de largura de fonte.**

## 🔴 BLOQUEIO 2 — camadas do exploded reprovadas na validação geométrica (§27)

As 7 camadas compartilham canvas (1254²), mas **não compartilham câmera**:

| Camadas | Projeção observada |
|---|---|
| `01-massa`, `02-molho`, `03-queijo` | three-quarter, câmera ~30° acima do plano |
| `04-pepperoni`, `05-tomate`, `06-manjericao`, `07-temperos` | **top-down achatado** |

Duas projeções diferentes **não podem** ser empilhadas e lidas como um objeto físico:
o grupo top-down flutua como uma cúpula sobre o disco em perspectiva.
É exatamente o que o proprietário viu ("camadas umas sobre as outras", "não parece montagem física", "perspectiva inconsistente").

**Veredito §27/§28: opção C (2.5D empilhando estes PNGs) está DESQUALIFICADA.**
Não tentar consertar com `spread`/`settle`/`scale`. A escolha do P2 fica entre **A (true 3D)** e **B (scrub cinematográfico pré-renderizado)** — decidida no Gate P2, não agora.

## Causa-raiz da queixa "imagens pouco nítidas"

V2 usou vídeo **1280×720 em full-bleed**:

| Viewport | Largura renderizada | Upscale sobre 1280 |
|---|---|---|
| 1440 × 900 (DPR 1) | 1440 px | **1.13×** |
| 1920 × 1080 (DPR 1) | 1920 px | **1.50×** ← visivelmente mole |
| 390 × 844 (DPR 2) | 780 px | 0.61× (ok) |

Ou seja: **o problema aparece exatamente no desktop**, que é onde o proprietário avaliou.

### Correção estruturante (§23, não CSS-patch)

§23 já prescreve: *"quando vídeo não suportar fullscreen com qualidade: usar smaller media frame; mask; controlled crop"*.

V3 abandona o full-bleed e usa **abertura contida**, com crop diferente por breakpoint:

| Breakpoint | Abertura | Slice usado da fonte | Escala efetiva |
|---|---|---|---|
| ≥1280 desktop | retrato 4:5, ~560–680 px de largura | ~576×720 (usa a **altura** cheia) | **≈1.0× — nativo** |
| 768 tablet | 3:4, ~440 px | ~540×720 | <1.0× |
| ≤430 mobile (DPR 2–3) | paisagem, largura total | 1280×720 → 780–1290 device px | ≈1.0× |

O crop retrato é o truque central: uma fonte **paisagem 720p vira nítida** quando exibida numa janela retrato, porque só se usa uma fatia estreita e a altura de 720 px é aproveitada inteira.

Isso resolve nitidez **e** remove o clichê de hero com vídeo edge-to-edge (§21).
