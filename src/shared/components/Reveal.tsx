import { type CSSProperties, type ElementType, type ReactNode } from "react";
import { useGsapContext } from "../motion/hooks";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** deslocamento vertical inicial em px (default 24) */
  y?: number;
  /** atraso em s */
  delay?: number;
  /** duração em s (default 0.7) */
  duration?: number;
  /** stagger entre filhos diretos; se >0 anima os filhos, não o container */
  stagger?: number;
  /** máscara (clip-path) em vez de fade+slide — aplicada no PRÓPRIO wrapper */
  mask?: boolean;
  start?: string;
};

/**
 * Revela conteúdo ao entrar na viewport. Movimento tem função: orienta o olho
 * para o próximo bloco de leitura. Sem JS, o conteúdo aparece normalmente.
 * Sob prefers-reduced-motion, aparece sem deslocamento.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  style,
  y = 24,
  delay = 0,
  duration = 0.7,
  stagger = 0,
  mask = false,
  start = "top 85%",
}: RevealProps) {
  const ref = useGsapContext(({ root, reduced, gsap }) => {
    const targets =
      stagger > 0 ? Array.from(root.children) : [root];
    if (targets.length === 0) return;

    if (reduced) {
      gsap.set(targets, { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    if (mask) {
      gsap.set(root, { clipPath: "inset(0 0 100% 0)" });
      gsap.to(root, {
        clipPath: "inset(0 0 0% 0)",
        duration: Math.max(duration, 0.8),
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start },
      });
      return;
    }

    gsap.set(targets, { opacity: 0, y });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power2.out",
      scrollTrigger: { trigger: root, start },
    });
  });

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
