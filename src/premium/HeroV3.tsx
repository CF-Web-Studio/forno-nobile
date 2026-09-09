import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../shared/motion/engine";
import { dur, ease, stagger, dist } from "../shared/motion/tokens";
import { anchorHandler } from "../shared/ui";

const M = "/forno-nobile/media/premium";

const LINES = ["Da matéria-", "prima", "ao fogo."];

/** Proporções da abertura por setup (ver docs/v3/ART-DIRECTION.md) */
const AP = {
  desktop: { start: 4 / 5, end: 16 / 7 },
  tablet: { start: 3 / 4, end: 16 / 8 },
  mobile: { start: 16 / 10, end: 16 / 10 },
};

export function HeroV3() {
  const rootRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const [reduced] = useState(() => prefersReducedMotion());

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    const qa = (s: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(s));

    /* A razão da abertura é escrita SEMPRE via `--ap` (número puro).
       Escrever `aspect-ratio` pelo GSAP produz "1.6 / 9": ele mantém o
       denominador do valor CSS de origem. Proxy + onUpdate é determinístico. */
    const ap = { v: AP.desktop.start };
    const setAp = (v: number) => {
      ap.v = v;
      q(".hero-aperture")?.style.setProperty("--ap", String(v));
    };

    /* Largura da abertura (storyboard 0.28–0.60: cresce ancorada pela direita).
       O teto NÃO é estético: hero.mp4 tem 1280 de largura real e o gate de
       nitidez (§53) exige larguraCSS × DPR ≤ 1280 × 1.15. Em DPR 2 a faixa
       para em 736 px. É a "abertura contida" do ASSET-AUDIT.md. */
    const NAT_W = 1280;
    /** Pico de `scale` aplicado a .hero-media-scroll na fase SETTLE. */
    const MEDIA_SCALE_PEAK = 1.04;
    const apw = { v: 0 };
    const setApw = (v: number) => {
      apw.v = v;
      q(".hero-aperture")?.style.setProperty("--apw", `${v}px`);
    };
    /**
     * Largura inicial (coluna) e final (faixa).
     * O teto vale para o PIXEL QUE O USUÁRIO VÊ, não para a abertura: o vídeo
     * renderizado é (abertura + sangria do ponteiro) × scale do SETTLE. Medir a
     * sangria em vez de fixá-la mantém isto correto se o CSS mudar.
     */
    const bandWidth = (): { start: number; end: number } => {
      const el = q(".hero-aperture");
      const grid = q(".hero-grid");
      if (!el || !grid) return { start: 0, end: 0 };
      const start = el.getBoundingClientRect().width;

      const media = el.querySelector<HTMLElement>("video, img");
      const bleed = media ? Math.max(0, media.getBoundingClientRect().width - start) : 0;

      const ceiling = (NAT_W * 1.15) / Math.min(window.devicePixelRatio || 1, 3);
      const maxAperture = ceiling / MEDIA_SCALE_PEAK - bleed;

      const end = Math.max(start, Math.min(grid.getBoundingClientRect().width, maxAperture));
      return { start, end };
    };
    const clearApw = () => q(".hero-aperture")?.style.removeProperty("--apw");

    /* ---------------- entrada orquestrada (uma vez, não scrubada) --------------- */
    const intro = (apRatio: number) => {
      const tl = gsap.timeline();
      tl.fromTo(
        q(".hero-aperture"),
        { clipPath: "inset(50% 0% 50% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: dur.slow, ease: ease.out },
      )
        .fromTo(
          qa(".hero-line"),
          { yPercent: 105 },
          { yPercent: 0, duration: 0.8, ease: ease.out, stagger: stagger.line },
          0.15,
        )
        .fromTo(q(".hero-num"), { opacity: 0 }, { opacity: 1, duration: dur.base }, 0.55)
        .fromTo(
          qa("[data-intro]"),
          { opacity: 0, y: dist.rise },
          { opacity: 1, y: 0, duration: dur.base, ease: ease.out, stagger: stagger.item },
          0.7,
        );
      setAp(apRatio);
      return tl;
    };

    /* -------------------------- DESKTOP: pin + scrub --------------------------- */
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        intro(AP.desktop.start);

        const band = bandWidth();
        setApw(band.start);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=110%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // 0.10–0.28 SETTLE
        tl.to(q(".hero-media-scroll"), { y: -28, scale: 1.04, ease: ease.none }, 0.1);
        // 0.28–0.60 TRANSFORM — forma (retrato→faixa) e largura, ancorada à direita
        tl.to(
          ap,
          {
            v: AP.desktop.end,
            ease: ease.inOut,
            duration: 0.32,
            onUpdate: () => setAp(ap.v),
          },
          0.28,
        );
        tl.to(
          apw,
          {
            v: band.end,
            ease: ease.inOut,
            duration: 0.32,
            onUpdate: () => setApw(apw.v),
          },
          0.28,
        );
        tl.to(
          qa(".hero-line"),
          { yPercent: -105, ease: ease.inOut, duration: 0.26, stagger: 0.03 },
          0.28,
        );
        tl.to(q(".hero-aside"), { opacity: 0, ease: ease.none, duration: 0.18 }, 0.28);
        tl.to(q(".hero-heat"), { opacity: 1, ease: ease.none, duration: 0.32 }, 0.28);
        // 0.60–0.92 READ + HOLD (a faixa segura parada)
        tl.to({}, { duration: 0.32 });

        /* ponteiro — nós próprios, sem colidir com o scrub (docs/v3/MOTION-OWNERSHIP.md) */
        if (window.matchMedia("(pointer: fine)").matches) {
          const px = gsap.quickTo(pointerRef.current, "x", { duration: 0.6, ease: "power3" });
          const py = gsap.quickTo(pointerRef.current, "y", { duration: 0.6, ease: "power3" });
          const sx = gsap.quickTo(sweepRef.current, "x", { duration: 0.8, ease: "power3" });

          const onMove = (e: PointerEvent) => {
            const r = root.getBoundingClientRect();
            const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            px(-nx * 10);
            py(-ny * 10);
            sx(nx * 40);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => {
            window.removeEventListener("pointermove", onMove);
            clearApw(); // não vaza largura de desktop para outro breakpoint
          };
        }

        return () => clearApw();
      },
    );

    /* --------------------------- TABLET: pin curto ----------------------------- */
    mm.add(
      "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        intro(AP.tablet.start);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "+=70%", scrub: 1, pin: true },
        });
        tl.to(q(".hero-media-scroll"), { y: -18, scale: 1.03, ease: ease.none }, 0.1);
        tl.to(
          ap,
          {
            v: AP.tablet.end,
            ease: ease.inOut,
            duration: 0.34,
            onUpdate: () => setAp(ap.v),
          },
          0.26,
        );
        tl.to(qa(".hero-line"), { yPercent: -105, ease: ease.inOut, duration: 0.28 }, 0.26);
        tl.to(q(".hero-aside"), { opacity: 0, ease: ease.none, duration: 0.2 }, 0.26);
        tl.to(q(".hero-heat"), { opacity: 1, ease: ease.none, duration: 0.34 }, 0.26);
        tl.to({}, { duration: 0.28 });

        return () => clearApw();
      },
    );

    /* ------------- MOBILE: sem pin, sem scrub, zero scroll extra --------------- */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      intro(AP.mobile.start);
      // revelação curta ao entrar, e acabou. Não prende a tela.
      ScrollTrigger.create({
        trigger: q(".hero-aperture")!,
        start: "top 88%",
        toggleActions: "play none none reverse",
        animation: gsap.fromTo(
          q(".hero-media-scroll"),
          { scale: 1.06 },
          { scale: 1, duration: 0.7, ease: ease.out },
        ),
      });
      gsap.set(q(".hero-heat"), { opacity: 0.55 });
    });

    /* ----------------------------- REDUCED MOTION ------------------------------ */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q(".hero-aperture"), { clipPath: "inset(0%)" });
      setAp(window.innerWidth >= 1024 ? AP.desktop.start : AP.mobile.start);
      gsap.set(qa(".hero-line"), { yPercent: 0 });
      gsap.set([q(".hero-num"), ...qa("[data-intro]")], { opacity: 1, y: 0 });
      gsap.set(q(".hero-heat"), { opacity: 0.4 });
    });

    return () => {
      mm.revert();
      // custom properties são escritas por nós, não pelo GSAP — mm.revert() não as limpa
      const el = q(".hero-aperture");
      el?.style.removeProperty("--ap");
      el?.style.removeProperty("--apw");
    };
  }, []);

  return (
    <section className="hero-stage" id="topo" ref={rootRef}>
      <div className="hero-heat" aria-hidden="true" />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="hero-num" aria-hidden="true">01</span>

          <h1 className="hero-display">
            {LINES.map((l) => (
              <span className="hero-line-mask" key={l}>
                <span className="hero-line">{l}</span>
              </span>
            ))}
          </h1>

          <div className="hero-aside">
            <p className="hero-body" data-intro>
              Noventa segundos entre farinha e brasa. É o que separa uma massa
              crua de uma pizza napolitana.
            </p>

            <div className="hero-actions" data-intro>
              {/* .motion-cta: dono de `scale` é o CSS (docs/v3/MOTION-OWNERSHIP.md) */}
              <a
                className="motion-cta btn"
                href="#reservas"
                onClick={anchorHandler("#reservas")}
              >
                Reservar mesa
              </a>
              <a
                className="motion-cta btn btn-line"
                href="#materia"
                onClick={anchorHandler("#materia")}
              >
                Ver o forno
              </a>
            </div>
          </div>
        </div>

        <figure className="hero-aperture">
          <div className="hero-media-scroll">
            <div className="hero-media-pointer" ref={pointerRef}>
              {reduced ? (
                <img
                  className="hero-media-asset"
                  src={`${M}/videos/hero-poster.jpg`}
                  alt="Pizza napolitana sendo servida diante do forno a lenha"
                  width={1280}
                  height={720}
                />
              ) : (
                <video
                  className="hero-media-asset"
                  src={`${M}/videos/hero.mp4`}
                  poster={`${M}/videos/hero-poster.jpg`}
                  width={1280}
                  height={720}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  aria-label="Pizza napolitana sendo servida diante do forno a lenha"
                />
              )}
            </div>
          </div>
          <div className="hero-sweep" ref={sweepRef} aria-hidden="true" />
        </figure>
      </div>

      {/* .motion-cue: dono de `transform`/`opacity` é o CSS — @keyframes cue-pulse.
          Renderiza sempre; sob prefers-reduced-motion o CSS para o pulso e o
          indicador continua visível (a afordância de scroll não se perde). */}
      <div className="motion-cue" aria-hidden="true" />
    </section>
  );
}
