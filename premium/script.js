// Forno Nobile — Premium
// Cena central em Three.js: matéria -> massa -> ingrediente -> fogo -> transformação -> pizza -> experiência.
// Um único ticker (rAF) alimenta pointer/scroll/touch para toda a cena. Sem loops paralelos.

import * as THREE from "./vendor/three.module.min.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmall = window.innerWidth < 760;

/* ---------- Header ---------- */
const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 40);
onScrollHeader();
window.addEventListener("scroll", onScrollHeader, { passive: true });
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  header.querySelectorAll(".nav-mobile a").forEach((a) => a.addEventListener("click", () => header.classList.remove("open")));
}

/* ---------- Reveal on scroll (regular sections) ---------- */
const revealEls = document.querySelectorAll("[data-reveal],[data-reveal-mask]");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- Reservation form -> WhatsApp ---------- */
const form = document.getElementById("reserva-form");
const WHATSAPP_NUMBER = "5511432101980";
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const linhas = [
      "Olá! Gostaria de reservar uma mesa na Forno Nobile.",
      `Nome: ${(data.get("nome") || "").toString().trim()}`,
      `Pessoas: ${(data.get("pessoas") || "").toString().trim()}`,
      `Data: ${(data.get("data") || "").toString().trim()}`,
      `Horário: ${(data.get("horario") || "").toString().trim()}`,
    ];
    const msg = (data.get("mensagem") || "").toString().trim();
    if (msg) linhas.push(`Observação: ${msg}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  });
}

/* ---------- Recipes ---------- */
const RECIPES = {
  margherita: { label: "Margherita", note: "Margherita — molho San Marzano, fior di latte, manjericão fresco.", sauce: 0xc2532c, cheese: 0xf3e9d3, toppings: [{ color: 0x5c6b3f, shape: "leaf" }] },
  diavola: { label: "Diavola", note: "Diavola — molho de tomate, muçarela, calabresa artesanal, pimenta biquinho.", sauce: 0xa4421f, cheese: 0xf3e9d3, toppings: [{ color: 0x7a2c14, shape: "disc" }] },
  prosciutto: { label: "Prosciutto e Funghi", note: "Prosciutto e Funghi — molho de tomate, muçarela, presunto parma, cogumelos.", sauce: 0xc2532c, cheese: 0xf3e9d3, toppings: [{ color: 0xe0a680, shape: "ribbon" }, { color: 0xd8c9a3, shape: "disc" }] },
  quattro: { label: "Quattro Formaggi", note: "Quattro Formaggi — muçarela, gorgonzola, parmesão, provolone, mel silvestre.", sauce: 0xead9a3, cheese: 0xf6ecce, toppings: [{ color: 0xcb9d43, shape: "disc" }] },
};
let currentRecipe = "margherita";

/* ---------- WebGL availability ---------- */
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) {
    return false;
  }
}

const canvas = document.getElementById("scene-canvas");
const stageWrap = document.getElementById("stage-wrap");
const fallback = document.getElementById("stage-fallback");

if (!hasWebGL() || !canvas) {
  if (fallback) fallback.hidden = false;
  if (canvas) canvas.remove();
} else {
  initScene();
}

function initScene() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.1, 8.5);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0x6b4a34, 0.9);
  scene.add(ambient);
  const key = new THREE.PointLight(0xffb066, 3.2, 30, 2);
  key.position.set(3, 4, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x7fb4d9, 1.1, 30, 2);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  /* Pizza group: dough, sauce, crust rim, toppings */
  const pizzaGroup = new THREE.Group();
  scene.add(pizzaGroup);

  const doughGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.14, 64);
  const doughMat = new THREE.MeshStandardMaterial({ color: 0xe7c88f, roughness: 0.85, metalness: 0.02 });
  const dough = new THREE.Mesh(doughGeo, doughMat);
  dough.position.y = 0;
  pizzaGroup.add(dough);

  const crustGeo = new THREE.TorusGeometry(2.5, 0.22, 20, 64);
  const crustMat = new THREE.MeshStandardMaterial({ color: 0xd8ab6b, roughness: 0.9 });
  const crust = new THREE.Mesh(crustGeo, crustMat);
  crust.rotation.x = Math.PI / 2;
  crust.position.y = 0.07;
  pizzaGroup.add(crust);

  const sauceGeo = new THREE.CylinderGeometry(2.15, 2.15, 0.05, 48);
  const sauceMat = new THREE.MeshStandardMaterial({ color: RECIPES[currentRecipe].sauce, roughness: 0.6 });
  const sauce = new THREE.Mesh(sauceGeo, sauceMat);
  sauce.position.y = 0.5;
  pizzaGroup.add(sauce);

  const cheeseGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.04, 48);
  const cheeseMat = new THREE.MeshStandardMaterial({ color: RECIPES[currentRecipe].cheese, roughness: 0.5 });
  const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheese.position.y = 1.0;
  pizzaGroup.add(cheese);

  const toppingsGroup = new THREE.Group();
  toppingsGroup.position.y = 1.5;
  pizzaGroup.add(toppingsGroup);

  function buildToppings(recipeKey) {
    while (toppingsGroup.children.length) toppingsGroup.remove(toppingsGroup.children[0]);
    const recipe = RECIPES[recipeKey];
    const count = isSmall ? 10 : 16;
    recipe.toppings.forEach((t, ti) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + ti * 0.4;
        const r = 0.6 + ((i * 37) % 100) / 100 * 1.3;
        let geo;
        if (t.shape === "leaf") geo = new THREE.SphereGeometry(0.11, 8, 8);
        else if (t.shape === "ribbon") geo = new THREE.BoxGeometry(0.28, 0.03, 0.14);
        else geo = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 10);
        const mat = new THREE.MeshStandardMaterial({ color: t.color, roughness: 0.7 });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        m.rotation.y = a;
        toppingsGroup.add(m);
      }
    });
  }
  buildToppings(currentRecipe);

  /* Particles: flour / embers, shared system, colour + count adapt per section */
  const PARTICLE_COUNT = isSmall ? 260 : 900;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 3 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = (Math.random() - 0.3) * 6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xf4ead6, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* Fullscreen ember-glow shader plane, used mainly during the "Fogo" section */
  const glowGeo = new THREE.PlaneGeometry(30, 20);
  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color(0xff7a30) } },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uOpacity;
      uniform vec3 uColor;
      void main(){
        float d = distance(vUv, vec2(0.5));
        float glow = smoothstep(0.55, 0.0, d);
        gl_FragColor = vec4(uColor, glow * uOpacity);
      }
    `,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.z = -6;
  scene.add(glow);

  /* ---------- Resize ---------- */
  function resize() {
    const w = stageWrap.clientWidth || window.innerWidth;
    const h = stageWrap.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  let resizeRaf = null;
  window.addEventListener("resize", () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  });

  /* ---------- Central input: pointer / touch / scroll ---------- */
  const input = { px: 0, py: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    input.tx = (e.clientX / window.innerWidth) * 2 - 1;
    input.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    input.tx = (t.clientX / window.innerWidth) * 2 - 1;
    input.ty = (t.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const blueprintOverlay = document.getElementById("blueprint-overlay");
  const panels = Array.from(document.querySelectorAll(".narrative-panel"));
  const PANEL_COUNT = panels.length;
  const narrative = document.querySelector(".narrative");
  const srStatus = document.getElementById("sr-status");
  let lastAnnounced = -1;

  function getScrollProgress() {
    const total = narrative.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    const p = (window.scrollY - narrative.offsetTop) / total;
    return Math.min(1, Math.max(0, p));
  }

  function smoothstep(a, b, x) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  /* ---------- Animation state machine driven by scroll progress (0..1 across PANEL_COUNT-1 segments) ---------- */
  let sceneVisible = true;
  let running = true;
  let clock = new THREE.Clock();

  function updateFromScroll(progress) {
    const seg = progress * (PANEL_COUNT - 1); // 0..6
    const panelIndex = Math.round(seg);
    if (panelIndex !== lastAnnounced && srStatus) {
      lastAnnounced = panelIndex;
      const titles = ["Matéria-prima", "Massa — desenho técnico", "Ingredientes", "Fogo", "Transformação", "Pizza montada", "Experiência completa"];
      srStatus.textContent = titles[panelIndex] || "";
    }

    // explode amount: 0 at panel1 (massa), 1 at panel2 (ingrediente), back to 0 by panel4 (transformação/pizza)
    const explode = smoothstep(0.9, 1.9, seg) - smoothstep(3.6, 4.6, seg);
    const explodeClamped = Math.max(0, Math.min(1, explode));
    sauce.position.y = 0.05 + explodeClamped * 0.9;
    cheese.position.y = 0.09 + explodeClamped * 1.55;
    toppingsGroup.position.y = 0.13 + explodeClamped * 2.15;

    // blueprint overlay: peaks through panel1 (massa), fades out entering panel2
    if (blueprintOverlay && !reduceMotion) {
      const bp = smoothstep(0.55, 1.15, seg) - smoothstep(1.55, 2.1, seg);
      blueprintOverlay.style.opacity = String(Math.max(0, Math.min(1, bp)) * 0.9);
    }

    // dough appears (scale) from panel0 -> panel1
    const doughIn = smoothstep(0.2, 1.0, seg);
    pizzaGroup.scale.setScalar(0.6 + doughIn * 0.4);

    // camera dolly: pull in during "fogo" (panel3), pull back for final "pizza"/"experiência"
    const fireT = smoothstep(2.5, 3.5, seg) - smoothstep(3.5, 4.3, seg);
    const heroT = smoothstep(4.6, 5.6, seg);
    camera.position.set(0, 2.1 - heroT * 0.4, 8.5 - Math.max(0, fireT) * 2.4 - heroT * 0.6);
    camera.lookAt(0, 0.6, 0);

    // fire glow intensity peaks at panel3
    const fireGlow = Math.max(0, smoothstep(2.4, 3.2, seg) - smoothstep(3.6, 4.4, seg));
    glowMat.uniforms.uOpacity.value = fireGlow * 0.85;
    key.intensity = 2.4 + fireGlow * 3.2;
    key.color.setHex(fireGlow > 0.3 ? 0xff7a30 : 0xffb066);

    // particles: flour-like drift early, embers glow near fire section
    particleMat.opacity = 0.5 - smoothstep(1.2, 2.2, seg) * 0.25 + fireGlow * 0.35;
    particleMat.color.setHex(fireGlow > 0.3 ? 0xff9a4d : 0xf4ead6);

    // final hold: gentle continuous rotation only, everything else settled
    pizzaGroup.userData.baseRotationSpeed = 0.06 + heroT * 0.05;
  }

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    if (!sceneVisible) return;
    const dt = clock.getDelta();

    input.px += (input.tx - input.px) * 0.06;
    input.py += (input.ty - input.py) * 0.06;

    updateFromScroll(getScrollProgress());

    pizzaGroup.rotation.y += (pizzaGroup.userData.baseRotationSpeed || 0.06) * dt;
    if (!reduceMotion) {
      pizzaGroup.rotation.x = input.py * 0.12;
      pizzaGroup.rotation.z = -input.px * 0.1;
      camera.position.x += (input.px * 0.6 - (camera.position.x - 0)) * 0.04;
    }
    particles.rotation.y += 0.01 * dt;
    key.position.x = 3 + input.px * 1.2;
    key.position.y = 4 + input.py * 0.6;

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    // Render a single settled frame; no loop.
    updateFromScroll(0.85);
    pizzaGroup.rotation.y = 0.4;
    renderer.render(scene, camera);
  } else {
    tick();
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => { sceneVisible = entries[0].isIntersecting; }).observe(stageWrap);
  }
  document.addEventListener("visibilitychange", () => { sceneVisible = sceneVisible && !document.hidden; });

  /* ---------- Ingredient picker ---------- */
  const chips = document.querySelectorAll(".ingredient-chip");
  const note = document.getElementById("ingredient-note");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.getAttribute("data-recipe");
      if (!RECIPES[key]) return;
      currentRecipe = key;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      if (note) note.textContent = RECIPES[key].note;
      sauceMat.color.setHex(RECIPES[key].sauce);
      cheeseMat.color.setHex(RECIPES[key].cheese);
      buildToppings(key);
      if (reduceMotion) renderer.render(scene, camera);
    });
  });

  /* ---------- Static 3D stills (independent, one render each, no loop) ---------- */
  function renderStill(canvasEl, mode) {
    const w = canvasEl.clientWidth || 400;
    const h = canvasEl.clientHeight || 260;
    const r = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    r.setSize(w, h, false);
    r.outputColorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Scene();
    const c = new THREE.PerspectiveCamera(35, w / h, 0.1, 50);
    const l1 = new THREE.PointLight(0xffb066, 3, 20);
    const amb = new THREE.AmbientLight(0x503826, 1.1);
    s.add(amb);

    if (mode === "crust") {
      c.position.set(3.2, 1.1, 2.6);
      l1.position.set(2, 3, 3);
      const g = new THREE.TorusGeometry(2.4, 0.28, 20, 48, Math.PI * 0.9);
      const m = new THREE.MeshStandardMaterial({ color: 0xd8ab6b, roughness: 0.85 });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = Math.PI / 2.4;
      s.add(mesh);
    } else if (mode === "top") {
      c.position.set(0, 5.2, 0.01);
      l1.position.set(1, 4, 2);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.15, 48), new THREE.MeshStandardMaterial({ color: 0xc2532c, roughness: 0.7 }));
      s.add(base);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), new THREE.MeshStandardMaterial({ color: 0x5c6b3f }));
        m.position.set(Math.cos(a) * 1.3, 0.1, Math.sin(a) * 1.3);
        s.add(m);
      }
    } else {
      c.position.set(0, 0.6, 4.5);
      l1.position.set(2, 2, 2);
      l1.color.setHex(0xff7a30);
      l1.intensity = 5;
      const g = new THREE.SphereGeometry(1.6, 24, 24);
      const m = new THREE.MeshStandardMaterial({ color: 0x2e1a0f, roughness: 1, emissive: 0x7a2c14, emissiveIntensity: 0.6 });
      s.add(new THREE.Mesh(g, m));
    }
    s.add(l1);
    c.lookAt(0, 0, 0);
    r.render(s, c);
  }

  document.querySelectorAll(".still-canvas").forEach((el) => {
    if ("IntersectionObserver" in window) {
      const once = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          renderStill(el, el.getAttribute("data-still"));
          once.disconnect();
        }
      }, { threshold: 0.2 });
      once.observe(el);
    } else {
      renderStill(el, el.getAttribute("data-still"));
    }
  });
}
