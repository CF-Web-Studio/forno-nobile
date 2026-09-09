/**
 * Tokens de movimento — uma linguagem só, dois consumidores (GSAP e Motion).
 * Ver docs/v3/MOTION-SPEC.md
 */

export const dur = {
  micro: 0.28,
  base: 0.6,
  slow: 0.9,
} as const;

/** Curvas para GSAP (strings) */
export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  none: "none",
} as const;

/** As mesmas curvas para Motion (bézier) */
export const easeBezier = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const stagger = {
  line: 0.09,
  item: 0.06,
} as const;

export const dist = {
  rise: 12,
} as const;

export const spring = {
  cta: { type: "spring", stiffness: 400, damping: 28 } as const,
  cue: { type: "spring", stiffness: 220, damping: 22 } as const,
};
