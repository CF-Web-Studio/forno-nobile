import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion/hooks";

type SmartVideoProps = {
  src: string;
  poster: string;
  className?: string;
  /** legenda acessível do conteúdo do vídeo */
  label: string;
  /** proporção p/ reservar espaço e evitar CLS, ex.: "16 / 9" */
  ratio?: string;
  /** começa a tocar só quando entra na viewport (default true) */
  playWhenVisible?: boolean;
  objectPosition?: string;
};

/**
 * Vídeo de produção: muted + playsInline + poster + preload=none.
 * Toca só quando visível; pausa fora da viewport e com a aba oculta.
 * Sob prefers-reduced-motion NÃO carrega o vídeo — mostra só o poster.
 */
export function SmartVideo({
  src,
  poster,
  className,
  label,
  ratio = "16 / 9",
  playWhenVisible = true,
  objectPosition = "center",
}: SmartVideoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced] = useState(() => prefersReducedMotion());
  const [active, setActive] = useState(!playWhenVisible);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap || !playWhenVisible) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = videoRef.current;
          if (e.isIntersecting) {
            setActive(true);
            v?.play().catch(() => undefined);
          } else {
            v?.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduced, playWhenVisible]);

  useEffect(() => {
    if (reduced) return;
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else if (active) v.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [reduced, active]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ aspectRatio: ratio, overflow: "hidden", position: "relative" }}
    >
      {reduced || !active ? (
        <img
          src={poster}
          alt={label}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
        />
      )}
    </div>
  );
}
