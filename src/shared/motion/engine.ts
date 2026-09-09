// Arquitetura ÚNICA de motion para todos os tiers do Forno Nobile.
// Um só loop: o gsap.ticker conduz o Lenis. ScrollTrigger é atualizado pelo Lenis.
// Nada de RAF paralelo em componente nenhum.

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Inicializa o scroll suave. Sob prefers-reduced-motion, não instancia Lenis
 *  (scroll nativo) — ScrollTrigger continua a ouvir o scroll nativo. */
export function startScroll(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  if (prefersReducedMotion()) {
    ScrollTrigger.refresh();
    return null;
  }

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.15,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();
  return lenis;
}

export function stopScroll(): void {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Rola até um elemento (âncora), com Lenis quando ativo, senão nativo. */
export function scrollToTarget(
  target: string | HTMLElement,
  opts: { offset?: number } = {},
): void {
  const offset = opts.offset ?? 0;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export { gsap, ScrollTrigger };
