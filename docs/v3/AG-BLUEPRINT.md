# ANTIGRAVITY V1 - ART DIRECTION, MOTION & 3D BLUEPRINT

## 1. ART DIRECTION / VISUAL IDENTITY
- **Concept:** "DESIGNED, not GENERATED." The aesthetic must mimic top-tier creative development studios (e.g., Awwwards, FWA). Avoid generic AI templates, rounded glassmorphism, and neon-heavy gradients. 
- **Typography:** One high-quality font family with strong scale variations. Large typography acts as graphic elements. Tight leading on displays.
- **Color Palette (Premium):** Derived from the oven and raw materials. Not just black and orange. 
  - Void (deepest shadows)
  - Ash (warm dark grays)
  - Flour (off-white, mineral)
  - Crust (baked bread tones for light, not just accents)
  - Ember (deep, glowing red/orange for interactions)
  - Basil (cool contrast)
- **Composition:** Asymmetric balance. Negative space is intentional. Sharp edges for media (no border-radius) to emulate cinematic cuts.

## 2. NARRATIVE STRUCTURE (Premium)
1. **ORIGEM / HERO:** The genesis. "Da matéria-prima ao fogo." Dramatic camera cuts or dynamic scrubbed video revealing the aperture.
2. **MATÉRIA & MASSA:** The tactile transition. Revealing textures.
3. **INGREDIENTES & MONTAGEM (Exploded View):** 
   - *Issue with V2:* Looked like 7 flat images stacked. 
   - *AG Solution:* WebGL/Three.js compositing or 2.5D DOM with strict perspective correction to align the layers into a physically convincing pizza. The layers must merge perfectly at the end. 
4. **FOGO & PRODUTO:** The bake. Cinematic transition with heat distortion (WebGL shader).
5. **EXPERIÊNCIA, CARDÁPIO & RESERVA:** Clear, elegant presentation of the menu and call to actions.

## 3. MOTION & INTERACTION SYSTEM
- **Ownership Rule:** GSAP controls scroll-linked animations and complex timelines. Framer Motion controls React lifecycles and micro-interactions (hover, tap). Lenis handles smooth scroll.
- **Pacing:** One orchestrated moment per chapter. No repetitive fade-ups.
- **Pointer Interaction:** Subtle parallax on media. WebGL scenes react slightly to pointer position to keep the page feeling "alive" even when idle.
- **Reduced Motion:** Graceful fallback. Snap to end states, disable parallax and smooth scrolling.

## 4. 3D / WEBGL STRATEGY (Exploded View)
- The exploded view will use **Three.js / React Three Fiber**.
- We will map the 7 PNG layers onto separate 3D planes.
- **Camera:** Orthographic or carefully tuned Perspective to match the original lens.
- **Animation:** The scroll will drive the Y-axis separation, but also a slight Z-axis spread and rotation. At the end of the scroll trigger, the layers will snap into a mathematically perfect stack, forming the final pizza without visual seams.

## 5. FIRST MISSION (GATE P1)
- **Scope:** Implement the Premium Hero (V3-AG) and the First Transition.
- **Deliverables:** A fully functional React component for the Hero using GSAP ScrollTrigger for the aperture and Framer Motion for UI interactions.
- **Mobile First:** Mobile is not a squished desktop. The aperture will become landscape and slide under the text.
