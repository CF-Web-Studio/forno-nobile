# PENDING ASSETS — produção pelo proprietário

Nenhuma imagem foi gerada nesta tarefa (§67). Abaixo estão os assets **bloqueados**, com prompt pronto para o proprietário produzir quando quiser.

---

## ✅ ASSET_BLOCKED 1 — RESOLVIDO (2026-09-09)

O ASSET_ROOT voltou ao disco e foi auditado. Achados:

- **Nenhum modelo 3D** em lugar nenhum (`.glb/.gltf/.fbx/.obj/.blend/.usdz`).
- Os 7 PNGs de `03-PREMIUM` são **1254×1254 — a mesma resolução dos derivados**.
- Vídeos: 1280×720. Fotos WhatsApp: 1600×900.

**Conclusão:** não existe fonte melhor do que a que já está em `public/media/`.
Regerar derivados não muda nada; os `-1920` seguem sendo upscales porque a
origem nunca teve 1920. O teto real de 1280 é uma propriedade do material.

---

## 🔴 ASSET_BLOCKED 2 — camadas do exploded com câmeras diferentes

`public/media/premium/layers/01..07.webp` — 1254×1254 cada.

| Camadas | Projeção |
|---|---|
| 01 massa, 02 molho, 03 queijo | three-quarter (~30° acima do plano) |
| 04 pepperoni, 05 tomate, 06 manjericão, 07 temperos | top-down achatado |

Duas projeções não empilham num objeto físico coerente. Não será "consertado" com transforms (§66).

**Prompt para reprodução (uma única sessão de render, câmera travada):**

> Conjunto de 7 renders de uma pizza napolitana, **todos com a mesma câmera**: lente 85 mm, câmera 32° acima do plano da mesa, distância e enquadramento idênticos em todos os frames, fundo totalmente transparente (PNG RGBA), iluminação idêntica (key quente vinda da esquerda a 45°, fill suave, sem sombra projetada no chão).
> Renderizar cada camada **isolada, na posição exata que ocupa na pizza montada** — nada centralizado ou reposicionado:
> 1. disco de massa napolitana assada, cornicione alto e manchado de forno, sem cobertura;
> 2. camada de molho de tomate San Marzano espalhada no disco;
> 3. camada de muçarela fior di latte derretida;
> 4. fatias de calabresa distribuídas;
> 5. metades de tomate-cereja confitado;
> 6. folhas de manjericão fresco;
> 7. finalização: lascas de parmesão, pimenta em flocos, fio de azeite.
> Saída: 7 PNGs 2048×2048, canal alfa limpo, sem franja de matte colorida.

Com esse conjunto, a opção **C (2.5D)** volta a ser tecnicamente válida.

### Como isto foi resolvido sem regerar os assets (2026-09-09)

Confirmado por inspeção visual direta, não por confiança no doc anterior:
`01-massa` é three-quarter (~36° de elevação, disco elíptico, bordo em
perspectiva); `06-manjericao` é top-down achatado (arranjo circular perfeito,
sem escorço). Os 7 PNGs são gerações independentes do ChatGPT — uma câmera
por sessão.

**Decisão: parar de simular empilhamento.** Ver `src/premium/Assembly.tsx`.
Nenhum frame divide a tela com outro — os stills são excelentes isolados e o
defeito só aparecia na composição. O clímax é um **match-cut** para
`macro.mp4`: a pizza montada parece montada porque **é** real, não porque foi
composta.

Se os 7 layers forem regerados com o prompt acima, 2.5D e 3D voltam à mesa —
mas a solução atual não depende disso.

---

## ⚠️ ASSET_BLOCKED 3 — teto de resolução do Premium

Vídeos: 1280×720. Imagens: fonte 720p-class (os `-1920` são upscale).

**Impacto:** hero full-bleed em 1440/1920 fica visivelmente mole. O V3 contorna com **abertura contida** (ver `docs/v3/ASSET-AUDIT.md`) — solução de direção de arte, não patch.

**Prompt, se o proprietário quiser um hero full-bleed no futuro:**

> Still cinematográfico horizontal 3840×2160 de uma pizza napolitana recém-saída do forno a lenha, sobre pedra escura; boca do forno com chama viva desfocada ao fundo; vapor sutil; luz quente lateral; profundidade de campo rasa; sem texto, sem marca d'água; espaço negativo escuro à esquerda para tipografia.
