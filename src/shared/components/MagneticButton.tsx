import { type AnchorHTMLAttributes, type ReactNode, useRef } from "react";
import { useGsapContext } from "../motion/hooks";

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** força do imã em px (default 10) */
  strength?: number;
};

/**
 * CTA com atração magnética discreta ao ponteiro. A área clicável não se move
 * mais que `strength`. Sem imã em touch e sob prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  strength = 10,
  className,
  ...rest
}: MagneticButtonProps) {
  const inner = useRef<HTMLSpanElement | null>(null);

  const ref = useGsapContext(({ root, reduced, gsap }) => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = root as HTMLElement;
    const target = inner.current ?? el;
    const xTo = gsap.quickTo(target, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
      const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength;
      xTo(dx);
      yTo(dy);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <a ref={ref as never} className={className} {...rest}>
      <span ref={inner} style={{ display: "inline-flex", willChange: "transform" }}>
        {children}
      </span>
    </a>
  );
}
