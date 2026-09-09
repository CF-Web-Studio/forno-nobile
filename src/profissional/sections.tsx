import { useRef, useState } from "react";
import { Reveal } from "../shared/components/Reveal";
import { Parallax } from "../shared/components/Parallax";
import { Picture } from "../shared/components/Picture";
import { SmartVideo } from "../shared/components/SmartVideo";
import { MagneticButton } from "../shared/components/MagneticButton";
import { useGsapContext } from "../shared/motion/hooks";
import { BRAND, MENU, STUDIO, mapsLink, whatsappLink } from "../shared/brand";
import { anchorHandler } from "../shared/ui";

const M = "/forno-nobile/media/profissional";

/* ------------------------------- HERO ------------------------------- */
export function Hero() {
  return (
    /* Capa editorial em split: a página é dividida por uma linha vertical dura,
       tipografia de masthead de um lado, imagem do outro. Território próprio —
       o Essencial põe o tipo SOBRE a foto, o Premium usa banda contida no
       escuro (§27). E metade de 1440 são 720 px, dentro do teto de 1280. */
    <section className="p-hero" id="topo">
      <div className="p-hero__type">
        <div className="p-hero__typeInner">
          <Reveal>
            <p className="p-hero__issue">
              <span>Forno Nobile</span>
              <span aria-hidden="true">—</span>
              <span>Campanha 01</span>
            </p>
            <div className="overline-rule" />
          </Reveal>
          <Reveal stagger={0.08}>
            <h1 className="p-hero__title">
              Poucos ingredientes.
              <br />
              <em>Nenhum atalho.</em>
            </h1>
          </Reveal>
          <Reveal className="p-hero__meta" delay={0.1}>
            <p>
              Uma pizzaria napolitana construída em torno de três decisões: a
              massa, o forno e o tempo.
            </p>
            <div className="p-hero__actions">
              <MagneticButton className="btn" href="#reservas" onClick={anchorHandler("#reservas")}>
                Reservar mesa
              </MagneticButton>
              <a className="btn btn-line" href="#processo" onClick={anchorHandler("#processo")}>
                Ver o processo
              </a>
            </div>
          </Reveal>
        </div>
        <span className="p-hero__scrollcue">Role</span>
      </div>

      <figure className="p-hero__plate">
        <SmartVideo
          src={`${M}/videos/hero.mp4`}
          poster={`${M}/videos/hero-poster.jpg`}
          label="Fatia de pizza napolitana sendo erguida, com o queijo se esticando, no salão da Forno Nobile"
          fill
          playWhenVisible={false}
          objectPosition="center 55%"
        />
        <figcaption className="p-hero__cap">Salão — hora do serviço</figcaption>
      </figure>
    </section>
  );
}

/* ----------------------------- MANIFESTO ----------------------------- */
export function Manifesto() {
  const ref = useGsapContext(({ root, reduced, gsap, ScrollTrigger }) => {
    if (reduced) return;
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    gsap.set(lines, { yPercent: 110 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: "top 72%" },
    });
    return () => ScrollTrigger.getAll().forEach((s) => s.trigger === root && s.kill());
  });

  const lines = [
    ["Massa de ", "48 horas."],
    ["Forno a lenha, ", "450 °C."],
    ["Noventa segundos. ", "O resto é cuidado."],
  ];

  return (
    <section className="sec manifesto" id="manifesto">
      <div className="wrap-tight" ref={ref}>
        <div className="overline-rule" />
        <p className="manifesto__body">
          {lines.map((l, i) => (
            <span className="line-mask" key={i}>
              <span data-line style={{ display: "block" }}>
                {l[0]}
                <span className="dim">{l[1]}</span>
              </span>
            </span>
          ))}
        </p>
        <p className="manifesto__sign">Forno Nobile — desde a brasa até a mesa</p>
      </div>
    </section>
  );
}

/* ------------------------- STICKY STORYTELLING ------------------------- */
const STEPS = [
  {
    n: "01",
    title: "A massa não tem pressa",
    body: "Farinha, água, sal e fermento. Dois dias de fermentação lenta antes de virar disco — leveza que não se apressa.",
    img: "processo-massa",
    alt: "Mãos abrindo a massa de pizza sobre a bancada enfarinhada",
  },
  {
    n: "02",
    title: "O forno faz o resto",
    body: "Lenha de eucalipto, pedra refratária, teto a 450 °C. Noventa segundos de forno e a borda ganha as manchas de leopardo.",
    img: "salao-amplo",
    alt: "Forno a lenha de mármore no salão da Forno Nobile",
  },
  {
    n: "03",
    title: "Chega inteira à mesa",
    body: "Do balcão ao salão em poucos passos. A pizza sai do forno e vai direto para a mesa, ainda com o vapor.",
    img: "macro-produto",
    alt: "Close da pizza napolitana recém-assada, com queijo derretido e manjericão",
  },
];

export function Storytelling() {
  const [active, setActive] = useState(0);

  const ref = useGsapContext(({ root, ScrollTrigger }) => {
    const steps = root.querySelectorAll<HTMLElement>(".story__step");
    const triggers = Array.from(steps).map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <section className="sec story" id="processo">
      <div className="wrap">
        <Reveal className="sec__head">
          <span className="eyebrow">O processo</span>
          <h2 className="sec__title">Três decisões, na ordem certa.</h2>
        </Reveal>

        <div className="story__inner" ref={ref}>
          <div className="story__sticky">
            <div className="story__media">
              {STEPS.map((s, i) => (
                <Picture
                  key={s.img}
                  base={`${M}/images/${s.img}`}
                  alt={s.alt}
                  widths={[768, 1280]}
                  sizes="(min-width: 960px) 42vw, 92vw"
                  className={i === active ? "is-active" : ""}
                />
              ))}
              <span className="story__frameno">{STEPS[active].n} / 03</span>
            </div>
          </div>

          <div className="story__steps">
            {STEPS.map((s) => (
              <article className="story__step" key={s.n}>
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PRODUTOS ------------------------------ */
export function Produtos() {
  return (
    <section className="sec sec--paper" id="produtos">
      <div className="wrap produtos__grid">
        <Reveal className="produtos__media" mask>
          <Picture
            base={`${M}/images/editorial-manifesto`}
            alt="Composição editorial: pizza margherita vista de cima, cercada de tomate, manjericão e parmesão"
            widths={[600, 1000, 1400]}
            sizes="(min-width: 900px) 52vw, 92vw"
          />
        </Reveal>

        <div>
          <Reveal>
            <div className="overline-rule" />
            <span className="eyebrow">Cardápio</span>
            <h2 className="sec__title">Seis pizzas. Sem gordura no cardápio.</h2>
          </Reveal>
          <ul className="p-menu">
            {MENU.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 0.03}>
                <div className="p-menu__line">
                  <span className="p-menu__name">
                    {item.name}
                    {item.veg && <span className="p-menu__veg">vegetariana</span>}
                  </span>
                  <span className="p-menu__price">{item.price}</span>
                </div>
                <p className="p-menu__desc">{item.desc}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- CAMPANHA / OUTDOOR -------------------------- */
export function Campanha() {
  return (
    <section aria-label="Campanha">
      <div className="wrap campanha">
        <Parallax className="campanha__bg" depth="background" distance={60}>
          <Picture
            base={`${M}/images/outdoor-cidade`}
            alt="Painel publicitário gigante da Forno Nobile em um prédio, ao entardecer, com trânsito passando"
            /* sem 1920: é upscale de uma fonte de 1280 (ASSET-AUDIT) */
            widths={[768, 1280]}
            sizes="(min-width: 900px) 56vw, 92vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="campanha__scrim" />
        </Parallax>

        <div>
          <Reveal stagger={0.08}>
            <span className="eyebrow" style={{ color: "var(--color-gold)" }}>
              Na cidade
            </span>
            <h2 className="campanha__title">A mesma pizza que está no forno está no outdoor.</h2>
            <p className="campanha__lead">
              Nada de foto de banco de imagem. O que aparece na campanha sai da
              mesma cozinha, no mesmo dia.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PROCESSO VÍDEO ------------------------------ */
export function ProcessoVideo() {
  return (
    <section className="sec">
      <div className="wrap processo__grid">
        <div>
          <Reveal>
            <div className="overline-rule" />
            <span className="eyebrow">Nos bastidores</span>
            <h2 className="sec__title">O gesto que não muda há gerações.</h2>
            <p style={{ marginTop: "1.2rem", color: "var(--color-cream-dim)" }}>
              Abrir a massa com as mãos, sem rolo, deixando a borda intacta. É o
              que garante o ar dentro do cornicione depois do forno.
            </p>
          </Reveal>
        </div>
        <Reveal className="processo__media" delay={0.05} mask>
          <SmartVideo
            src={`${M}/videos/processo.mp4`}
            poster={`${M}/videos/processo-poster.jpg`}
            label="Pizzaiolo abrindo a massa à mão diante do forno a lenha"
            ratio="16 / 11"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- GALERIA EDITORIAL ------------------------- */
const GAL = [
  { cls: "edi__a", img: "hero-campanha", cap: "Salão — hora do serviço", alt: "Pizza cinematográfica no salão escuro, com o queijo se esticando" },
  { cls: "edi__b", img: "reserva-mesa", cap: "Mesa reservada", alt: "Mesa posta com pizza e taça de vinho no salão da Forno Nobile" },
  { cls: "edi__c", img: "macro-produto", cap: "Detalhe — cornicione", alt: "Close da borda da pizza com manchas de forno" },
  { cls: "edi__d", img: "salao-amplo", cap: "A casa", alt: "Vista ampla do salão da Forno Nobile com o forno de mármore ao fundo" },
];

export function Galeria() {
  return (
    <section className="sec story" id="galeria">
      <div className="wrap">
        <Reveal className="sec__head">
          <span className="eyebrow">Galeria</span>
          <h2 className="sec__title">Um olhar editorial pela casa.</h2>
        </Reveal>
        <div className="edi">
          {GAL.map((g, i) => (
            <Reveal as="figure" key={g.img} className={g.cls} delay={i * 0.05} mask>
              <Picture
                base={`${M}/images/${g.img}`}
                alt={g.alt}
                widths={[768, 1280, 1920]}
                sizes="(min-width: 780px) 55vw, 92vw"
              />
              <figcaption>{g.cap}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- EXPERIÊNCIA + RESERVA --------------------------- */
export function Reserva() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

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
    <section className="sec" id="reservas">
      <div className="wrap">
        <Reveal className="exp__grid" style={{ marginBottom: "clamp(3rem,7vw,6rem)" }}>
          <div className="exp__media">
            <Picture
              base={`${M}/images/reserva-mesa`}
              alt="Mesa reservada com pizza e vinho no salão da Forno Nobile"
              widths={[768, 1280]}
              sizes="(min-width: 900px) 46vw, 92vw"
            />
          </div>
          <div>
            <div className="overline-rule" />
            <span className="eyebrow">A experiência</span>
            <h2 className="sec__title">Reserve uma mesa.</h2>
            <p style={{ marginTop: "1.2rem", color: "var(--color-cream-dim)" }}>
              Salão pequeno, turno único. Reservar com um dia de antecedência
              garante a mesa — principalmente sexta e sábado.
            </p>
            <p style={{ marginTop: "0.8rem", color: "var(--color-cream-dim)" }}>
              {BRAND.address} · {BRAND.city}
              <br />
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-gold)" }}>
                Ver no mapa
              </a>
            </p>
          </div>
        </Reveal>

        <div className="p-reserva">
          <div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Pelo WhatsApp, sem cadastro</h3>
            <p style={{ color: "var(--color-cream-dim)", maxWidth: "40ch" }}>
              Preencha e a mensagem abre pronta no seu WhatsApp. Você revisa e
              envia. Nada é armazenado neste site.
            </p>
            <table style={{ marginTop: "1.6rem", borderCollapse: "collapse", width: "100%", maxWidth: 360 }}>
              <tbody>
                {BRAND.hours.map((h) => (
                  <tr key={h.d}>
                    <th scope="row" style={{ textAlign: "left", fontWeight: 400, color: "var(--color-cream-dim)", padding: "0.4rem 0", borderTop: "1px solid var(--color-hair)" }}>
                      {h.d}
                    </th>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 600, padding: "0.4rem 0", borderTop: "1px solid var(--color-hair)" }}>
                      {h.h}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className="p-form" ref={formRef} onSubmit={onSubmit} noValidate>
            <div className="p-field">
              <label htmlFor="p-nome">Nome</label>
              <input id="p-nome" name="nome" type="text" required autoComplete="name" />
            </div>
            <div className="p-form__row">
              <div className="p-field">
                <label htmlFor="p-pessoas">Pessoas</label>
                <input id="p-pessoas" name="pessoas" type="number" min={1} max={20} defaultValue={2} required />
              </div>
              <div className="p-field">
                <label htmlFor="p-data">Data</label>
                <input id="p-data" name="data" type="date" required />
              </div>
            </div>
            <div className="p-field">
              <label htmlFor="p-obs">Observação (opcional)</label>
              <textarea id="p-obs" name="obs" rows={3} />
            </div>
            <button className="btn" type="submit">Abrir no WhatsApp</button>
            <p className="p-form__note" role="status">
              {sent
                ? "Abrimos o WhatsApp em outra aba."
                : "Você confere e envia a mensagem no próprio WhatsApp."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
export function Footer() {
  return (
    <footer className="p-footer">
      <div className="wrap p-footer__grid">
        <div>
          <span className="p-footer__name">{BRAND.name}</span>
          <p className="p-footer__addr">
            {BRAND.address} · {BRAND.city}
            <br />
            {BRAND.phoneDisplay} · @{BRAND.instagram}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="p-footer__links">
            <li><a href="#processo" onClick={anchorHandler("#processo")}>Processo</a></li>
            <li><a href="#produtos" onClick={anchorHandler("#produtos")}>Cardápio</a></li>
            <li><a href="#reservas" onClick={anchorHandler("#reservas")}>Reservas</a></li>
          </ul>
        </nav>
      </div>
      <div className="wrap p-footer__demo">
        Forno Nobile é um projeto conceitual — demonstração da{" "}
        <a href={STUDIO.url} target="_blank" rel="noopener noreferrer">{STUDIO.name}</a>. Nível{" "}
        <strong>Profissional</strong>. Nenhum cliente, prêmio ou avaliação é real.
      </div>
    </footer>
  );
}
