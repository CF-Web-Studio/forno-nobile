# V3 — Art Direction (Premium)

## Por que o V2 tinha "cara de IA" — nomeado, não opinado

O V2 Premium caiu em dois padrões reconhecíveis de página gerada:

1. **Near-black + um único acento neon** (`#0c0908` + `#e0561f`) — monocromia laranja sobre preto azulado.
2. **Template chrome**, todos presentes ao mesmo tempo:
   - eyebrow ALL-CAPS com tracking largo acima de *cada* título (`.p-eyebrow`);
   - `"Capítulo 01 — Matéria"` (padrão `PALAVRA — fragmento` com travessão espaçado);
   - metadados unidos por ponto médio (`Rua das Oliveiras, 128 · São Paulo / SP`);
   - preto tingido no lugar de preto;
   - hero com vídeo edge-to-edge.

V3 remove os cinco itens do bloco 2 **inteiramente**. Não são reduzidos — são retirados.

## Assunto

Não "um site de pizzaria". O assunto é **o forno**: cinza, brasa, farinha, casca queimada, e os 90 segundos em que a massa vira outra coisa. A direção sai dos materiais, não de uma paleta de tendência.

## Paleta — 6 valores, tirados do forno

| Token | Hex | Origem material | Papel |
|---|---|---|---|
| `--ash` | `#17130F` | cinza de lenha (preto **quente**, não azulado) | fundo |
| `--char` | `#241C16` | crosta carbonizada | superfície elevada, bordas |
| `--flour` | `#EDE6D8` | farinha 00 — mineral, ligeiramente cinza | texto principal |
| `--crust` | `#C98A4B` | cornicione assado | **a luz** da página, não um acento |
| `--ember` | `#B23A0E` | brasa profunda (mais escura/menos neon que V2) | ação, calor |
| `--basil` | `#4E6B45` | manjericão dessaturado | contrapeso frio — impede a página monocromática laranja |

`--flour` é deliberadamente mais mineral que o creme `#F4F1EA` genérico. `--crust` é tratado como fonte de luz (aparece em grandes áreas de tipografia e no vinheta do vídeo), não como faixa de destaque.

## Tipografia — uma família, amplitude real

Uma só família. Sem par serif/sans. Sem webfont (custo $0, zero requisição, sem FOUT).

```
--font: "Helvetica Neue", "Inter Tight", Inter, system-ui, sans-serif;
```

| Papel | Peso | Tamanho | Tracking | Leading |
|---|---|---|---|---|
| Display (hero) | 700 | `clamp(3.2rem, 8.4vw, 8rem)` | `-0.045em` | `0.90` |
| Chapter numeral | 700 | `clamp(3rem, 6vw, 5.5rem)` | `-0.03em` | `1` |
| Body | 400 | `1.06rem` | `0` | `1.65` |
| Micro | 500 | `0.78rem` | `0.01em` | `1.4` |

O display é **elemento gráfico**: leading 0.90 faz as três linhas se comportarem como um bloco sólido, e o bloco encosta na abertura de mídia. Não é um título entregando texto.

**Proibido nesta direção:** eyebrow all-caps; destacar uma única palavra do headline em cor/itálico; rótulo tipográfico acima de conteúdo; `→` no texto de botão; monoespaçada para rótulos.

O marcador de capítulo passa a ser **um numeral grande, dentro da composição**, alinhado à base da primeira linha do headline — informação estrutural (é o capítulo 1 de uma sequência real), não decoração.

## Layout do hero — dois campos assimétricos que se encaixam

```
1440 × 900
┌──────────────────────────────────────────────────────────┐
│  [nav]                                                   │
│                                                          │
│                                                          │
│   01  Da matéria-                     ╔═══════════════╗  │
│       prima                           ║               ║  │
│       ao fogo.                        ║   abertura    ║  │
│                     ╲                 ║   retrato     ║  │
│       Noventa segundos entre           ║    4:5       ║  │
│       farinha e brasa.                ║  ~620×775    ║  │
│                                       ║               ║  │
│       [ Reservar ]  [ Ver o forno ]   ╚═══════════════╝  │
│                                                          │
│   ────────────────────────────                           │
└──────────────────────────────────────────────────────────┘
     ↑ campo de texto              ↑ abertura sobrepõe levemente
       (muito espaço negativo)       a coluna de texto — os campos
                                     se encaixam, não são colunas
```

- Texto **alinhado à esquerda, ragged right**. Nada centralizado.
- A abertura invade ~40 px a coluna do texto: os dois campos se travam em vez de ficarem lado a lado arrumadinhos.
- **Zero border-radius** nos elementos grandes. Raio fica reservado para controles pequenos (botões). Uma aresta dura na mídia lê como corte de câmera, não como card.
- Espaço negativo é o material principal do lado esquerdo — o headline ocupa ~46% da largura e o resto fica vazio de propósito.

### 390 × 844 (mobile) — composição própria, não a de desktop encolhida

```
┌───────────────┐
│ [nav]         │
│               │
│ 01            │
│ Da matéria-   │
│ prima         │
│ ao fogo.      │
│               │
│ ┌───────────┐ │  abertura vira PAISAGEM
│ │  16:10    │ │  largura total, sangra até as margens
│ └───────────┘ │
│               │
│ Noventa seg…  │
│ [ Reservar ]  │
└───────────────┘
```

A abertura desce para baixo do headline e muda de proporção (retrato → paisagem). Isso não é um ajuste responsivo: é o crop que mantém a fonte 720p nítida em DPR 2 (ver `ASSET-AUDIT.md`).

## Princípios (o que faz esta página específica)

1. **A abertura é o único elemento ousado.** Todo o resto — nav, tipografia de corpo, botões — fica quieto e disciplinado.
2. **Nitidez é decisão de direção de arte**, não detalhe técnico: o formato da janela existe para caber na resolução real da fonte.
3. **Um só momento orquestrado** por capítulo. Sem fade-up em cada seção.
4. **Preto quente, luz de cornicione.** A página é iluminada pela cor do pão assado, não por um glow.
5. **Nada de rótulo explicando o que a seção é.** Se precisa de eyebrow para se explicar, a composição falhou.
