/**
 * Card-Motion Molecule
 *
 * Encapsulates the scroll-driven animation variants for project cards:
 *
 *   clip       (base) — Scrubbed height collapse on the figure + natural body rise.
 *                       The image is absolutely positioned at its initial dimensions so
 *                       it never scales as the figure shrinks. The card genuinely loses
 *                       height as it exits the viewport.
 *
 *   fade       (md)   — Single-play fade+lift on scroll enter.
 *                       Simpler pattern suited for mid-range breakpoints.
 *
 *   motionpath (md+)  — Curved viewport-relative trajectory with mid-path pin.
 *                       Phase 1: article arcs in from bottom-left to viewport center.
 *                       Phase 2: article pins; figure/body play a parallax separation.
 *                       Phase 3: article arcs from center toward top-left and exits.
 *
 * The returned object exposes kill() to destroy the internal timeline and its
 * ScrollTrigger. Card.js calls this on breakpoint/reduced-motion transitions.
 *
 * @example
 * const clip = createCardScrollClip({ figure, body, index: 2, triggerEl: root });
 * // on destroy / breakpoint change:
 * clip.kill();
 *
 * const fade = createCardScrollFade({ figure, triggerEl: root });
 * fade.kill();
 *
 * const mp = createCardMotionPath({ article: root, figure, body, triggerEl: root });
 * mp.kill();
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
} from "../config/index/index.js";

/**
 * Creates the scrubbed height-collapse + image clip-path variant.
 *
 * The image is absolutely positioned at its initial pixel height so h-full
 * never rescales it as the figure collapses. clip-path on the image provides
 * a GPU-composited mask that hides the bottom in sync with the figure's height
 * tween, preventing any sub-pixel paint artifacts during the scrub.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardScrollClip({ figure, body, index = 0, triggerEl }) {
  const image = figure.querySelector('[data-card-el="image"]');
  const initialHeight = figure.offsetHeight;

  figure.style.willChange = "height";
  gsap.set(figure, { overflow: "hidden" });
  gsap.set(image, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: initialHeight,
    clipPath: "inset(0 0 0% 0)",
    willChange: "clip-path",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_CLIP_TRIGGER,
      id: `${CARD_FIGURE_CLIP_TRIGGER.id}-${index}`,
      trigger: triggerEl,
      end: () => `+=${window.innerHeight}`,
      invalidateOnRefresh: true,
    },
  });

  tl.to(figure, { height: 0, ease: "none" }, 0);
  tl.to(image, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
      gsap.set(image, { clearProps: "all" });
      gsap.set(figure, { clearProps: "height,overflow" });
    },
  };
}

/**
 * Creates the single-play fade+lift variant for mid-range breakpoints.
 *
 * @param {{
 *   figure: Element,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardScrollFade({ figure, triggerEl }) {
  figure.style.willChange = "opacity, transform";
  gsap.set(figure, { autoAlpha: 0, y: 16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 75%",
      once: true,
    },
  });

  tl.to(figure, {
    autoAlpha: 1,
    y: 0,
    duration: 0.48,
    ease: "power2.out",
  });

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
    },
  };
}

/**
 * Creates the scroll-scrubbed parallax variant for md+ breakpoints.
 *
 * Figure moves upward and body drifts downward as the card scrolls through
 * the viewport, creating a depth separation between the image and text layers.
 * Both elements are GPU-promoted via willChange.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardParallax({ figure, body, index = 0, triggerEl }) {
  figure.style.willChange = "transform";
  body.style.willChange = "transform";

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_PARALLAX_TRIGGER,
      id: `${CARD_FIGURE_PARALLAX_TRIGGER.id}-${index}`,
      trigger: triggerEl,
    },
  });

  tl.fromTo(figure, { yPercent: 0 }, { yPercent: 0, ease: "none" }, 0);
  tl.fromTo(body, { yPercent: 0 }, { yPercent: -25, ease: "none" }, 0);

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
      body.style.willChange = "";
    },
  };
}

// Cubic bezier control points for the card's curved viewport trajectory.
// viewBox is 0 0 100 100, so 1 unit = 1vw/1vh (preserveAspectRatio: none).
//
//   Start  (41.667, 95) — bottom entry,  1/12 vw from left (100/12 vw left of center)
//   CP1    (52.778, 70) — pulls arc rightward through lower half
//   CP2    (52.778, 30) — pulls arc rightward through upper half
//   End    (41.667,  5) — top exit,      1/12 vw from left
//
// At t=0.5: x = (1/8)(41.667) + (3/8)(52.778) + (3/8)(52.778) + (1/8)(41.667) = 50.0
// i.e. the card is exactly centered at the vertical midpoint of the viewport.
// At t=0.5: dx=0, so rotation=0 — the card is upright. This is the natural pin point.
const MOTION_PATH_D = "M 41.667 100 C 52.778 70 52.778 30 41.667 0";
const MOTION_PATH_GUIDE_ATTR = "data-card-path-guide";
const MOTION_PATH_ID = "card-motion-path";
// ENTRY_X_FRACTION (1/12): horizontal offset as a fraction of vw at entry and exit.
// CP_X_FRACTION (1/36):    control-point offset as a fraction of vw (pulls arc inward).
const ENTRY_X_FRACTION = 1 / 12;
const CP_X_FRACTION = 1 / 36;
// +90 aligns the article's natural upright axis with the path tangent direction.
const ROTATION_OFFSET = 90;

function getOrCreatePathGuide() {
  const existing = document.querySelector(`[${MOTION_PATH_GUIDE_ATTR}]`);
  if (existing) return existing;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute(MOTION_PATH_GUIDE_ATTR, "");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute(
    "style",
    [
      "position:fixed",
      "inset:0",
      "width:100vw",
      "height:100vh",
      "pointer-events:none",
      "z-index:9999",
      "opacity:0.75",
      "overflow:visible",
    ].join(";"),
  );

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("id", MOTION_PATH_ID);
  path.setAttribute("d", MOTION_PATH_D);
  path.setAttribute("stroke", "#ff4db2");
  path.setAttribute("stroke-width", "0.4");
  path.setAttribute("stroke-dasharray", "1.5 1");
  path.setAttribute("fill", "none");
  svg.appendChild(path);

  // Control point handles for visual reference
  [
    [52.778, 70],
    [52.778, 30],
  ].forEach(([cx, cy]) => {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "0.8");
    circle.setAttribute("fill", "#ff4db2");
    svg.appendChild(circle);
  });

  document.body.appendChild(svg);
  return svg;
}

/**
 * Scroll-scrubbed MotionPath variant for the curved card trajectory.
 *
 * Three-phase animation:
 *   Phase 1 — path entry: article arcs in from bottom-left to horizontal center (t 0→0.5).
 *   Phase 2 — pin: article pins at viewport center; figure/body play a parallax separation.
 *   Phase 3 — path exit: article arcs from horizontal center toward top-left (t 0.5→1).
 *
 * Vertical motion throughout is provided by natural scroll; only the x offset and
 * rotation are animated. At t=0.5 dx=0, so rotation=0 — the article is perfectly
 * upright when it pins. Control points are computed once (buildPoints) and refreshed
 * on resize via ScrollTrigger's onRefresh.
 *
 * The guide SVG is a singleton — all instances share the same element and
 * recreate it via getOrCreatePathGuide() if a prior kill() removed it.
 *
 * @param {{
 *   article: Element,
 *   figure?: Element,
 *   body?: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ pathEl: SVGSVGElement, timelines: gsap.core.Timeline[], kill(): void }}
 */
function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
}

function cubicDerivative(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}

export function createCardMotionPath({
  article,
  figure,
  body,
  index = 0,
  triggerEl,
} = {}) {
  const pathEl = getOrCreatePathGuide();

  article.style.willChange = "transform";
  if (figure) figure.style.willChange = "transform";
  if (body) body.style.willChange = "transform";

  const setX = gsap.quickSetter(article, "x", "px");
  const setRotation = gsap.quickSetter(article, "rotation", "deg");

  // Control points in pixels — recomputed on resize via buildPoints().
  // x: expressed relative to the card's natural centered position (see ENTRY_X_FRACTION).
  // guideY: path y-coordinates converted to pixels, used only for tangent/rotation math.
  let x0, x1, x2, x3, guideY0, guideY1, guideY2, guideY3;

  function buildPoints() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    x0 = -(vw * ENTRY_X_FRACTION);
    x1 = vw * CP_X_FRACTION;
    x2 = vw * CP_X_FRACTION;
    x3 = -(vw * ENTRY_X_FRACTION);
    guideY0 = vh;
    guideY1 = vh * 0.7;
    guideY2 = vh * 0.3;
    guideY3 = 0;

    if (body) {
      const ar = article.getBoundingClientRect();
      const br = body.getBoundingClientRect();
      // Difference of rects is scroll-independent; gives body center in article's local space.
      gsap.set(article, {
        transformOrigin: `${br.left - ar.left + br.width / 2}px ${br.top - ar.top + br.height / 2}px`,
      });
    }
  }

  buildPoints();

  function render(t) {
    const x = cubic(x0, x1, x2, x3, t);
    const dx = cubicDerivative(x0, x1, x2, x3, t);
    const dy = cubicDerivative(guideY0, guideY1, guideY2, guideY3, t);
    setX(x);
    setRotation(Math.atan2(dy, dx) * (180 / Math.PI) + ROTATION_OFFSET);
  }

  // Phase 2 sub-timeline: parallax separation played during the pin.
  // Mirrors createCardParallax but driven by ST progress instead of its own ST.
  const parallaxTl = gsap.timeline({ paused: true });
  if (figure)
    parallaxTl.fromTo(
      figure,
      { yPercent: 0 },
      { yPercent: 0, ease: "none" },
      0,
    );
  if (body)
    parallaxTl.fromTo(
      body,
      { yPercent: 0 },
      { yPercent: -25, ease: "none" },
      0,
    );

  // Phase 1: path entry (t = 0 → 0.5)
  const tl1 = gsap.timeline({
    scrollTrigger: {
      id: `card-motion-path-${index}-1`,
      trigger: triggerEl,
      start: "top bottom",
      end: "center center",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (st) => render(st.progress * 0.5),
      onRefresh: buildPoints,
    },
  });

  // Phase 2: pin + parallax
  const tl2 = gsap.timeline({
    scrollTrigger: {
      id: `card-motion-path-${index}-2`,
      trigger: triggerEl,
      start: "center center",
      // Release when body's bottom reaches 50% of the viewport height.
      // getBoundingClientRect().bottom + scrollY is scroll-independent (document-absolute).
      end: () =>
        body
          ? body.getBoundingClientRect().bottom +
            window.scrollY -
            window.innerHeight * 0.5
          : `+=${window.innerHeight * 0.5}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (st) => parallaxTl.progress(st.progress),
    },
  });

  // Phase 3: path exit (t = 0.5 → 1).
  // start is a function so it evaluates lazily after tl2's ScrollTrigger has resolved
  // its end scroll position — this guarantees Phase 3 begins exactly where Phase 2 ends,
  // regardless of how much scroll distance the pin added.
  const tl3 = gsap.timeline({
    scrollTrigger: {
      id: `card-motion-path-${index}-3`,
      trigger: triggerEl,
      start: () => tl2.scrollTrigger?.end ?? "center center",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (st) => render(0.5 + st.progress * 0.5),
    },
  });

  render(0);

  return {
    pathEl,
    timelines: [tl1, tl2, tl3],
    kill() {
      tl1?.scrollTrigger?.kill();
      tl1?.kill();
      tl2?.scrollTrigger?.kill();
      tl2?.kill();
      tl3?.scrollTrigger?.kill();
      tl3?.kill();
      parallaxTl?.kill();
      article.style.willChange = "";
      if (figure) figure.style.willChange = "";
      if (body) body.style.willChange = "";
      gsap.set(article, { clearProps: "x,rotation,transformOrigin" });
      if (figure) gsap.set(figure, { clearProps: "yPercent" });
      if (body) gsap.set(body, { clearProps: "yPercent" });
      pathEl?.remove();
    },
  };
}
