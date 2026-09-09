import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../shared/motion/engine";
import { dur, ease, dist } from "../shared/motion/tokens";

const M = "/forno-nobile/media/premium";

/**
 * A MONTAGEM — convergência scrubada.
 *
 * Histórico do que NÃO funcionou, para não voltar:
 * 1. Empilhar os 7 PNGs de camada. Eles vêm de gerações independentes com
 *    câmeras incompatíveis (01–03 em three-quarter ~36°, 04–07 em top-down
 *    achatado). Composto, nunca formou um objeto físico — foi o que reprovou.
 * 2. Sequência de stills um a um. Honesta, mas fria: sete cartões em fila não
 *    é montagem, é catálogo.
 *
 * O que funciona: o vídeo `montagem.mp4` é UMA cena — uma câmera, uma luz —
 * em que a pizza se abre em camadas suspensas e volta a se fechar. Não há o
 * que compor. O scroll conduz o tempo do plano, então quem rola é quem monta
 * a pizza. O clímax é a pizza real, porque nunca deixou de ser.
 *
 * Linha do tempo do plano (medida no arquivo, 8 s):
 *   0.0–1.5  montada        1.5–2.8  separando
 *   2.8–4.8  suspensa       4.8–8.0  convergindo até fechar
 */

/** Legendas presas ao que está REALMENTE visível no plano, em fração do tempo. */
const BEATS = [
  { at: 0.0, n: "01", name: "Massa de 48 horas", line: "Farinha, água, sal e tempo. O tempo é o que não se compra." },
  { at: 0.34, n: "02", name: "Fior di latte", line: "Escorrido na véspera: molhado demais encharca, seco demais não fila." },
  { at: 0.52, n: "03", name: "Calabresa artesanal", line: "Curada trinta dias, fatiada fina o bastante para encaracolar no calor." },
  { at: 0.82, n: "04", name: "Fecha", line: "Tomate confitado, manjericão e parmesão entram depois do forno — o calor rouba o perfume." },
] as const;

export function Assembly() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced] = useState(() => prefersReducedMotion());
  const [beat, setBeat] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const mm = gsap.matchMedia();
    const q = (s: string) => root.querySelector<HTMLElement>(s);

    /** Progresso 0..1 → tempo do plano. O vídeo NUNCA toca sozinho aqui. */
    const seek = (p: number) => {
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const t = Math.min(d - 0.02, Math.max(0, p * d));
      if (Math.abs(video.currentTime - t) > 0.012) video.currentTime = t;
      let i = 0;
      for (let k = 0; k < BEATS.length; k++) if (p >= BEATS[k].at) i = k;
      setBeat((prev) => (prev === i ? prev : i));
    };

    /* -------------------------------------------------------------------
     * DESKTOP / TABLET — o scroll conduz o tempo do plano.
     * ----------------------------------------------------------------- */
    const scrub = (end: string) => {
      const stage = q(".assembly__stage")!;
      video.pause();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end,
          scrub: 0.6,
          pin: stage,
          anticipatePin: 1,
          onUpdate: (self) => seek(self.progress),
        },
      });
      // entrada da moldura: o plano não "aparece", ele abre
      tl.fromTo(
        q(".assembly__frame"),
        { clipPath: "inset(14% 6% 14% 6%)", scale: 0.98 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.14, ease: ease.out },
        0,
      );
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    };

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => scrub("+=300%"));
    mm.add(
      "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => scrub("+=240%"),
    );

    /* -------------------------------------------------------------------
     * MOBILE — sem pin e sem scrub. Buscar quadro a quadro trava em celular,
     * e uma seção presa é justamente o que §36 proíbe: aqui o plano roda uma
     * vez, sozinho, quando entra na tela.
     * ----------------------------------------------------------------- */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        onEnter: () => {
          void video.play().catch(() => {});
        },
        onLeaveBack: () => video.pause(),
      });
      const onTime = () => {
        const d = video.duration;
        if (!Number.isFinite(d) || d <= 0) return;
        const p = video.currentTime / d;
        let i = 0;
        for (let k = 0; k < BEATS.length; k++) if (p >= BEATS[k].at) i = k;
        setBeat((prev) => (prev === i ? prev : i));
      };
      video.addEventListener("timeupdate", onTime);
      gsap.fromTo(
        q(".assembly__frame"),
        { opacity: 0, y: dist.rise },
        {
          opacity: 1,
          y: 0,
          duration: dur.base,
          ease: ease.out,
          scrollTrigger: { trigger: root, start: "top 80%" },
        },
      );
      return () => {
        st.kill();
        video.removeEventListener("timeupdate", onTime);
      };
    });

    /* ------------------------------ REDUCED MOTION --------------------- */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // sem plano: o pôster já é a pizza montada, que é o desfecho da seção
      gsap.set(q(".assembly__frame"), { opacity: 1, y: 0, clipPath: "none" });
      setBeat(BEATS.length - 1);
    });

    return () => mm.revert();
  }, []);

  const current = BEATS[beat];

  return (
    <section className="assembly" id="exploded" ref={rootRef} aria-labelledby="assembly-title">
      <div className="assembly__stage">
        <div className="assembly__head">
          <span className="p-eyebrow">A montagem</span>
          <h2 id="assembly-title">Ela se abre para você ver por dentro.</h2>
        </div>

        {/* figure envolve plano + legenda: no desktop ficam lado a lado, no
            mobile a legenda volta para dentro da moldura. */}
        <figure className="assembly__body">
          <div className="assembly__frame">
            <video
              ref={videoRef}
              className="assembly__video"
              src={`${M}/videos/montagem.mp4`}
              poster={`${M}/videos/montagem-poster.jpg`}
              width={1280}
              height={720}
              muted
              playsInline
              preload="metadata"
              aria-label="A pizza napolitana se abre em camadas suspensas — massa, queijo e calabresa — e volta a se fechar, diante do forno a lenha"
            />
          </div>

          <figcaption className="assembly__caption">
            <span className="assembly__n" aria-hidden="true">{current.n}</span>
            <h3 className="assembly__name">{current.name}</h3>
            <p className="assembly__line">{current.line}</p>
          </figcaption>
        </figure>

        {!reduced && (
          <ol className="assembly__ticks" aria-hidden="true">
            {BEATS.map((b, i) => (
              <li key={b.n} className={i <= beat ? "is-on" : undefined} />
            ))}
          </ol>
        )}

        <p className="assembly__live" aria-live="polite">
          {`${current.n} — ${current.name}`}
        </p>
      </div>
    </section>
  );
}
