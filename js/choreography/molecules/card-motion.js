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
 *                       Phase 2: article pins; body plays a parallax lift.
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

import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
} from "../config/index/index.js";
import { isReducedMotion } from "../system/ReducedMotionHandler.js";

const killST = (tl) => { tl?.scrollTrigger?.kill(true); tl?.kill(); };
const DEBUG_MOTION_PATH = new URLSearchParams(location.search).has("debug-motion");

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
 * @returns {{ kill(): void }}
 */
export function createCardScrollClip({ figure, body, index = 0, triggerEl, reduceMotion }) {
  const image = figure.querySelector('[data-card-el="image"]');
  if (!image) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: "height,overflow,willChange" });
    gsap.set(image, { clearProps: "position,top,left,width,height,clipPath,willChange" });
    return { kill() {} };
  }

  const initialHeight = figure.offsetHeight;

  gsap.set(figure, { overflow: "hidden", willChange: "height" });
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
    kill() {
      killST(tl);
      gsap.set(image, { clearProps: "position,top,left,width,height,clipPath,willChange" });
      gsap.set(figure, { clearProps: "height,overflow,willChange" });
    },
  };
}

/**
 * Creates the single-play fade+lift variant for mid-range breakpoints.
 *
 * @param {{
 *   figure: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ kill(): void }}
 */
export function createCardScrollFade({ figure, index = 0, triggerEl, reduceMotion }) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { autoAlpha: 1, y: 0 });
    return { kill() {} };
  }

  gsap.set(figure, { autoAlpha: 0, y: 16, willChange: "opacity, transform" });

  const tl = gsap.timeline({
    scrollTrigger: {
      id: `card-scroll-fade-${index}`,
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
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "willChange" });
    },
  };
}

/**
 * Creates the scroll-scrubbed parallax variant for md+ breakpoints.
 *
 * Body drifts upward as the card scrolls through the viewport, creating
 * a depth separation between the image and text layers. Both elements are
 * GPU-promoted via willChange.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ kill(): void }}
 */
export function createCardParallax({ figure, body, index = 0, triggerEl, reduceMotion }) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { yPercent: 0, clearProps: "willChange" });
    if (body) gsap.set(body, { yPercent: 0, clearProps: "willChange" });
    return { kill() {} };
  }

  gsap.set(figure, { willChange: "transform" });
  gsap.set(body, { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_PARALLAX_TRIGGER,
      id: `${CARD_FIGURE_PARALLAX_TRIGGER.id}-${index}`,
      trigger: triggerEl,
    },
  });

  tl.fromTo(body, { yPercent: 0 }, { yPercent: -25, ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "willChange" });
      gsap.set(body, { clearProps: "yPercent,willChange" });
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
// Fractions of viewport height for the two bezier control points.
// Used in both buildPoints (pixel space) and the debug guide circles (SVG 0-100 space).
const CP_Y_RATIOS = [0.7, 0.3];

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
    [52.778, CP_Y_RATIOS[0] * 100],
    [52.778, CP_Y_RATIOS[1] * 100],
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
 *   Phase 2 — pin: article pins at viewport center; body plays a parallax lift.
 *   Phase 3 — path exit: article arcs from horizontal center toward top-left (t 0.5→1).
 *
 * Vertical motion throughout is provided by natural scroll; only the x offset and
 * rotation are animated. At t=0.5 dx=0, so rotation=0 — the article is perfectly
 * upright when it pins. Control points are computed once (buildPoints) and refreshed
 * on resize via ScrollTrigger's onRefresh.
 *
 * The guide SVG is a singleton gated behind DEBUG_MOTION_PATH — off by default.
 *
 * @param {{
 *   article: Element,
 *   figure?: Element,
 *   body?: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ kill(): void }}
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
  reduceMotion,
} = {}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(article, { clearProps: "x,rotation,transformOrigin,willChange" });
    if (figure) gsap.set(figure, { clearProps: "willChange" });
    if (body) gsap.set(body, { clearProps: "yPercent,willChange" });
    return { kill() {} };
  }

  const pathEl = DEBUG_MOTION_PATH ? getOrCreatePathGuide() : null;

  gsap.set(article, { willChange: "transform" });
  if (figure) gsap.set(figure, { willChange: "transform" });
  if (body) gsap.set(body, { willChange: "transform" });

  const setX = gsap.quickSetter(article, "x", "px");
  const setRotation = gsap.quickSetter(article, "rotation", "deg");

  // Control points in pixels — recomputed on resize via buildPoints().
  // x: relative to the card's natural centered position (see ENTRY_X_FRACTION).
  // gy: y-coordinates in pixels, used only for tangent/rotation math.
  const pts = { x0: 0, x1: 0, x2: 0, x3: 0, gy0: 0, gy1: 0, gy2: 0, gy3: 0 };

  function buildPoints() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    pts.x0 = -(vw * ENTRY_X_FRACTION);
    pts.x1 = vw * CP_X_FRACTION;
    pts.x2 = vw * CP_X_FRACTION;
    pts.x3 = -(vw * ENTRY_X_FRACTION);
    pts.gy0 = vh;
    pts.gy1 = vh * CP_Y_RATIOS[0];
    pts.gy2 = vh * CP_Y_RATIOS[1];
    pts.gy3 = 0;
  }

  function updateTransformOrigin() {
    if (!body) return;
    const ar = article.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    // Difference of rects is scroll-independent; gives body center in article's local space.
    gsap.set(article, {
      transformOrigin: `${br.left - ar.left + br.width / 2}px ${br.top - ar.top + br.height / 2}px`,
    });
  }

  function refresh() {
    buildPoints();
    updateTransformOrigin();
  }

  refresh();

  function render(t) {
    const x = cubic(pts.x0, pts.x1, pts.x2, pts.x3, t);
    const dx = cubicDerivative(pts.x0, pts.x1, pts.x2, pts.x3, t);
    const dy = cubicDerivative(pts.gy0, pts.gy1, pts.gy2, pts.gy3, t);
    setX(x);
    setRotation(Math.atan2(dy, dx) * (180 / Math.PI) + ROTATION_OFFSET);
  }

  // Phase 2 sub-timeline: body parallax lift played during the pin.
  // Driven by ST progress instead of its own ScrollTrigger.
  const parallaxTl = gsap.timeline({ paused: true });
  if (body)
    parallaxTl.fromTo(
      body,
      { yPercent: 0 },
      { yPercent: -50, ease: "none" },
      0,
    );

  // Phase 1: path entry (t = 0 → 0.5)
  const st1 = ScrollTrigger.create({
    id: `card-motion-path-${index}-1`,
    trigger: triggerEl,
    start: "top bottom",
    end: "center center",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (st) => render(st.progress * 0.5),
    onRefresh: refresh,
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
  const st3 = ScrollTrigger.create({
    id: `card-motion-path-${index}-3`,
    trigger: triggerEl,
    start: () => tl2.scrollTrigger?.end ?? "center center",
    end: "bottom top",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (st) => render(0.5 + st.progress * 0.5),
  });

  render(0);

  return {
    kill() {
      st1?.kill();
      killST(tl2);
      st3?.kill();
      parallaxTl?.kill();
      gsap.set(article, { clearProps: "x,rotation,transformOrigin,willChange" });
      if (figure) gsap.set(figure, { clearProps: "willChange" });
      if (body) gsap.set(body, { clearProps: "yPercent,willChange" });
      if (DEBUG_MOTION_PATH) pathEl?.remove();
    },
  };
}
