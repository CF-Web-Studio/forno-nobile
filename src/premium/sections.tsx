import { useState } from "react";
import { Reveal } from "../shared/components/Reveal";
import { Parallax } from "../shared/components/Parallax";
import { SmartVideo } from "../shared/components/SmartVideo";
import { useGsapContext } from "../shared/motion/hooks";
import { BRAND, MENU, STUDIO, mapsLink, whatsappLink } from "../shared/brand";
import { anchorHandler } from "../shared/ui";

const M = "/forno-nobile/media/premium";

/* ------------------------------- MATÉRIA ------------------------------- */
/**
 * Capítulo 01 — abertura editorial. Continua a frase do hero em vez de
 * recomeçar: o handoff entrega "Farinha, água, sal e fogo." e a seção termina
 * o pensamento com "O resto é tempo.".
 *
 * A massa entra como OBJETO, não como foto de fundo: fundo transparente sobre
 * o escuro, contida no teto de nitidez, com peso na entrada. A ficha técnica
 * em grotesk é a "tipografia funcional" — dado de ofício, não enfeite.
 */
const MATERIA_SPECS = [
  { k: "Fermentação", v: "48 h" },
  { k: "Hidratação", v: "65 %" },
  { k: "Forno", v: "450 °C" },
  { k: "Assamento", v: "90 s" },
] as const;

export function Materia() {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;

    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    gsap.set(lines, { yPercent: 110 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.14,
      scrollTrigger: { trigger: root, start: "top 72%" },
    });

    // A massa tem PESO: sobe pouco, assenta devagar, sem bounce.
    const obj = root.querySelector<HTMLElement>(".materia__object");
    if (obj) {
      gsap.fromTo(
        obj,
        { y: 46, scale: 1.035, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 68%" },
        },
      );
      // deriva mínima no scroll — profundidade, não parallax de demo
      gsap.to(obj, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    }

    gsap.from(root.querySelectorAll<HTMLElement>(".materia__spec"), {
      opacity: 0,
      y: 14,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.07,
      scrollTrigger: { trigger: root, start: "top 58%" },
    });
  });

  return (
    <section className="materia" id="materia" ref={ref}>
      <div className="wrap materia__grid">
        <div className="materia__type">
          <p className="chapter__index">Capítulo 01 — Matéria</p>
          <h2 className="materia__title">
            <span className="line-mask"><span data-line>Farinha, água,</span></span>
            <span className="line-mask"><span data-line>sal e fogo.</span></span>
            <span className="line-mask"><span data-line className="materia__dim">O resto é tempo.</span></span>
          </h2>
          <p className="materia__lead">
            Tudo o que vira uma pizza napolitana cabe em quatro palavras. A
            diferença está no que se faz com elas nas 48 horas seguintes.
          </p>
        </div>

        <figure className="materia__object">
          <img
            src={`${M}/layers/01-massa.webp`}
            alt="Disco de massa napolitana assada, com o cornicione alto e manchado de forno"
            width={1254}
            height={1254}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>

      <dl className="wrap materia__specs">
        {MATERIA_SPECS.map((s) => (
          <div className="materia__spec" key={s.k}>
            <dt>{s.k}</dt>
            <dd>{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* -------------------------------- FOGO -------------------------------- */
/**
 * Capítulo 02 — o fogo não é decoração, é a transformação.
 *
 * Composição: a tipografia ATRAVESSA a banda. Sem o cruzamento isto vira
 * "mídia à direita, texto à esquerda", que é o enquadramento do hero.
 *
 * Térmica: em vez de encher a tela de laranja, a seção AQUECE conforme entra —
 * o brilho de brasa e a saturação da mídia sobem com o scroll e recuam ao
 * sair. É mudança de luz, não camada de cor por cima.
 */
export function Fogo() {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    const glow = root.querySelector<HTMLElement>(".fogo__glow");
    const media = root.querySelector<HTMLElement>(".fogo__media");

    const st = { trigger: root, start: "top bottom", end: "bottom top", scrub: true };
    // o calor sobe até o meio da travessia e recua: pico quando a seção manda
    if (glow) {
      gsap.fromTo(
        glow,
        { opacity: 0.35 },
        { opacity: 1, ease: "none", scrollTrigger: { ...st, end: "center center" } },
      );
    }
    if (media) {
      gsap.fromTo(
        media,
        { filter: "brightness(0.82) saturate(0.9)" },
        {
          filter: "brightness(1.06) saturate(1.12)",
          ease: "none",
          scrollTrigger: { ...st, end: "center center" },
        },
      );
    }
  });

  return (
    <section className="fogo" id="fogo" aria-label="O forno" ref={ref}>
      {/* O calor é CSS: gradiente não tem resolução, então preenche o quadro
          inteiro sem custo de nitidez. O vídeo entra CONTIDO (fonte de 1280). */}
      <div className="fogo__glow" aria-hidden="true" />

      <div className="wrap fogo__grid">
        <Parallax className="fogo__media" depth="background" distance={60}>
          <SmartVideo
            src={`${M}/videos/fogo.mp4`}
            poster={`${M}/videos/fogo-poster.jpg`}
            label="Interior do forno a lenha da Forno Nobile com as chamas altas sobre a lenha"
            fill
            objectPosition="center"
          />
        </Parallax>

        <div className="fogo__copy">
          <Reveal stagger={0.08}>
            <p className="chapter__index">Capítulo 02 — Fogo</p>
            <h2 className="fogo__title">
              90 segundos
              <br />
              que mudam <em>tudo.</em>
            </h2>
            <p className="fogo__lead">
              Teto a 450&nbsp;°C, piso de pedra, lenha de eucalipto. A borda incha,
              mancha e fica leve. Não dá para apressar nem atrasar.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PRODUTO ------------------------------ */
/**
 * Capítulo 03 — aqui a pizza vence tudo.
 *
 * O erro anterior: `ratio="4 / 5"` forçava um vídeo 16:9 em retrato e jogava
 * fora 44% da largura. Nao se via uma pizza, se viam fragmentos — e o corte
 * ainda ampliava a fonte de 1280, deixando tudo mole. Agora o plano roda no
 * enquadramento NATIVO, que foi composto de proposito.
 *
 * Ritmo proprio: chapa larga com o texto EMBAIXO, como still de filme com sua
 * legenda. Nenhum texto sobre a parte apetitosa. Diferente do hero (lado a
 * lado), do Fogo (tipo atravessando) e da Montagem (midia + legenda ao lado).
 */
export function Produto() {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    const plate = root.querySelector<HTMLElement>(".produto__plate");
    if (!plate) return;

    gsap.fromTo(
      plate,
      { clipPath: "inset(12% 8% 12% 8%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 74%" },
      },
    );

    // Microprofundidade: poucos pixels, com inercia. O produto NAO persegue o
    // mouse — o quadro fica parado e so o conteudo respira dentro dele.
    if (window.matchMedia("(pointer: fine)").matches) {
      const inner = plate.querySelector<HTMLElement>(".produto__inner");
      if (!inner) return;
      const tx = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3" });
      const ty = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const r = plate.getBoundingClientRect();
        tx(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * -6);
        ty(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -4);
      };
      plate.addEventListener("pointermove", onMove, { passive: true });
      const onLeave = () => {
        tx(0);
        ty(0);
      };
      plate.addEventListener("pointerleave", onLeave);
      return () => {
        plate.removeEventListener("pointermove", onMove);
        plate.removeEventListener("pointerleave", onLeave);
      };
    }
  });

  return (
    <section className="produto" id="produto" ref={ref}>
      <figure className="produto__figure">
        <div className="produto__plate">
          <div className="produto__inner">
            <SmartVideo
              src={`${M}/videos/macro.mp4`}
              poster={`${M}/videos/macro-poster.jpg`}
              label="Close cinematográfico da pizza saindo do forno, com o queijo escorrendo e vapor"
              /* enquadramento NATIVO do arquivo: sem corte, sem ampliar */
              ratio="16 / 9"
            />
          </div>
        </div>

        <figcaption className="produto__caption">
          <p className="chapter__index">Capítulo 03 — Produto</p>
          <h2 className="produto__title">
            Sai do forno e <em>não espera.</em>
          </h2>
          <p className="produto__lead">
            Do balcão à mesa em poucos passos. A muçarela ainda se move, a borda
            ainda estala. É assim que ela deve chegar até você.
          </p>
        </figcaption>
      </figure>
    </section>
  );
}

/* ------------------------------ SABORES ------------------------------ */
/**
 * Capítulo 04 — índice editorial, não catálogo de cards.
 *
 * Por que nada abre por hover: não existem seis fotos distintas de pizza no
 * projeto. Trocar mídia por seleção exigiria inventar asset, e esconder a
 * descrição atrás de hover quebraria o touch. Então TODA a informação fica
 * visível e quem carrega a hierarquia é a tipografia — numeral grande em
 * grotesk, nome em serif editorial, descrição em corpo.
 *
 * O hover só levanta a linha e acende o numeral: reforço, nunca requisito.
 */
export function Sabores() {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    gsap.from(root.querySelectorAll<HTMLElement>(".sabores__row"), {
      opacity: 0,
      y: 26,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: { trigger: root, start: "top 70%" },
    });
  });

  return (
    <section className="sabores" id="sabores" ref={ref}>
      <div className="wrap">
        <header className="sabores__head">
          <p className="chapter__index">Capítulo 04 — Sabores</p>
          <h2 className="sabores__title">
            Seis pizzas. <em>Nada de enrolação.</em>
          </h2>
          <p className="sabores__lead">
            Cardápio curto por decisão, não por falta. Cada uma existe porque
            passou no teste do forno — e as que não passaram não estão aqui.
          </p>
        </header>

        <ol className="sabores__index">
          {MENU.map((item, i) => (
            <li className="sabores__row" key={item.name}>
              <span className="sabores__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="sabores__body">
                <h3 className="sabores__name">
                  {item.name}
                  {item.veg && <span className="sabores__veg">vegetariana</span>}
                </h3>
                <p className="sabores__desc">{item.desc}</p>
              </div>
              <span className="sabores__price">{item.price}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------- EXPERIÊNCIA / RESERVA -------------------------- */
export function Final() {
  const [sent, setSent] = useState(false);
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    gsap.from(root.querySelectorAll<HTMLElement>("[data-fade]"), {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: "top 68%" },
    });

    // pull-back: o plano recua devagar enquanto a seção atravessa a tela
    const shot = root.querySelector<HTMLElement>(".final__shotImg");
    if (shot) {
      gsap.fromTo(
        shot,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "center center", scrub: true },
        },
      );
    }
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg =
      `Olá! Gostaria de reservar uma mesa na Forno Nobile.\n` +
      `Nome: ${String(f.get("nome") || "").trim()}\n` +
      `Pessoas: ${String(f.get("pessoas") || "").trim()}\n` +
      `Data: ${String(f.get("data") || "").trim()}` +
      (f.get("obs") ? `\nObservação: ${String(f.get("obs")).trim()}` : "");
    window.open(whatsappLink(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section className="m-final" id="reservas" ref={ref}>
      {/* ÚLTIMO PLANO: o filme abre no fogo e fecha no fogo. A copy já diz
          "forno sempre aceso" — a imagem termina a frase. Recua devagar no
          scroll, como um pull-back final. */}
      <figure className="final__shot" data-fade>
        <img
          className="final__shotImg"
          src={`${M}/images/forno-fogo-1280.webp`}
          srcSet={`${M}/images/forno-fogo-768.webp 768w, ${M}/images/forno-fogo-1280.webp 1280w`}
          sizes="(min-width: 768px) 640px, 92vw"
          alt="A boca do forno a lenha da Forno Nobile, acesa, ao fim do serviço"
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className="wrap-tight">
        <p className="chapter__index" data-fade>Capítulo 05 — Mesa</p>
        <h2 className="m-final__title" data-fade>
          A experiência termina numa cadeira, <em>não numa tela.</em>
        </h2>
        <p className="m-final__lead" data-fade>
          Salão pequeno, turno único, forno sempre aceso. Reserve com um dia de
          antecedência — sexta e sábado enchem.
        </p>
        <a className="btn motion-cta final__cta" href={whatsappLink("Olá! Gostaria de reservar uma mesa na Forno Nobile.")} target="_blank" rel="noopener noreferrer" data-fade>
          Reservar pelo WhatsApp
        </a>

        <div className="m-reserva" data-fade>
          <div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Ou preencha aqui</h3>
            <p style={{ color: "var(--color-cream-dim)", maxWidth: "38ch" }}>
              A mensagem abre pronta no seu WhatsApp. Nada é enviado nem
              armazenado por este site.
            </p>
            <p style={{ marginTop: "1.4rem", color: "var(--color-cream-dim)" }}>
              {BRAND.address} · {BRAND.city}
              <br />
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-gold)" }}>
                Ver no mapa
              </a>
            </p>
          </div>

          <form className="m-form" onSubmit={onSubmit} noValidate>
            <div className="m-field">
              <label htmlFor="m-nome">Nome</label>
              <input id="m-nome" name="nome" type="text" required autoComplete="name" />
            </div>
            <div className="m-form__row">
              <div className="m-field">
                <label htmlFor="m-pessoas">Pessoas</label>
                <input id="m-pessoas" name="pessoas" type="number" min={1} max={20} defaultValue={2} required />
              </div>
              <div className="m-field">
                <label htmlFor="m-data">Data</label>
                <input id="m-data" name="data" type="date" required />
              </div>
            </div>
            <div className="m-field">
              <label htmlFor="m-obs">Observação (opcional)</label>
              <textarea id="m-obs" name="obs" rows={3} />
            </div>
            <button className="btn" type="submit">Abrir no WhatsApp</button>
            <p className="m-form__note" role="status">
              {sent ? "Abrimos o WhatsApp em outra aba." : "Você confere e envia no próprio WhatsApp."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER ------------------------------- */
export function Footer() {
  return (
    <footer className="m-footer">
      <div className="wrap m-footer__grid">
        <div>
          <span className="m-footer__name">{BRAND.name}</span>
          <p className="m-footer__addr">
            {BRAND.address} · {BRAND.city}
            <br />
            {BRAND.phoneDisplay} · @{BRAND.instagram}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="m-footer__links">
            <li><a href="#exploded" onClick={anchorHandler("#exploded")}>Montagem</a></li>
            <li><a href="#sabores" onClick={anchorHandler("#sabores")}>Sabores</a></li>
            <li><a href="#reservas" onClick={anchorHandler("#reservas")}>Reservas</a></li>
          </ul>
        </nav>
      </div>
      <div className="wrap m-footer__demo">
        Forno Nobile é um projeto conceitual — demonstração da{" "}
        <a href={STUDIO.url} target="_blank" rel="noopener noreferrer">{STUDIO.name}</a>. Nível{" "}
        <strong>Premium</strong>. Nenhum cliente, prêmio ou avaliação é real.
      </div>
    </footer>
  );
}
