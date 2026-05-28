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
 *   motionpath (md+)  — Curved viewport-relative trajectory (phase 1: path guide only).
 *                       Cards will follow an arc: enter slightly left of center, reach
 *                       horizontal center at vertical midpoint, exit slightly left of center.
 *                       Currently only renders the visible SVG guide; no tween yet.
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
 * const mp = createCardMotionPath({ figure, triggerEl: root });
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
const MOTION_PATH_D = "M 41.667 100 C 52.778 70 52.778 30 41.667 0";
const MOTION_PATH_GUIDE_ATTR = "data-card-path-guide";
const MOTION_PATH_ID = "card-motion-path";

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
 * Animates only the horizontal (x) offset of the figure element; vertical motion
 * is provided by scroll. The x offset follows the same arc as the SVG guide:
 * –4.5vw at entry and exit, 0 (natural center) when the card's center reaches
 * the viewport's vertical midpoint. power2.out / power2.in eases match the
 * bezier curvature of the path guide.
 *
 * The guide SVG is a singleton — all instances share the same element and
 * recreate it via getOrCreatePathGuide() if a prior kill() removed it.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ pathEl: SVGSVGElement, timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardMotionPath({
  figure,
  body,
  index = 0,
  triggerEl,
} = {}) {
  const pathEl = getOrCreatePathGuide();

  figure.style.willChange = "transform";

  const tl = gsap.timeline({
    autoRotate: true,
    scrollTrigger: {
      trigger: triggerEl,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Animate only the horizontal offset. Vertical motion comes from scroll.
  // Bezier math: at t=0.25, x_offset is 75% resolved → power2.out for entry, power2.in for exit.
  tl.fromTo(
    figure,
    { x: "calc(-100vw / 12)" },
    { x: "0vw", ease: "power2.out" },
  );
  tl.to(figure, { x: "calc(-100vw / 12)", ease: "power2.in" });

  return {
    pathEl,
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
      gsap.set(figure, { clearProps: "x" });
      pathEl?.remove();
    },
  };
}
