/**
 * Card-Motion Molecule
 *
 * Scroll-driven animation variants for project cards. Each factory returns { kill() }.
 * Card.js calls kill() on breakpoint and reduced-motion transitions.
 *
 *   createCardScrollClip   (base) — Scrubbed height collapse + image clip-path.
 *   createCardScrollFade   (md)   — Single-play fade+lift on scroll enter.
 *   createCardParallax     (md)   — Scroll-scrubbed body parallax.
 *   createMasterTimeline   (lg+)  — Curved bezier arc with three scroll phases:
 *                                   intro (arc in), inter (pin/hold), outro (arc out).
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
  motion,
} from "../config/index/index.js";
import { isReducedMotion } from "../system/ReducedMotionHandler.js";

const killST = (tl) => {
  tl?.scrollTrigger?.kill(true);
  tl?.kill();
};

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
export function createCardScrollClip({
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
  const image = figure.querySelector('[data-card-el="image"]');
  if (!image) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: "height,overflow,willChange" });
    gsap.set(image, {
      clearProps: "position,top,left,width,height,clipPath,willChange",
    });
    return { kill() {} };
  }

  const initialHeight = getViewport().height;
  console.log("initialHeight", initialHeight);
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
      gsap.set(image, {
        clearProps: "position,top,left,width,height,clipPath,willChange",
      });
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
export function createCardScrollFade({
  figure,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
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
export function createCardParallax({
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
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

// Cubic bezier control points for the card's curved viewport trajectory (pixel space).
//   x0 = x3 = -(vw / 12)  — entry/exit offset: ~1/12 vw left of center
//   x1 = x2 =  vw / 36    — control points: slightly right of center (pulls arc inward)
//
// At t=0.5: x = 0 (horizontally centered), dx = 0, so rotation = 0. Natural pin point.
const ENTRY_X_FRACTION = 1 / 12;
const CP_X_FRACTION = 1 / 36;
// +90 aligns the article's natural upright axis with the bezier tangent direction.
const ROTATION_OFFSET = 90;
const CP_Y_RATIOS = [0.7, 0.3];
const CARD_SCROLL_DISTANCE_FACTOR = 3;
const CARD_MOTION_TUNING = {
  articleTravelVhFraction: 1,
};

// Figure and body elements are offscreen at the start of the scroll. (Is overflow-hidden useful here? Gotta think about how the height of the article is impacted.)
function createIntroTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const body = article.querySelector('[data-card-el="body"]');

  // Move the figure and body elements to their starting positions, which is
  // just below the viewport. The article itself will be pinned, so it won't
  // move.
  const initialHeight = getViewport().height;
  gsap.set([figure, body], {
    y: initialHeight,
  });

  // With the article pinned, the figure animates into view along the path
  const tl = gsap.timeline();
  tl.to(figure, {
    y: 0,
    // motionPath: {
    //   path: toViewportPath(VIEWPORT_PATHS.throwIn),
    //   // curviness: 1.25,
    //   // autoRotate: true,
    // },
  });

  // With the intro complete, the figure appears pinned
  return tl;
}

// The article is still pinned and the figure has completed its travel. Collapse the card.
function createInterTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const image = figure.querySelector("img");
  const body = article.querySelector('[data-card-el="body"]');

  // Capture before any DOM mutation — once image goes position:absolute the
  // figure loses its only in-flow child and article's auto height shrinks.
  const initialHeight = getViewport().height;
  const figureHeight = figure.offsetHeight;
  const articleHeight = article.offsetHeight;
  const bodyHeight = body.offsetHeight;
  const collapseDistance = figureHeight + bodyHeight - articleHeight;
  // Position the body at its final pixel location so it can be scrubbed up
  // with the figure collapse without scaling artifacts. The body is above the figure in z-index so it will appear to be revealed as the figure collapses.

  gsap.set(body, {
    position: "absolute",
    bottom: collapseDistance,
    left: 0,
    right: 0,
    zIndex: 10,
  });

  const tl = gsap.timeline();
  tl.to(body, { y: collapseDistance });
  tl.to(article, { height: bodyHeight * 1.5 });

  return tl;
}

function createOutroTimeline(article) {
  const tl = gsap.timeline();
  tl.to(article, {
    rotation: 45,
    // motionPath: {
    //   path: toViewportPath(VIEWPORT_PATHS.throwOut),
    //   // curviness: 1.25,
    //   //autoRotate: true,
    // },
  });
  return tl;
}

export function createMasterTimeline({
  article,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
} = {}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(article, {
      clearProps: "x,y,rotation,transformOrigin,willChange",
    });
    return { kill() {} };
  }

  // gsap.set(article, { willChange: "transform" });
  // gsap.set(article, {
  //   y: window.innerHeight * CARD_MOTION_TUNING.articleTravelVhFraction,
  // });

  const tl = gsap.timeline({
    duration: motion.duration("slow") / 1000, // use system token here
    scrollTrigger: {
      trigger: article,
      start: "top top",
      end: "bottom top",
      pin: true,
      scrub: true,
      markers: true,
    },
  });

  tl.add(createIntroTimeline(article));
  tl.add(createInterTimeline(article));
  tl.add(createOutroTimeline(article));

  const figure = article.querySelector('[data-card-el="figure"]');
  const image = figure?.querySelector("img");
  // const body = article.querySelector('[data-card-el="body"]');

  return {
    kill() {
      killST(tl);
      gsap.set(article, {
        clearProps: "x,y,height,rotation,transformOrigin,autoAlpha,willChange",
      });
      if (image)
        gsap.set(image, {
          clearProps: "position,top,left,width,height,clipPath,willChange",
        });
      if (body)
        gsap.set(body, {
          clearProps: "position,top,bottom,left,right,zIndex,y",
        });
    },
  };
}

const VIEWPORT_PATHS = {
  throwIn: [
    { x: 80, y: 100 },
    { x: 25, y: 25 },
    { x: 0, y: 0 },
  ],
  throwOut: [
    { x: 0, y: 0 },
    { x: 25, y: -25 },
    { x: 100, y: -100 },
  ],
};

const getViewport = () => {
  const viewport = window.visualViewport;

  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
  };
};

const toViewportPath = (points) => {
  const { width, height } = getViewport();

  return points.map(({ x, y }) => ({
    x: width * (x / 100),
    y: height * (y / 100),
  }));
};

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

function createPathRenderer({ article, body }) {
  const pts = { x0: 0, x1: 0, x2: 0, x3: 0, gy0: 0, gy1: 0, gy2: 0, gy3: 0 };
  const setX = gsap.quickSetter(article, "x", "px");
  const setRotation = gsap.quickSetter(article, "rotation", "deg");

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
    gsap.set(article, {
      transformOrigin: `${br.left - ar.left + br.width / 2}px ${br.top - ar.top + br.height / 2}px`,
    });
  }

  function refresh() {
    buildPoints();
    updateTransformOrigin();
  }

  function render(t) {
    const x = cubic(pts.x0, pts.x1, pts.x2, pts.x3, t);
    const dx = cubicDerivative(pts.x0, pts.x1, pts.x2, pts.x3, t);
    const dy = cubicDerivative(pts.gy0, pts.gy1, pts.gy2, pts.gy3, t);
    setX(x);
    setRotation(Math.atan2(dy, dx) * (180 / Math.PI) + ROTATION_OFFSET);
  }

  return { refresh, render };
}
