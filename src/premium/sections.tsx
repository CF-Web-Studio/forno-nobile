import { useState } from "react";
import { Reveal } from "../shared/components/Reveal";
import { Parallax } from "../shared/components/Parallax";
import { Picture } from "../shared/components/Picture";
import { SmartVideo } from "../shared/components/SmartVideo";
import { useGsapContext } from "../shared/motion/hooks";
import { BRAND, MENU, STUDIO, mapsLink, whatsappLink } from "../shared/brand";
import { anchorHandler } from "../shared/ui";

const M = "/forno-nobile/media/premium";

/* ------------------------------- MATÉRIA ------------------------------- */
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
      scrollTrigger: { trigger: root, start: "top 70%" },
    });
  });

  return (
    <section className="chapter" id="materia" ref={ref}>
      <div className="wrap-tight">
        <p className="chapter__index">Capítulo 01 — Matéria</p>
        <h2 className="chapter__title" style={{ lineHeight: 1.06 }}>
          <span className="line-mask"><span data-line style={{ display: "block" }}>Farinha, água,</span></span>
          <span className="line-mask"><span data-line style={{ display: "block" }}>sal e fogo.</span></span>
          <span className="line-mask"><span data-line style={{ display: "block", color: "var(--color-cream-dim)" }}>O resto é tempo.</span></span>
        </h2>
        <p className="chapter__lead">
          Tudo o que vira uma pizza napolitana cabe em quatro palavras. A
          diferença está no que se faz com elas nas 48 horas seguintes.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- FOGO -------------------------------- */
export function Fogo() {
  return (
    <section className="fogo" id="fogo" aria-label="O forno">
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

        {/* A tipografia ATRAVESSA a banda — enquadramento próprio deste
            capítulo, diferente do hero (mídia à direita) e da montagem
            (banda centrada). Ver §23: nada de composição repetida. */}
        <div className="fogo__copy">
          <Reveal stagger={0.08}>
            <p className="chapter__index">Capítulo 02 — Fogo</p>
            <h2 className="fogo__title">
              90 segundos
              <br />
              que mudam tudo.
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
export function Produto() {
  return (
    <section className="chapter" id="produto">
      <div className="wrap macro">
        <Reveal className="macro__media" mask>
          <SmartVideo
            src={`${M}/videos/macro.mp4`}
            poster={`${M}/videos/macro-poster.jpg`}
            label="Close cinematográfico da pizza saindo do forno, com o queijo escorrendo e vapor"
            ratio="4 / 5"
          />
        </Reveal>
        <div>
          <p className="chapter__index">Capítulo 03 — Produto</p>
          <h2 className="chapter__title">Sai do forno e não espera.</h2>
          <p className="chapter__lead">
            Do balcão à mesa em poucos passos. A muçarela ainda se move, a borda
            ainda estala. É assim que ela deve chegar até você.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SABORES ------------------------------ */
export function Sabores() {
  return (
    <section className="chapter" id="sabores">
      <div className="wrap macro macro--flip">
        <Reveal className="macro__media" mask>
          <Picture
            base={`${M}/images/macro-2`}
            alt="Macro da pizza napolitana com calabresa, tomate confitado e manjericão, brilho do forno ao fundo"
            /* Sem 1920: os derivados -1920 do Premium são upscales de uma fonte
               de 1280 (ASSET-AUDIT.md). Oferecê-los no srcset faz o navegador
               baixar mais bytes para exibir a MESMA informação, mais mole. */
            widths={[768, 1280]}
            sizes="(min-width: 900px) 42vw, 92vw"
          />
        </Reveal>
        <div>
          <p className="chapter__index">Capítulo 04 — Sabores</p>
          <h2 className="chapter__title">Seis pizzas. Nada de enrolação.</h2>
          <ul className="m-menu">
            {MENU.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 0.03}>
                <span className="m-menu__name">{item.name}</span>
                <span className="m-menu__price">{item.price}</span>
              </Reveal>
            ))}
          </ul>
        </div>
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
      <div className="wrap-tight">
        <p className="chapter__index" data-fade>Capítulo 05 — Mesa</p>
        <h2 className="m-final__title" data-fade>
          A experiência termina numa cadeira, não numa tela.
        </h2>
        <p className="m-final__lead" data-fade>
          Salão pequeno, turno único, forno sempre aceso. Reserve com um dia de
          antecedência — sexta e sábado enchem.
        </p>
        <a className="btn" href={whatsappLink("Olá! Gostaria de reservar uma mesa na Forno Nobile.")} target="_blank" rel="noopener noreferrer" data-fade>
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
