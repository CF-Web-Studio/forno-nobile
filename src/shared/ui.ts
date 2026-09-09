import { useEffect, useState } from "react";
import { scrollToTarget } from "./motion/engine";

/** true depois de rolar mais que `threshold` px. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Trava o scroll do body enquanto `locked` for true (menu mobile aberto). */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = prevPad;
    };
  }, [locked]);
}

/** Fecha ao apertar Escape. */
export function useEscape(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}

/** Handler para links de âncora: previne o pulo e usa o scroll suave do engine. */
export function anchorHandler(
  hash: string,
  opts: { offset?: number; onDone?: () => void } = {},
) {
  return (e: React.MouseEvent) => {
    if (!hash.startsWith("#")) return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(hash, { offset: opts.offset ?? -72 });
    history.replaceState(null, "", hash);
    opts.onDone?.();
  };
}
