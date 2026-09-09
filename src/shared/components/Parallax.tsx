import { type ReactNode } from "react";
import { useGsapContext } from "../motion/hooks";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** deslocamento total em px ao longo da travessia (default 80). Negativo = sobe. */
  distance?: number;
  /** plano: foreground move mais, background move menos */
  depth?: "foreground" | "midground" | "background";
  scale?: [number, number];
};

const DEPTH_FACTOR = { foreground: 1, midground: 0.55, background: 0.28 } as const;

/** Parallax por profundidade — cada plano tem amplitude própria (nunca o mesmo
 *  translateY em tudo). Desligado sob prefers-reduced-motion. */
export function Parallax({
  children,
  className,
  distance = 80,
  depth = "midground",
  scale,
}: ParallaxProps) {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    const move = distance * DEPTH_FACTOR[depth];
    const tween: gsap.TweenVars = {
      yPercent: 0,
      y: -move,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    };
    gsap.fromTo(root, { y: move * 0.25 }, tween);
    if (scale) {
      gsap.fromTo(
        root,
        { scale: scale[0] },
        {
          scale: scale[1],
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }
  });

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
