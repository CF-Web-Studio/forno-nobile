import { type CSSProperties } from "react";

type PictureProps = {
  /** caminho base sem sufixo de largura nem extensão, ex.: "/forno-nobile/... /hero" */
  base: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  objectPosition?: string;
  /** extensão dos derivados (default webp) e do fallback (default jpg) */
  ext?: string;
  fallbackExt?: string;
};

/**
 * <img> responsiva. Espera derivados nomeados `${base}-${w}.${ext}` gerados na
 * preparação de assets. `priority` marca o LCP (sem lazy, fetchpriority=high).
 */
export function Picture({
  base,
  alt,
  widths = [640, 1024, 1600, 1920],
  sizes = "100vw",
  className,
  style,
  priority = false,
  objectPosition = "center",
  ext = "webp",
  fallbackExt = "jpg",
}: PictureProps) {
  const srcSet = widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  const fallbackSrcSet = widths
    .map((w) => `${base}-${w}.${fallbackExt} ${w}w`)
    .join(", ");
  const largest = widths[widths.length - 1];

  return (
    <picture style={{ display: "contents" }}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`${base}-${largest}.${fallbackExt}`}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        // @ts-expect-error fetchpriority é válido no DOM
        fetchpriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        style={{ objectPosition, ...style }}
      />
    </picture>
  );
}
