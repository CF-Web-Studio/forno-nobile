import { useRef, useState } from "react";
import { useGsapContext, prefersReducedMotion } from "../shared/motion/hooks";

const M = "/forno-nobile/media/premium";

/**
 * Camadas da base para o topo. `spread` = deslocamento Y no estado explodido
 * (px em telas grandes). `rx` = leve rotação X para dar corpo. `scale` no estado
 * explodido. `settle` = pequeno empilhamento no estado montado.
 * Ordem de chegada (§33): temperos → manjericão → tomate/pepperoni → queijo → molho → massa.
 */
const LAYERS = [
  { key: "01-massa", label: "Massa de 48 h", spread: 150, rx: 12, scale: 1.0, settle: 0, arrive: 6 },
  { key: "02-molho", label: "Molho de tomate San Marzano", spread: 70, rx: 10, scale: 0.98, settle: -8, arrive: 5 },
  { key: "03-queijo", label: "Fior di latte", spread: -30, rx: 6, scale: 0.97, settle: -16, arrive: 4 },
  { key: "04-pepperoni", label: "Calabresa artesanal", spread: -140, rx: 2, scale: 0.9, settle: -24, arrive: 3 },
  { key: "05-tomate", label: "Tomate-cereja confitado", spread: -240, rx: 0, scale: 0.86, settle: -30, arrive: 2 },
  { key: "06-manjericao", label: "Manjericão fresco", spread: -335, rx: -2, scale: 0.82, settle: -36, arrive: 1 },
  { key: "07-temperos", label: "Parmesão, pimenta, azeite", spread: -430, rx: -4, scale: 0.8, settle: -42, arrive: 0 },
] as const;

export function Exploded() {
  const reduced = prefersReducedMotion();
  const [caption, setCaption] = useState(LAYERS.length - 1);
  const pizzaRef = useRef<HTMLDivElement | null>(null);

  const ref = useGsapContext(({ root, reduced: rm, gsap }) => {
    if (rm) return;

    const mobile = window.matchMedia("(max-width: 780px)").matches;
    const spreadK = mobile ? 0.6 : 1;
    const stage = root.querySelector<HTMLElement>(".exploded__stage")!;
    const pizza = pizzaRef.current!;
    const layerEls = Array.from(root.querySelectorAll<HTMLElement>(".exploded__layer"));

    // estado inicial: explodido
    layerEls.forEach((el, i) => {
      const L = LAYERS[i];
      gsap.set(el, {
        yPercent: -50,
        xPercent: -50,
        y: L.spread * spreadK,
        rotateX: L.rx,
        scale: L.scale,
        opacity: L.key === "01-massa" ? 1 : 0.92,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: mobile ? "+=170%" : "+=240%",
        scrub: 1,
        pin: stage,
        anticipatePin: 1,
      },
    });

    // chega na ordem de `arrive` (0 = primeiro). Distribui a montagem em 0 → 0.72.
    const order = [...LAYERS.keys()].sort((a, b) => LAYERS[a].arrive - LAYERS[b].arrive);
    order.forEach((li, step) => {
      const el = layerEls[li];
      const L = LAYERS[li];
      const at = (step / order.length) * 0.72;
      tl.to(
        el,
        {
          y: L.settle,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 0.72 / order.length,
          ease: "power2.inOut",
          onStart: () => setCaption(li),
          onReverseComplete: () => setCaption(li),
        },
        at,
      );
    });

    // some com o texto de intro assim que a montagem começa (evita sobreposição)
    const intro = root.querySelector<HTMLElement>(".exploded__intro");
    if (intro) tl.to(intro, { opacity: 0, y: -24, duration: 0.12 }, 0.04);

    // segura a pizza montada parada por ~28% do scroll restante
    tl.to({}, { duration: 0.28 });

    // brilho/glow do prato ao montar
    const glow = root.querySelector<HTMLElement>(".exploded__glow");
    if (glow) tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55);

    // ---- pointer: inclina o conjunto sem quebrar o alinhamento das camadas ----
    if (!mobile && window.matchMedia("(pointer: fine)").matches) {
      const rxTo = gsap.quickTo(pizza, "rotationX", { duration: 0.6, ease: "power3" });
      const ryTo = gsap.quickTo(pizza, "rotationY", { duration: 0.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        ryTo(nx * 7);
        rxTo(-ny * 5);
      };
      const onLeave = () => {
        rxTo(0);
        ryTo(0);
      };
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    }
  });

  return (
    <section className="exploded" id="exploded" ref={ref} aria-label="Montagem da pizza">
      <div className="exploded__stage">
        <div className="exploded__intro">
          <span className="p-eyebrow">A montagem</span>
          <h2>Sete camadas, na ordem certa.</h2>
          <p className="exploded__hint">Role para montar</p>
        </div>

        {reduced ? (
          <img
            className="exploded__static"
            src={`${M}/images/exploded-poster-1280.webp`}
            alt="Os sete componentes da pizza napolitana da Forno Nobile flutuando em camadas: massa, molho, queijo, tomate, calabresa, manjericão e temperos"
          />
        ) : (
          <>
            <div className="exploded__glow" aria-hidden="true" />
            <div className="exploded__pizza" ref={pizzaRef}>
              {LAYERS.map((L) => (
                <img
                  key={L.key}
                  className="exploded__layer"
                  src={`${M}/layers/${L.key}.webp`}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
              ))}
            </div>
            <p className="exploded__caption" aria-live="polite">
              {LAYERS[caption].label}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
