/**
 * QA automático — PÁGINA PREMIUM INTEIRA (Fase 4).
 * Implementa docs/v3/QA-MATRIX.md. Nada aqui declara DESIGN PASS.
 *
 * A partir da Fase 4 não existe mais "fora de escopo": toda a página é
 * avaliada e qualquer achado reprova. Nada de rebaixar FAIL para INFO.
 *
 *   node scripts/qa-premium.mjs            (assume preview em :4310)
 *   node scripts/qa-premium.mjs --url=...
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE =
  process.argv.find((a) => a.startsWith("--url="))?.slice(6) ??
  "http://localhost:4310/forno-nobile/premium/";

const OUT = path.resolve("qa-report/v3/premium");

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844, touch: true, dpr: 3 },
  { name: "430x932", width: 430, height: 932, touch: true, dpr: 3 },
  { name: "768x1024", width: 768, height: 1024, touch: true, dpr: 2 },
  { name: "1440x900", width: 1440, height: 900, touch: false, dpr: 2 },
  { name: "1920x1080", width: 1920, height: 1080, touch: false, dpr: 1 },
];

const SCROLL_STOPS = [0, 0.25, 0.5, 0.75, 1];

const results = [];
const fail = (vp, check, detail) =>
  results.push({ vp, check, status: "FAIL", detail });
const pass = (vp, check, detail = "") =>
  results.push({ vp, check, status: "PASS", detail });

/** Uma passada completa num viewport. */
async function run(browser, vp, { reducedMotion = false } = {}) {
  const label = reducedMotion ? `${vp.name}/reduced` : vp.name;

  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    hasTouch: vp.touch,
    isMobile: vp.touch,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const badResponses = [];

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`);
  });
  page.on("requestfailed", (r) => {
    // aborts de vídeo por preload=none não contam como falha de rede
    const f = r.failure()?.errorText ?? "";
    if (!/ERR_ABORTED/.test(f)) badResponses.push(`${f} ${r.url()}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1200); // deixa a intro orquestrada terminar

  /* ---------------------------------------------------------- console --- */
  if (consoleErrors.length) fail(label, "console", consoleErrors.join(" | "));
  else pass(label, "console", "0 erros");

  if (pageErrors.length) fail(label, "pageerror", pageErrors.join(" | "));
  else pass(label, "pageerror", "0 exceções");

  /* ---------------------------------------------------------- network --- */
  if (badResponses.length) fail(label, "network", badResponses.join(" | "));
  else pass(label, "network", "0 respostas >=400");

  /* ------------------------------------------------- overflow horizontal */
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) fail(label, "overflow-h", `${overflow}px`);
  else pass(label, "overflow-h", `${overflow}px`);

  /* --------------------------------------------------- sharpness (§53) --- */
  /** Varre nitidez. Só enxerga o que já carregou — por isso roda de novo
   *  DEPOIS do passe de scroll, quando o lazy-loading já resolveu. */
  const scanSharpness = () => page.evaluate((dpr) => {
    const found = [];
    const scan = (el, natural, name) => {
      const w = el.getBoundingClientRect().width;
      if (!w || !natural) return;
      if (w * dpr <= natural * 1.15) return;
      found.push(`${name} ${Math.round(w)}×${dpr} > ${natural}`);
    };
    // ATENÇÃO: `naturalWidth` NÃO é confiável aqui. O Chromium decodifica
    // imagens `loading="lazy"` em escala reduzida, e naturalWidth passa a
    // refletir o tamanho DECODIFICADO (~= o renderizado), não o intrínseco —
    // o que fazia a imagem ser comparada contra ela mesma e reprovar sempre.
    // Os derivados deste projeto carregam a largura real no nome (`-1280.webp`),
    // que é a fonte confiável. naturalWidth só entra como último recurso.
    for (const el of document.querySelectorAll("img")) {
      const src = (el.currentSrc || el.src).split("/").pop() ?? "";
      const fromName = src.match(/-(\d{3,4})\.(webp|jpe?g|png|avif)$/i);
      scan(el, fromName ? Number(fromName[1]) : el.naturalWidth, src);
    }
    for (const el of document.querySelectorAll("video"))
      scan(el, el.videoWidth, el.src.split("/").pop());
    return found;
  }, vp.dpr);

  /* ---------------------------------- contraste WCAG AA (prioridade 1) -- */
  const contrast = await page.evaluate(() => {
    const lum = (css) => {
      const [r, g, b] = css.match(/[\d.]+/g).slice(0, 3).map(Number);
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    /** Sobe a árvore até achar um fundo não-transparente. */
    const bgOf = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba?\([^)]*,\s*0\s*\)/.test(bg) && bg !== "transparent") return bg;
      }
      return "rgb(255, 255, 255)";
    };
    const out = [];
    const sel = "h1, h2, h3, h4, p, a, span, em, li, label, button";
    for (const el of document.querySelectorAll(sel)) {
      const txt = (el.textContent ?? "").trim();
      if (!txt || el.children.length) continue;
      const cs = getComputedStyle(el);
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700 || cs.fontWeight === "bold";
      // WCAG "large text": >=24px, ou >=18.66px em negrito → limiar 3.0
      const large = px >= 24 || (px >= 18.66 && bold);
      const need = large ? 3 : 4.5;
      const got = ratio(cs.color, bgOf(el));
      if (got < need)
        out.push(
          `"${txt.slice(0, 18)}" ${got.toFixed(2)}:1 < ${need} (${px.toFixed(1)}px${bold ? " bold" : ""})`,
        );
    }
    return out;
  });
  if (contrast.length) fail(label, "contraste-wcag", contrast.join(" | "));
  else pass(label, "contraste-wcag", "todo texto da página >= limiar AA");

  // O estado :hover tem fundo próprio e precisa passar igual — foi onde o bug
  // era pior (2.59:1). Só faz sentido onde hover existe de verdade.
  if (!vp.touch) {
    const hoverBad = [];
    for (const sel of [".hero-stage .motion-cta:first-of-type", ".hero-stage .btn-line"]) {
      const el = page.locator(sel).first();
      if (!(await el.count())) continue;
      await el.hover();
      await page.waitForTimeout(350); // deixa a transição terminar
      const r = await el.evaluate((node) => {
        const lum = (css) => {
          const [r, g, b] = css.match(/[\d.]+/g).slice(0, 3).map(Number);
          const f = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const cs = getComputedStyle(node);
        const [hi, lo] = [lum(cs.color), lum(cs.backgroundColor)].sort((x, y) => y - x);
        return {
          ratio: (hi + 0.05) / (lo + 0.05),
          txt: (node.textContent ?? "").trim().slice(0, 18),
        };
      });
      if (r.ratio < 4.5) hoverBad.push(`"${r.txt}" :hover ${r.ratio.toFixed(2)}:1 < 4.5`);
    }
    await page.mouse.move(0, 0);
    if (hoverBad.length) fail(label, "contraste-hover", hoverBad.join(" | "));
    else pass(label, "contraste-hover", "estados :hover >= 4.5:1");
  }

  /* ------------------------------------- sanidade da abertura (--ap) ---- */
  const apState = await page.evaluate(() => {
    const el = document.querySelector(".hero-aperture");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      ar: getComputedStyle(el).aspectRatio,
    };
  });
  if (!apState) fail(label, "aperture", ".hero-aperture ausente");
  else if (apState.h > vp.height * 1.5)
    fail(label, "aperture", `altura ${apState.h}px > 1.5×viewport (ar=${apState.ar})`);
  else pass(label, "aperture", `${apState.w}×${apState.h} ar=${apState.ar}`);

  /* ------------------------------------------------- mobile pin (§16) --- */
  if (vp.width <= 767) {
    // §16/§36: nenhuma seção pode prender a tela no mobile.
    const pins = await page.evaluate(() =>
      [...document.querySelectorAll(".pin-spacer")].map(
        (e) => e.firstElementChild?.className ?? "?",
      ),
    );
    const heroPins = pins;
    if (heroPins.length) fail(label, "mobile-pin", `${heroPins.length} pin no mobile (${pins.join(",")}) — deve ser 0`);
    else pass(label, "mobile-pin", "0 pin-spacer");
  }

  /* --------------------------------------- conteúdo completo (reduced) --- */
  if (reducedMotion) {
    const state = await page.evaluate(() => {
      const vis = (s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return {
          opacity: Number(cs.opacity),
          text: (el.textContent ?? "").trim().slice(0, 40),
        };
      };
      return {
        h1: vis("h1.hero-display"),
        body: vis(".hero-body"),
        cta: document.querySelectorAll(".motion-cta").length,
        cue: vis(".motion-cue"),
        lines: [...document.querySelectorAll(".hero-line")].map(
          (e) => getComputedStyle(e).transform,
        ),
      };
    });
    const hidden = [];
    if (!state.h1 || state.h1.opacity < 0.99) hidden.push("h1");
    if (!state.body || state.body.opacity < 0.99) hidden.push(".hero-body");
    if (state.cta !== 2) hidden.push(`.motion-cta=${state.cta}`);
    if (!state.cue) hidden.push(".motion-cue ausente");
    if (hidden.length) fail(label, "reduced-content", hidden.join(", "));
    else pass(label, "reduced-content", "headline, corpo, 2 CTAs e cue presentes");
  }

  /* ----------------------------------------------- touch vs pointer ----- */
  const ptr = await page.evaluate(() => ({
    fine: matchMedia("(pointer: fine)").matches,
    hover: matchMedia("(hover: hover)").matches,
  }));
  const expectFine = !vp.touch;
  if (ptr.fine === expectFine)
    pass(label, "pointer", `fine=${ptr.fine} hover=${ptr.hover}`);
  else fail(label, "pointer", `fine=${ptr.fine}, esperado ${expectFine}`);

  /* ------------------------------------------ scroll states + shots ----- */
  const dir = path.join(OUT, reducedMotion ? `${vp.name}-reduced` : vp.name);
  await mkdir(dir, { recursive: true });

  const settle = reducedMotion ? 250 : 900; // Lenis + scrub assentarem

  // (a) A TRANSIÇÃO DO HERO — o que o Gate P1 realmente julga.
  // Posições relativas à viewport: o pin do hero vai até +=110% (desktop),
  // +=70% (tablet) e não existe no mobile. 0→1.25vh cobre os três casos.
  for (const vh of [0, 0.25, 0.5, 0.75, 1.0, 1.25]) {
    await page.evaluate((v) => {
      window.scrollTo({ top: window.innerHeight * v, behavior: "instant" });
    }, vh);
    await page.waitForTimeout(settle);
    await page.screenshot({
      path: path.join(dir, `hero-${String(Math.round(vh * 100)).padStart(3, "0")}vh.png`),
    });
  }

  // (b) Estados de scroll da página inteira (§57) — contexto, não o gate.
  for (const pct of SCROLL_STOPS) {
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * p, behavior: "instant" });
    }, pct);
    await page.waitForTimeout(settle);
    await page.screenshot({
      path: path.join(dir, `page-${String(pct * 100).padStart(3, "0")}.png`),
    });
  }

  /* Nitidez medida AGORA: o passe de scroll acima já forçou o lazy-loading,
     então isto enxerga a página inteira, não só o que estava acima da dobra. */
  const soft = await scanSharpness();
  if (soft.length) fail(label, "sharpness", soft.join(" | "));
  else pass(label, "sharpness", "página inteira dentro do teto 1.15×");

  // overflow de novo no fim do scroll (pin/scrub podem introduzir)
  const overflowEnd = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflowEnd > 1) fail(label, "overflow-h-scrolled", `${overflowEnd}px`);
  else pass(label, "overflow-h-scrolled", `${overflowEnd}px`);

  await ctx.close();
}

/* -------------------------------------------------------------------------- */

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

for (const vp of VIEWPORTS) await run(browser, vp);
// reduced-motion: um móvel e um desktop bastam para o gate
await run(browser, VIEWPORTS[0], { reducedMotion: true });
await run(browser, VIEWPORTS[3], { reducedMotion: true });

await browser.close();

/* ------------------------------------------------------------- relatório */
const failed = results.filter((r) => r.status === "FAIL");
const info = results.filter((r) => r.status === "INFO");
const passed = results.filter((r) => r.status === "PASS");
const lines = results.map(
  (r) => `${r.status.padEnd(4)}  ${r.vp.padEnd(18)} ${r.check.padEnd(22)} ${r.detail}`,
);
const report = [
  "# QA automático — Página Premium (Fase 4)",
  `URL: ${BASE}`,
  `Data: ${new Date().toISOString()}`,
  "",
  "Nada aqui declara DESIGN PASS — ver docs/v3/HUMAN-APPROVAL.md.",
  "",
  ...lines,
  "",
  `TOTAL: ${results.length} checks · ${passed.length} PASS · ${failed.length} FAIL · ${info.length} INFO`,
].join("\n");

await writeFile(path.join(OUT, "QA-REPORT.txt"), report, "utf8");
console.log(report);
process.exit(failed.length ? 1 : 0);
