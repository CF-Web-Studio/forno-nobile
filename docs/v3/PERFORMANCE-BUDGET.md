# V3 — Performance Budget

Medido no build, não estimado.

## Orçamento por tier

| Tier | JS (gzip) | Mídia acima da dobra | WebGL |
|---|---|---|---|
| Essencial | ≤ 70 KB | 1 imagem | zero |
| Profissional | ≤ 110 KB | 1 imagem ou 1 vídeo contido | zero |
| **Premium** | **≤ 135 KB** | 1 vídeo contido ≤ 1.8 MB, `preload=none` + poster | ≤ 1 cena, lazy |
| CF | ≤ 140 KB | 1 poster | 1 cena, lazy |

Baseline V2 do Premium: react 60.3 + gsap 45.5 + lenis 5.7 + tier 5.0 ≈ **116 KB gzip**.

## Medição no Gate P1 (2026-09-09)

A projeção de ~18 KB para `motion` estava errada: com `m` sem `LazyMotion`,
o feature bundle completo entrou (o chunk do tier foi de 5.0 → 51.5 KB).

| Estratégia | JS gzip da página premium | vs. teto 135 KB |
|---|---|---|
| `motion` completo | 160.6 KB | +25.6 |
| `LazyMotion` + `domAnimation` | 148.9 KB | +13.9 |
| **CSS puro, sem `motion`** | **118.7 KB** | **−16.3 ✅** |

Adotado: **sem `motion`** (ver `MOTION-OWNERSHIP.md`). Composição final medida
com `gzip -9` sobre os chunks que `premium/index.html` realmente referencia:

    react 59.9 + gsap 45.2 + lenis 5.7 + premium 6.0 + SmartVideo 4.2 + Parallax 0.4 = 118.7 KB

A folga de 16.3 KB é o espaço reservado para o Three.js do Gate P2.

`hero.mp4` = 1.786 MB — dentro do teto de 1.8 MB, com pouca margem.

## Regras

- Vídeo do hero: `preload="none"`, poster imediato, `play()` só quando visível, `pause()` fora da viewport e com aba oculta.
- Nenhum `-1920` no `srcset` do Premium (são upscales — ver `ASSET-AUDIT.md`). Teto real: 1280.
- Nada de 3D neste Gate. Quando entrar (P2), será `React.lazy` + poster imediato + DPR limitado (mobile 1–1.25, desktop 1–1.75).
- Um único RAF na página: `gsap.ticker` conduz o Lenis. Motion tem seu próprio scheduler mas **não** roda scroll — só microinterações disparadas por evento.
