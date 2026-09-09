import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  startScroll,
  stopScroll,
} from "./engine";

/** Liga o scroll suave enquanto a página estiver montada. Um por página. */
export function useSmoothScroll(): void {
  useEffect(() => {
    startScroll();
    return () => stopScroll();
  }, []);
}

/** Executa `setup` dentro de um gsap.context com cleanup automático.
 *  `setup` recebe o elemento raiz e a flag de reduced-motion. */
export function useGsapContext(
  setup: (ctx: {
    root: HTMLElement;
    reduced: boolean;
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
  }) => void,
  deps: React.DependencyList = [],
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      setup({ root, reduced, gsap, ScrollTrigger });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** true quando o elemento entra na viewport (uma vez). */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: "0px 0px -12% 0px" },
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

export { prefersReducedMotion };
