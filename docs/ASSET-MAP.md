# ASSET MAP — Forno Nobile + CF Web Studio

Fonte (READ-ONLY, fora do repo): `C:\Users\teste\Downloads\FORNO-NOBILE-ASSETS`
Auditado em 2026-09-09. 44 arquivos, ~73,5 MB — 21 `.jpeg`, 7 `.png` (RGBA), 16 `.mp4`.

## Método e limites da auditoria

- As 28 imagens estáticas (`.jpeg` + `.png`) foram **abertas e inspecionadas visualmente** — classificação observada, não presumida.
- Os **16 vídeos `.mp4` foram inspecionados** (2026-09-09) via `ffprobe` (metadados) + `ffmpeg` (5 frames por vídeo: 2/25/50/75/95%) extraídos para `../.qa-temp/video-frames/` (fora dos repos). Frames abertos e classificados por conteúdo real.
- Os nomes de arquivo **não seguem** a convenção do Prompt Mestre (`FLOW-E01`, `M01`–`M12`, `CF01`–`CF03`). O mapeamento por seção foi inferido de conteúdo + pasta + correspondência com as imagens.
- Nenhum arquivo original foi movido, renomeado, convertido ou alterado. Derivados web só serão gerados para os vídeos efetivamente usados, na fase de cada site.

## Metadados dos vídeos (ffprobe)

| Grupo | Arquivos | Duração | Resolução | Codec | FPS |
|---|---|---|---|---|---|
| Produção (Essencial/Profissional/Premium/CF) | 12 clipes | 8 s | 1280×720 | H.264 | 24 |
| 04-REFERENCIAS | 4 clipes | 19–41 s | **576×1024 (vertical)** | H.264 | 24–30 |

## Classificação real dos 16 vídeos

| # | Arquivo | Pasta | Conteúdo observado nos frames | Classificação | Uso |
|---|---|---|---|---|---|
| 1 | `c6dbecb4-…-29cf8f645e5c.mp4` | 01-ESSENCIAL | Pizza pepperoni na tábua, forno c/ chama ao fundo; leve push-in + vapor | **PRODUCTION_VIDEO** | Essencial — loop ambiente do hero (E01) |
| 2 | `53dee848-…-cdcf84297aad.mp4` | 02-PROFISSIONAL | Salão escuro, fatia sendo erguida com cheese-pull, vapor | **PRODUCTION_VIDEO** | Profissional — hero campanha (P01) |
| 3 | `77c20465-…-34f9e6b89cfa.mp4` | 02-PROFISSIONAL | Prédio urbano ao anoitecer c/ painel gigante de pizza, carros passando | **PRODUCTION_VIDEO** | Profissional — campanha/outdoor (P02) |
| 4 | `7b3ff80b-…-a4a566acc5d.mp4` | 02-PROFISSIONAL | Push-in de pizza inteira até macro extremo de queijo/borda, vapor | **PRODUCTION_VIDEO** | Profissional — macro/produto (P06) |
| 5 | `a75119e9-…-21478eea25ee.mp4` | 02-PROFISSIONAL | Mãos abrindo a massa na bancada enfarinhada, forno c/ chama ao fundo | **PRODUCTION_VIDEO** | Profissional — processo (P04) |
| 6 | `2f7c2b09-…-5f4298c45cf6.mp4` | 03-PREMIUM | Cheese-pull cinematográfico, chamas do forno, parmesão/manjericão caindo, pedra preta | **PRODUCTION_VIDEO** | Premium — hero (M01) |
| 7 | `4198d4b4-…-270f51d9634c.mp4` | 03-PREMIUM | **Montagem dos ingredientes**: de separados (crosta→molho→queijo→tomate→pepperoni→manjericão→temperos) até quase montado, fundo preto | **MOTION_REFERENCE** | Premium — referência do exploded view (M02). O exploded do site é **interativo** (7 PNG RGBA). Este clipe pode servir de fallback de `prefers-reduced-motion` junto com `exploded-poster.jpg`. |
| 8 | `4c2643c6-…-f014ed4df479.mp4` | 03-PREMIUM | Macro de pizza, cheese-pull, rack-focus para uma folha de manjericão nítida, vapor | **PRODUCTION_VIDEO** | Premium — macro food-film (M11) |
| 9 | `8d78d14d-…-49bac86f959f.mp4` | 03-PREMIUM | Interior do forno a lenha, lenha pegando fogo, chama cresce até brasa forte | **PRODUCTION_VIDEO** | Premium — fogo/transformação (M10) |
| 10 | `WhatsApp Video 2026-09-04 at 23.07.46.mp4` | 04-REFERENCIAS | **Screen-recording de TikTok** (@docmo.agency) mostrando site "BRACE. Stone-Fired" de terceiros | **MOTION_REFERENCE** | Só estudo de ritmo/scroll/reveal. **Nunca publicar** (marca de terceiros + watermark TikTok). |
| 11 | `WhatsApp Video 2026-09-07 at 23.19.21.mp4` | 04-REFERENCIAS | **Screen-recording de TikTok** (@lucca.the.develop) "Nothing beats Claude design" — site de terceiros | **MOTION_REFERENCE** | idem — nunca publicar |
| 12 | `WhatsApp Video 2026-09-07 at 23.19.36.mp4` | 04-REFERENCIAS | **Screen-recording de TikTok** (@docmo.agency) — "burger builder" de terceiros | **MOTION_REFERENCE** | idem — nunca publicar |
| 13 | `WhatsApp Video 2026-09-07 at 23.19.57.mp4` | 04-REFERENCIAS | **Screen-recording de TikTok** (@nomadatoast) — first/last-frame AI, casa em jardim | **MOTION_REFERENCE** | idem — nunca publicar |
| 14 | `Digital_system_animation_archite…_202609090117.mp4` | 05-CF-WEB-STUDIO | Camadas de vidro (UI → linhas de dados → grade de nós → hardware) c/ pulso teal atravessando | **PRODUCTION_VIDEO** | CF — CF02 Exploded Digital System |
| 15 | `Neural_core_brand_film_animation_202609090117.mp4` | 05-CF-WEB-STUDIO | Esfera rochosa, anéis orbitais, constelação teal se formando, partículas | **PRODUCTION_VIDEO** | CF — CF01 Neural Core (hero) |
| 16 | `a9973ac1-…-db9396c61db4.mp4` | 05-CF-WEB-STUDIO | Painéis de vidro no espaço com UIs de site (montanhas), acento teal, órbita de câmera | **PRODUCTION_VIDEO** | CF — CF03 Immersive Interface |

**Resumo:** 11 `PRODUCTION_VIDEO` · 5 `MOTION_REFERENCE` (vídeo 7 + as 4 referências) · 0 `UNUSED`. Nenhuma correspondência forçada.

### Notas de otimização (§77)

Os 12 clipes de produção já são 720p/H.264/8s/3–5 MB — próximos de web-ready. Ao usar cada um: gerar 1 derivado `.mp4` (H.264, `+faststart`, ~1280w, ~2–2,5 Mbps) + 1 `poster.jpg`; `.webm` só se o `.mp4` ficar pesado. Sem dezenas de variantes. Originais permanecem READ-ONLY no ASSET_ROOT.

## Categorias

`PRODUCTION_IMAGE` · `PRODUCTION_VIDEO` · `INTERACTIVE_LAYER` (PNG recortado p/ exploded view) · `MOTION_REFERENCE` (só estudo de movimento) · `UNUSED`

## Convenção de destino (após seleção — só o que for usado)

```
forno-nobile/public/media/
  essencial/   images/  videos/
  profissional/ images/ videos/
  premium/     images/  videos/  layers/
cf-web-studio.github.io/public/media/cf/
  images/  videos/
```
Frontend referencia caminho web (`/forno-nobile/premium/media/...` conforme base do Vite). **Nunca** caminho Windows. Originais permanecem só no ASSET_ROOT.

---

## 01-ESSENCIAL  →  Forno Nobile / tier Essencial

| Arquivo original | Tipo | Seção | Finalidade | Prod/Ref | Copiar? | Slug destino | Responsivo | Loading |
|---|---|---|---|---|---|---|---|---|
| WhatsApp Image ...23.16.09.jpeg | PRODUCTION_IMAGE | Hero | Pizza pepperoni na tábua, forno ao fundo, luz quente — 16:9 | Prod | SIM | `essencial/images/hero-forno.jpg` | `srcset` 768/1280/1920, `sizes=100vw` | `fetchpriority=high`, sem lazy (LCP) |
| WhatsApp Image ...23.18.33.jpeg | PRODUCTION_IMAGE | Mais pedidas / Cardápio | Trio de pizzas na mesa (margherita, 4 queijos, pepperoni) | Prod | SIM | `essencial/images/trio-mais-pedidas.jpg` | 640/1024 | `loading=lazy` |
| WhatsApp Image ...23.20.35.jpeg | PRODUCTION_IMAGE | Sobre / Ambiente | Salão com clientes, forno abobadado, pizza em primeiro plano | Prod | SIM | `essencial/images/salao.jpg` | 640/1024/1600 | `loading=lazy` |
| WhatsApp Image ...23.22.30.jpeg | PRODUCTION_IMAGE | Processo | Pizza na pá entrando no forno em chamas | Prod | SIM | `essencial/images/forno-pa.jpg` | 640/1024/1600 | `loading=lazy` |
| WhatsApp Image ...23.24.21.jpeg | PRODUCTION_IMAGE | Galeria / Experiência | Pessoas partilhando pizza, fatias na mão, vinho/cerveja | Prod | SIM | `essencial/images/mesa-compartilhada.jpg` | 640/1024 | `loading=lazy` |
| WhatsApp Image ...23.28.17.jpeg | PRODUCTION_IMAGE | Localização / Rodapé | Fachada ao anoitecer, luz quente, mesas na calçada | Prod | SIM | `essencial/images/fachada-noite.jpg` | 640/1024/1600 | `loading=lazy` |
| c6dbecb4-75f2-4c47-84bc-29cf8f645e5c.mp4 (3,30 MB) | PRODUCTION_VIDEO *(hipótese)* | Hero (loop ambiente) | ⚠ NÃO VERIFICADO — provável clipe ambiente do tier Essencial | ? | talvez | `essencial/videos/hero-ambiente.mp4` | poster obrigatório | `preload=none`, autoplay muted playsinline, pausa fora da viewport |

**Regra do tier:** Essencial não usa vídeo cinematográfico pesado (§28). Se o clipe acima for chamativo demais, fica `UNUSED` e o hero é só imagem.

---

## 02-PROFISSIONAL  →  Forno Nobile / tier Profissional

| Arquivo original | Tipo | Seção | Finalidade | Prod/Ref | Copiar? | Slug destino | Responsivo | Loading |
|---|---|---|---|---|---|---|---|---|
| WhatsApp Image ...23.30.57.jpeg | PRODUCTION_IMAGE | Hero campanha | Pizza cinematográfica, cheese pull, salão escuro — 16:9 | Prod | SIM | `profissional/images/hero-campanha.jpg` | 768/1280/1920 | `fetchpriority=high` (LCP) |
| WhatsApp Image ...23.33.03.jpeg | PRODUCTION_IMAGE | Campanha / Outdoor | Prédio urbano com painel gigante de pizza, entardecer, carros | Prod | SIM | `profissional/images/outdoor-cidade.jpg` | 768/1280/1920 | `loading=lazy` |
| WhatsApp Image ...23.34.34.jpeg | PRODUCTION_IMAGE | Manifesto / Editorial | Flat-lay retrato (~4:5) margherita + grafismos de pincel | Prod | SIM | `profissional/images/editorial-manifesto.jpg` | 600/1000 | `loading=lazy` |
| WhatsApp Image ...23.36.23.jpeg | PRODUCTION_IMAGE | Processo | Mãos abrindo a massa, forno ao fundo | Prod | SIM | `profissional/images/processo-massa.jpg` | 768/1280 | `loading=lazy` |
| WhatsApp Image ...23.43.32.jpeg | PRODUCTION_IMAGE | Experiência / Ambiente | Interior sofisticado amplo, forno de mármore, adega | Prod | SIM | `profissional/images/salao-amplo.jpg` | 768/1280/1920 | `loading=lazy` |
| WhatsApp Image ...23.46.34.jpeg | PRODUCTION_IMAGE | Reserva / Experiência | Mesa escura com pizza + taça de vinho, cinematográfico | Prod | SIM | `profissional/images/reserva-mesa.jpg` | 768/1280 | `loading=lazy` |
| WhatsApp Image ...23.48.03.jpeg | PRODUCTION_IMAGE | Produtos / Galeria | Macro da pizza (pepperoni + tomate), luz quente | Prod | SIM | `profissional/images/macro-produto.jpg` | 640/1024/1600 | `loading=lazy` |
| a75119e9-1f6a-4684-87b2-21478eea25ee.mp4 (3,61 MB) | PRODUCTION_VIDEO *(hipótese)* | Storytelling / Processo | ⚠ NÃO VERIFICADO | ? | talvez | `profissional/videos/clip-1.mp4` | poster | `preload=none`, pausa fora da viewport |
| 53dee848-2b87-4bf0-9719-cdcf84297aad.mp4 (3,30 MB) | PRODUCTION_VIDEO *(hipótese)* | Campanha | ⚠ NÃO VERIFICADO | ? | talvez | `profissional/videos/clip-2.mp4` | poster | idem |
| 77c20465-a6a5-4ff6-b307-34f9e6b89cfa.mp4 (4,93 MB) | PRODUCTION_VIDEO *(hipótese)* | Ambiente | ⚠ NÃO VERIFICADO | ? | talvez | `profissional/videos/clip-3.mp4` | poster | idem |
| 7b3ff80b-92de-4ee5-a6e1-8e4a566acc5d.mp4 (3,46 MB) | PRODUCTION_VIDEO *(hipótese)* | Produto | ⚠ NÃO VERIFICADO | ? | talvez | `profissional/videos/clip-4.mp4` | poster | idem |

**Regra do tier:** no máx. 2–3 vídeos e nunca em sequência (§29) — intercalar com imagem estática, tipografia, layout.

---

## 03-PREMIUM  →  Forno Nobile / tier Premium

### PNGs recortados (RGBA, fundo transparente) — camadas do exploded view

Ordem de montagem (de baixo para cima); a timeline de scroll monta na ordem inversa (§33).

| Arquivo original | Camada | Conteúdo | Tipo | Slug destino | Observações |
|---|---|---|---|---|---|
| ChatGPT Image ...00_13_02.png | 1 | Massa / base assada (borda, sem recheio) | INTERACTIVE_LAYER | `premium/layers/01-massa.png` | perspectiva ~30° |
| ChatGPT Image ...00_14_56.png | 2 | Molho de tomate (disco) | INTERACTIVE_LAYER | `premium/layers/02-molho.png` | perspectiva ~30° |
| ChatGPT Image ...00_17_08.png | 3 | Queijo derretido | INTERACTIVE_LAYER | `premium/layers/03-queijo.png` | perspectiva ~30°, escorridos nas bordas |
| ChatGPT Image ...00_19_41.png | 4 | Pepperoni / calabresa (fatias espalhadas) | INTERACTIVE_LAYER | `premium/layers/04-pepperoni.png` | top-down plano |
| ChatGPT Image ...00_21_44.png | 5 | Tomate (metades de cereja) | INTERACTIVE_LAYER | `premium/layers/05-tomate.png` | top-down plano |
| ChatGPT Image ...00_23_45.png | 6 | Manjericão (folhas) | INTERACTIVE_LAYER | `premium/layers/06-manjericao.png` | top-down plano, leve halo verde na matte |
| ChatGPT Image ...00_26_37.png | 7 | Temperos / finalização (parmesão, ervas, pimenta, sal) | INTERACTIVE_LAYER | `premium/layers/07-temperos.png` | top-down plano, halo colorido na matte |

**Nota de produção:** camadas 1–3 estão em perspectiva ~30°; 4–7 são top-down planas. Há leve franja colorida (matte imperfeita) em algumas. É **utilizável** para um exploded view 2.5D em DOM/CSS `perspective` + GSAP/ScrollTrigger com ajuste fino de `rotateX`/`scale` por camada. **Não** exige Three.js (§32).

### Imagens

| Arquivo original | Tipo | Seção | Finalidade | Copiar? | Slug destino | Loading |
|---|---|---|---|---|---|---|
| WhatsApp Image ...00_07_51.jpeg | PRODUCTION_IMAGE | Hero | Pizza cinematográfica, cheese pull, chamas do forno ao fundo — 16:9 | SIM | `premium/images/hero.jpg` | `fetchpriority=high` (LCP) |
| WhatsApp Image ...00_10_11.jpeg | PRODUCTION_IMAGE | Exploded view | **Render pré-montado** dos ingredientes flutuando (crosta→molho→queijo→tomate→pepperoni→manjericão→temperos) em fundo preto | SIM | `premium/images/exploded-poster.jpg` | estado estático p/ `prefers-reduced-motion` e poster/fallback do exploded (§32/§59) |
| WhatsApp Image ...00_28_15.jpeg | PRODUCTION_IMAGE | Fogo | Interior do forno a lenha, chamas, piso vazio | SIM | `premium/images/forno-fogo.jpg` | poster/bg da seção Fogo |
| WhatsApp Image ...00_30_57.jpeg | PRODUCTION_IMAGE | Produto / Macro | Macro pizza (pepperoni+tomate), vapor, fundo escuro | SIM | `premium/images/macro-1.jpg` | `loading=lazy` |
| WhatsApp Image ...00_35_25.jpeg | PRODUCTION_IMAGE | Sabores / Macro | Macro pizza, brilho do forno ao fundo | SIM | `premium/images/macro-2.jpg` | `loading=lazy` |

### Vídeos (⚠ todos NÃO VERIFICADOS)

| Arquivo original | Tamanho | Hipótese de uso | Classificação provável |
|---|---|---|---|
| 2f7c2b09-c81e-4fe2-910d-5f4298c45cf6.mp4 | 4,40 MB | Hero cinematográfico (M01?) | PRODUCTION_VIDEO |
| 8d78d14d-3d1d-4abc-b21a-49bac86f959f.mp4 | 3,64 MB | Fogo / transformação (M10?) | PRODUCTION_VIDEO |
| 4c2643c6-fa2d-4a91-a426-f014ed4df479.mp4 | 4,48 MB | Macro food-film (M11?) | PRODUCTION_VIDEO |
| 4198d4b4-8c6b-4395-a498-270f51d9634c.mp4 | 3,14 MB | Exploded/montagem (M02?) → o exploded do site é **interativo**, então este tende a virar referência | MOTION_REFERENCE |

---

## 04-REFERENCIAS  →  status indefinido (§2)

Pode conter clipes só de estudo de movimento **ou** renders finais do Flow. **Nenhum verificável agora.** Default = `MOTION_REFERENCE` até o proprietário confirmar. Nada daqui entra em `public/`/Git por enquanto.

| Arquivo original | Tamanho | Nota |
|---|---|---|
| WhatsApp Video 2026-09-04 at 23.07.46.mp4 | 2,28 MB | ⚠ NÃO VERIFICADO |
| WhatsApp Video 2026-09-07 at 23.19.21.mp4 | 1,96 MB | ⚠ NÃO VERIFICADO |
| WhatsApp Video 2026-09-07 at 23.19.36.mp4 | 2,64 MB | ⚠ NÃO VERIFICADO |
| WhatsApp Video 2026-09-07 at 23.19.57.mp4 | 7,31 MB | ⚠ NÃO VERIFICADO — maior arquivo do lote; se for produção, precisa de derivado web |

---

## 05-CF-WEB-STUDIO  →  cf-web-studio.github.io

| Arquivo original | Tipo | Seção | Finalidade | Copiar? | Slug destino | Loading |
|---|---|---|---|---|---|---|
| WhatsApp Image ...01.03.59.jpeg | PRODUCTION_IMAGE | Hero (CF01) | **Neural core** — anéis orbitais, esfera rochosa, partículas, acento teal, fundo grafite. Casa com a identidade CF (grafite + teal). | SIM | `cf/images/cf01-neural-core.jpg` | `fetchpriority=high` (LCP) |
| WhatsApp Image ...01.06.05.jpeg | PRODUCTION_IMAGE | Capacidades / Engenharia (CF02) | **Exploded digital system** — camadas de vidro: UI → linhas de dados → grade de nós → hardware | SIM | `cf/images/cf02-exploded-system.jpg` | `loading=lazy` |
| WhatsApp Image ...01.16.47.jpeg | PRODUCTION_IMAGE | Projetos / Engenharia / CTA (CF03) | **Immersive interface** — composição de painéis de vidro no espaço | SIM | `cf/images/cf03-immersive-interface.jpg` | `loading=lazy` |
| Neural_core_brand_film_animation_202609090117.mp4 | 4,44 MB | Hero (CF01) | ⚠ NÃO VERIFICADO — nome indica render de produção | PRODUCTION_VIDEO *(hipótese)* |
| Digital_system_animation_archite…_202609090117.mp4 | 1,97 MB | CF02 | ⚠ NÃO VERIFICADO — nome indica produção | PRODUCTION_VIDEO *(hipótese)* |
| a9973ac1-68c9-485b-964e-db9396c61db4.mp4 | 2,76 MB | CF03 (interface motion?) | ⚠ NÃO VERIFICADO | PRODUCTION_VIDEO *(hipótese)* |

**Decisão CF01 (§42):** escolher entre o objeto procedural atual (`src/lib/nucleo.ts`) e o neural-core (imagem/vídeo). Não manter dois protagonistas. Requer comparação visual — pendente de ferramenta de QA visual.

---

## Pendências

1. ~~Classificação dos 16 vídeos~~ — **RESOLVIDO** 2026-09-09 via `ffprobe`/`ffmpeg` local (ver tabela "Classificação real dos 16 vídeos").
2. ~~04-REFERENCIAS~~ — **RESOLVIDO**: os 4 são screen-recordings de TikTok de trabalhos de terceiros → `MOTION_REFERENCE`, nunca publicar.
3. **Derivados web de vídeo** (§77) — serão gerados sob demanda, por site, só para os clipes usados (`ffmpeg` local disponível). Não feito ainda.
4. **CF01** — decidir entre objeto procedural atual (`src/lib/nucleo.ts`) e o neural-core (imagem `cf01-neural-core.jpg` + vídeo 15). Requer comparação visual na fase CF.
