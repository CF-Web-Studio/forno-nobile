import { useState } from "react";
import { Reveal } from "../shared/components/Reveal";
import { Picture } from "../shared/components/Picture";
import { SmartVideo } from "../shared/components/SmartVideo";
import { BRAND, MENU, STUDIO, mapsLink, whatsappLink } from "../shared/brand";
import { anchorHandler } from "../shared/ui";

const M = "/forno-nobile/media/essencial";

/* ----------------------------- HERO ----------------------------- */
export function Hero() {
  return (
    <section className="hero" id="topo">
      <div className="hero__media">
        <Picture
          base={`${M}/images/hero-forno`}
          alt="Pizza napolitana recém-assada sobre a tábua, com o forno a lenha aceso ao fundo"
          widths={[768, 1280, 1920]}
          sizes="100vw"
          priority
          className="hero__img"
          objectPosition="center 60%"
        />
        <div className="hero__scrim" />
      </div>

      <div className="wrap hero__inner">
        <Reveal className="hero__copy" stagger={0.09}>
          <p className="eyebrow">Vila das Oliveiras · São Paulo</p>
          <h1>
            Pizza napolitana de verdade,
            <br />
            no forno a lenha.
          </h1>
          <p className="hero__lead">
            Massa de fermentação longa, poucos ingredientes escolhidos com
            critério e um forno a 450&nbsp;°C. A Forno Nobile existe para fazer
            uma coisa muito bem feita.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#reserva" onClick={anchorHandler("#reserva")}>
              Reservar pelo WhatsApp
            </a>
            <a
              className="btn btn-ghost"
              href="#cardapio"
              onClick={anchorHandler("#cardapio")}
            >
              Ver o cardápio
            </a>
          </div>
        </Reveal>
      </div>

      <a
        className="hero__cue"
        href="#mais-pedidas"
        onClick={anchorHandler("#mais-pedidas")}
        aria-label="Rolar para as pizzas mais pedidas"
      >
        <span />
      </a>
    </section>
  );
}

/* ------------------------- MAIS PEDIDAS ------------------------- */
const FEATURED = MENU.slice(0, 3);

export function MaisPedidas() {
  return (
    <section id="mais-pedidas" className="section">
      <div className="wrap grid-split">
        <Reveal className="grid-split__media grid-split__media--img" mask>
          <Picture
            base={`${M}/images/trio-mais-pedidas`}
            alt="Três pizzas napolitanas em uma mesa de madeira: margherita, quatro queijos e diavola"
            widths={[768, 1280, 1920]}
            sizes="(min-width: 900px) 46vw, 92vw"
          />
        </Reveal>
        <div className="grid-split__body">
          <Reveal>
            <p className="eyebrow">As mais pedidas</p>
            <h2>Três que a casa faz todo dia sem pensar.</h2>
          </Reveal>
          <ol className="featured" >
            {FEATURED.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 0.05} className="featured__row">
                <span className="featured__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="featured__name">
                  {item.name}
                  {item.veg && <em className="tag-veg" title="Vegetariana"> · vegetariana</em>}
                </span>
                <span className="featured__price">{item.price}</span>
                <span className="featured__desc">{item.desc}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- CARDÁPIO ---------------------------- */
export function Cardapio() {
  return (
    <section id="cardapio" className="section section--alt">
      <div className="wrap">
        <Reveal className="section__head">
          <p className="eyebrow">Cardápio</p>
          <h2>Seis pizzas que resumem a casa.</h2>
          <p className="section__lede">
            Cardápio curto de propósito. Cada pizza sai do mesmo forno, com a
            mesma massa de 48&nbsp;horas.
          </p>
        </Reveal>

        <ul className="menu">
          {MENU.map((item, i) => (
            <Reveal as="li" key={item.name} className="menu__item" delay={(i % 2) * 0.04}>
              <div className="menu__line">
                <h3>
                  {item.name}
                  {item.veg && <span className="tag-veg"> vegetariana</span>}
                </h3>
                <span className="menu__dots" aria-hidden="true" />
                <span className="menu__price">{item.price}</span>
              </div>
              <p className="menu__desc">{item.desc}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------- SOBRE ----------------------------- */
export function Sobre() {
  return (
    <section id="sobre" className="section">
      <div className="wrap grid-split grid-split--reverse">
        <div className="grid-split__body">
          <Reveal>
            <p className="eyebrow">A casa</p>
            <h2>Uma pizzaria, um forno, uma receita respeitada.</h2>
            <p>
              A Forno Nobile nasceu da vontade de fazer uma única coisa com
              consistência: pizza napolitana como manda a tradição. Sem cardápio
              inflado, sem atalho na fermentação, sem pressa no forno.
            </p>
            <p>
              A equipe trabalha em turno único para manter o controle sobre cada
              disco de massa que sai da casa — do preparo da manhã ao último
              pedido da noite.
            </p>
            <blockquote className="pull">
              “Massa de 48&nbsp;horas, forno a 450&nbsp;°C, 90&nbsp;segundos.
              O resto é cuidado.”
            </blockquote>
          </Reveal>
        </div>
        <Reveal className="grid-split__media" mask>
          <SmartVideo
            src={`${M}/videos/hero-ambiente.mp4`}
            poster={`${M}/videos/hero-ambiente-poster.jpg`}
            label="Pizza na tábua diante do forno a lenha da Forno Nobile"
            ratio="16 / 10"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- GALERIA ---------------------------- */
const GALLERY = [
  { base: "forno-pa", alt: "Pizza na pá entrando no forno a lenha em chamas", tall: true },
  { base: "mesa-compartilhada", alt: "Pessoas dividindo uma pizza à mesa, com taças de vinho" },
  { base: "salao", alt: "Salão da pizzaria com o forno abobadado ao fundo" },
  { base: "fachada-noite", alt: "Fachada da Forno Nobile ao anoitecer, com mesas na calçada", wide: true },
];

export function Galeria() {
  return (
    <section id="galeria" className="section section--alt">
      <div className="wrap">
        <Reveal className="section__head">
          <p className="eyebrow">Galeria</p>
          <h2>Um pouco do salão e da brasa.</h2>
        </Reveal>
        <div className="gallery">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.base}
              className={`gallery__cell${g.tall ? " is-tall" : ""}${g.wide ? " is-wide" : ""}`}
              delay={i * 0.05}
              mask
            >
              <Picture
                base={`${M}/images/${g.base}`}
                alt={g.alt}
                widths={[768, 1280, 1920]}
                sizes="(min-width: 900px) 46vw, 92vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- VISITAR ---------------------------- */
export function Visitar() {
  return (
    <section id="visitar" className="section">
      <div className="wrap grid-split">
        <div className="grid-split__body">
          <Reveal>
            <p className="eyebrow">Visitar</p>
            <h2>Onde e quando.</h2>
          </Reveal>
          <Reveal className="card info-card" delay={0.05}>
            <h3>Endereço</h3>
            <p>
              {BRAND.address}
              <br />
              {BRAND.city}
            </p>
            <a className="btn btn-ghost" href={mapsLink} target="_blank" rel="noopener noreferrer">
              Ver no mapa
            </a>
          </Reveal>
          <Reveal className="card info-card" delay={0.1}>
            <h3>Horários</h3>
            <table className="hours">
              <tbody>
                {BRAND.hours.map((row) => (
                  <tr key={row.d}>
                    <th scope="row">{row.d}</th>
                    <td>{row.h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>

        <Reveal className="grid-split__media map-frame" delay={0.08}>
          <svg viewBox="0 0 400 420" role="img" aria-label="Mapa ilustrativo da região da Forno Nobile, na Vila das Oliveiras">
            <rect width="400" height="420" fill="var(--color-cream-2)" />
            <path d="M-10 130H410M-10 290H410M130 -10V430M270 -10V430" stroke="var(--color-line)" strokeWidth="10" />
            <path d="M40 60C120 90 150 200 270 210s120 120 120 120" fill="none" stroke="#d9c9a8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="200" cy="210" r="15" fill="var(--color-terra)" />
            <circle cx="200" cy="210" r="27" fill="none" stroke="var(--color-terra)" strokeWidth="2" opacity="0.5" />
            <text x="212" y="245" fill="var(--color-ink-2)" fontFamily="var(--font-display)" fontSize="13">
              Forno Nobile
            </text>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- RESERVA ---------------------------- */
export function Reserva() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nome = String(f.get("nome") || "").trim();
    const pessoas = String(f.get("pessoas") || "").trim();
    const data = String(f.get("data") || "").trim();
    const obs = String(f.get("mensagem") || "").trim();
    const msg =
      `Olá! Gostaria de reservar uma mesa na Forno Nobile.\n` +
      `Nome: ${nome}\n` +
      `Pessoas: ${pessoas}\n` +
      `Data: ${data}` +
      (obs ? `\nObservação: ${obs}` : "");
    window.open(whatsappLink(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section id="reserva" className="section section--alt">
      <div className="wrap grid-split">
        <div className="grid-split__body">
          <Reveal>
            <p className="eyebrow">Reservas</p>
            <h2>Reserve pelo WhatsApp.</h2>
            <p>
              Preencha e a mensagem abre no WhatsApp já pronta. Sem cadastro, sem
              conta, sem espera.
            </p>
          </Reveal>
        </div>

        <Reveal className="grid-split__media" delay={0.05}>
          <form className="card form" onSubmit={onSubmit} noValidate>
            <div className="form__field">
              <label htmlFor="nome">Nome</label>
              <input id="nome" name="nome" type="text" required autoComplete="name" />
            </div>
            <div className="form__row">
              <div className="form__field">
                <label htmlFor="pessoas">Pessoas</label>
                <input id="pessoas" name="pessoas" type="number" min={1} max={20} defaultValue={2} required />
              </div>
              <div className="form__field">
                <label htmlFor="data">Data</label>
                <input id="data" name="data" type="date" required />
              </div>
            </div>
            <div className="form__field">
              <label htmlFor="mensagem">Observação (opcional)</label>
              <textarea id="mensagem" name="mensagem" rows={3} placeholder="Aniversário, cadeirinha, restrição alimentar…" />
            </div>
            <button className="btn" type="submit">Abrir no WhatsApp</button>
            <p className="form__note" role="status">
              {sent
                ? "Abrimos o WhatsApp em outra aba. Se não abriu, confira o bloqueador de pop-ups."
                : "Você confere e envia a mensagem no próprio WhatsApp."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- FOOTER ----------------------------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <span className="brand__name brand__name--footer">{BRAND.name}</span>
          <p className="site-footer__addr">
            {BRAND.address} · {BRAND.city}
            <br />
            {BRAND.phoneDisplay} · @{BRAND.instagram}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="site-footer__links">
            <li><a href="#cardapio" onClick={anchorHandler("#cardapio")}>Cardápio</a></li>
            <li><a href="#visitar" onClick={anchorHandler("#visitar")}>Visitar</a></li>
            <li><a href="#reserva" onClick={anchorHandler("#reserva")}>Reservas</a></li>
          </ul>
        </nav>
      </div>
      <div className="wrap site-footer__demo">
        <p>
          Forno Nobile é um projeto conceitual — demonstração da{" "}
          <a href={STUDIO.url} target="_blank" rel="noopener noreferrer">
            {STUDIO.name}
          </a>
          . Nível <strong>Essencial</strong>. Nenhum cliente, prêmio ou avaliação
          é real.
        </p>
      </div>
    </footer>
  );
}
