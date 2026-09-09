import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../shared/motion/engine";
import { dur, ease, stagger, dist } from "../shared/motion/tokens";
import { SmartVideo } from "../shared/components/SmartVideo";

const M = "/forno-nobile/media/premium";

/**
 * A MONTAGEM — "Sete começos, um só fim."
 *
 * Por que NÃO é um exploded view empilhado (ver docs/PENDING-ASSETS.md):
 * as 7 camadas foram geradas em sessões independentes e têm câmeras
 * incompatíveis — 01–03 em three-quarter (~36° de elevação), 04–07 em
 * top-down achatado. Compostas, nunca formam um objeto físico coerente;
 * foi exatamente isso que reprovou o V2.
 *
 * Cada still, porém, é excelente SOZINHO. Então nenhum frame divide a tela
 * com outro: os ingredientes passam um a um, como frames num visor, e o
 * clímax corta para a pizza REAL em vídeo. A montagem não é simulada —
 * é um match-cut. O produto final parece montado porque é.
 */
const INGREDIENTS = [
  {
    key: "01-massa",
    n: "01",
    name: "Massa de 48 horas",
    line: "Farinha, água, sal e tempo. O tempo é o único que não se compra.",
  },
  {
    key: "02-molho",
    n: "02",
    name: "San Marzano",
    line: "Tomate do sopé do Vesúvio, esmagado à mão. Cru até encontrar o forno.",
  },
  {
    key: "03-queijo",
    n: "03",
    name: "Fior di latte",
    line: "Escorrido na véspera. Molhado demais, encharca a massa; seco demais, não fila.",
  },
  {
    key: "04-pepperoni",
    n: "04",
    name: "Calabresa artesanal",
    line: "Curada trinta dias e fatiada fina, na medida de encaracolar no calor.",
  },
  {
    key: "05-tomate",
    n: "05",
    name: "Tomate-cereja confitado",
    line: "Duas horas em azeite morno, até a pele ceder sem se desfazer.",
  },
  {
    key: "06-manjericao",
    n: "06",
    name: "Manjericão fresco",
    line: "Entra depois do forno. O calor cozinha a folha e leva o perfume junto.",
  },
  {
    key: "07-temperos",
    n: "07",
    name: "Parmesão e pimenta",
    line: "Lascas, flocos, um fio de azeite cru. O último gesto antes da mesa.",
  },
] as const;

export function Assembly() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [reduced] = useState(() => prefersReducedMotion());
  /** índice do frame no ar — alimenta o aria-live e as marcas de progresso */
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    const qa = (s: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(s));

    /* ---------------------------------------------------------------------
     * DESKTOP / TABLET — o visor: um frame por vez, pinado e scrubado.
     * Um mecanismo só (o frame sobe e sai por cima), variação vem da copy.
     * ------------------------------------------------------------------- */
    const buildReel = (endPct: string) => {
      const frames = qa(".assembly__frame");
      const stage = q(".assembly__stage")!;

      gsap.set(frames, { autoAlpha: 0, yPercent: 8 });
      gsap.set(frames[0], { autoAlpha: 1, yPercent: 0 });
      gsap.set(q(".assembly__final"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: endPct,
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
        },
      });

      // 0.00 → 0.62: os sete ingredientes passam pelo visor.
      // É um CORTE, não um crossfade: o frame que sai some por completo antes
      // do próximo entrar. Sobrepor deixava dois textos legíveis ao mesmo tempo.
      const slice = 0.62 / INGREDIENTS.length;
      frames.forEach((el, i) => {
        const at = i * slice;
        if (i > 0) {
          tl.to(
            frames[i - 1],
            { autoAlpha: 0, yPercent: -6, duration: slice * 0.34, ease: ease.inOut },
            at,
          );
          tl.to(
            el,
            { autoAlpha: 1, yPercent: 0, duration: slice * 0.4, ease: ease.out },
            at + slice * 0.36,
          );
        }
        tl.call(() => setActive(i), [], at + slice * 0.36);
      });

      // 0.62 → 0.78: MATCH-CUT. O último frame abre e a pizza real toma o visor.
      // Reaproveita a linguagem de abertura do hero (clip-path) — mesmo motivo.
      tl.to(frames[frames.length - 1], { autoAlpha: 0, scale: 1.08, duration: 0.1, ease: ease.inOut }, 0.62);
      tl.fromTo(
        q(".assembly__final"),
        { autoAlpha: 0, clipPath: "inset(46% 0% 46% 0%)", scale: 1.06 },
        {
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 0.16,
          ease: ease.out,
        },
        0.62,
      );
      tl.call(() => setActive(INGREDIENTS.length), [], 0.63);
      tl.fromTo(
        q(".assembly__payoff"),
        { autoAlpha: 0, y: dist.rise },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: ease.out },
        0.74,
      );

      // 0.78 → 1.00: HOLD. O produto segura a tela antes do próximo capítulo.
      tl.to({}, { duration: 0.22 });
    };

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      buildReel("+=320%");
    });

    mm.add(
      "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        buildReel("+=260%");
      },
    );

    /* ---------------------------------------------------------------------
     * MOBILE — sem pin, sem scrub, sem tela congelada (§36).
     * Os ingredientes viram fluxo normal; cada um se revela ao entrar.
     * ------------------------------------------------------------------- */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      qa(".assembly__frame").forEach((el) => {
        gsap.set(el, { autoAlpha: 1 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
          animation: gsap.fromTo(
            el.querySelectorAll(".assembly__shot, .assembly__meta > *"),
            { opacity: 0, y: dist.rise },
            {
              opacity: 1,
              y: 0,
              duration: dur.base,
              ease: ease.out,
              stagger: stagger.item,
            },
          ),
        });
      });
      gsap.set(q(".assembly__final"), { autoAlpha: 1 });
      ScrollTrigger.create({
        trigger: q(".assembly__final")!,
        start: "top 85%",
        toggleActions: "play none none reverse",
        animation: gsap.fromTo(
          q(".assembly__payoff"),
          { opacity: 0, y: dist.rise },
          { opacity: 1, y: 0, duration: dur.base, ease: ease.out },
        ),
      });
    });

    /* ---------------------------- REDUCED MOTION -------------------------- */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(qa(".assembly__frame"), { autoAlpha: 1, yPercent: 0 });
      gsap.set([q(".assembly__final"), q(".assembly__payoff")], {
        autoAlpha: 1,
        clipPath: "none",
        y: 0,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="assembly" id="exploded" ref={rootRef} aria-labelledby="assembly-title">
      <div className="assembly__stage">
        <div className="assembly__intro">
          <span className="p-eyebrow">A montagem</span>
          <h2 id="assembly-title">Sete começos, um só fim.</h2>
        </div>

        <div className="assembly__viewport">
          {INGREDIENTS.map((ing) => (
            <figure className="assembly__frame" key={ing.key}>
              <img
                className="assembly__shot"
                src={`${M}/layers/${ing.key}.webp`}
                alt={ing.name}
                width={1254}
                height={1254}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <figcaption className="assembly__meta">
                <span className="assembly__n" aria-hidden="true">
                  {ing.n}
                </span>
                <h3 className="assembly__name">{ing.name}</h3>
                <p className="assembly__line">{ing.line}</p>
              </figcaption>
            </figure>
          ))}

          {/* O corte: o produto real. Não é composição — é a pizza. */}
          <div className="assembly__final">
            <SmartVideo
              src={`${M}/videos/macro.mp4`}
              poster={`${M}/videos/macro-poster.jpg`}
              label="A pizza napolitana montada, saindo do forno a lenha"
              fill
            />
            <p className="assembly__payoff">
              Noventa segundos de forno. <em>É só isso que falta.</em>
            </p>
          </div>
        </div>

        {/* Progresso: sete marcas + o produto. Redundante com a legenda, nunca sozinho. */}
        <ol className="assembly__ticks" aria-hidden="true">
          {INGREDIENTS.map((ing, i) => (
            <li key={ing.key} className={i === active ? "is-on" : undefined} />
          ))}
          <li className={active >= INGREDIENTS.length ? "is-on is-final" : "is-final"} />
        </ol>

        {!reduced && (
          <p className="assembly__live" aria-live="polite">
            {active < INGREDIENTS.length
              ? `${INGREDIENTS[active].n} — ${INGREDIENTS[active].name}`
              : "A pizza montada"}
          </p>
        )}
      </div>
    </section>
  );
}
