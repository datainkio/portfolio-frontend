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

const CLEAR = {
  figure:      "height,overflow,willChange",
  figureImage: "position,top,left,width,height,clipPath,willChange",
  body:        "position,top,bottom,left,right,zIndex,y",
  article:     "x,y,height,rotation,transformOrigin,autoAlpha,willChange",
  articleBase: "x,y,rotation,transformOrigin,willChange",
};

const buildScrollTrigger = (base, index, triggerEl, overrides = {}) => ({
  ...base,
  id: `${base.id}-${index}`,
  trigger: triggerEl,
  ...overrides,
});

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
    gsap.set(figure, { clearProps: CLEAR.figure });
    gsap.set(image, { clearProps: CLEAR.figureImage });
    return { kill() {} };
  }

  const initialHeight = getViewport().height;
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
    scrollTrigger: buildScrollTrigger(CARD_FIGURE_CLIP_TRIGGER, index, triggerEl, {
      end: () => `+=${window.innerHeight}`,
      invalidateOnRefresh: true,
    }),
  });

  tl.to(figure, { height: 0, ease: "none" }, 0);
  tl.to(image, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set(image, { clearProps: CLEAR.figureImage });
      gsap.set(figure, { clearProps: CLEAR.figure });
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

  gsap.set([figure, body], { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: buildScrollTrigger(CARD_FIGURE_PARALLAX_TRIGGER, index, triggerEl),
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

function createIntroTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const body = article.querySelector('[data-card-el="body"]');

  const initialHeight = getViewport().height;
  gsap.set([figure, body], { y: initialHeight });

  const tl = gsap.timeline();
  tl.to(figure, {
    duration: motion.duration("slow") / 1000,
    motionPath: {
      path: toViewportPath(VIEWPORT_PATHS.throwIn),
      curviness: 1.5,
      autoRotate: 90,
    },
  });

  return tl;
}

function createInterTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const body = article.querySelector('[data-card-el="body"]');

  // Capture before any DOM mutation — once body goes position:absolute it
  // leaves the grid flow and article's auto height shrinks.
  const figureHeight = figure.offsetHeight;
  const articleHeight = article.offsetHeight;
  const bodyHeight = body.offsetHeight;
  const collapseDistance = figureHeight + bodyHeight - articleHeight;

  const tl = gsap.timeline();
  tl.call(() => {
    gsap.set(body, {
      position: "absolute",
      bottom: collapseDistance,
      left: 0,
      right: 0,
      zIndex: 10,
    });
  });
  tl.to(body, {
    y: collapseDistance,
    duration: motion.duration("slow") / 1000,
  });
  tl.to(article, {
    height: bodyHeight * 1.5,
    duration: motion.duration("slow") / 1000,
  });

  return tl;
}

function createOutroTimeline(article) {
  const tl = gsap.timeline();
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
    gsap.set(article, { clearProps: CLEAR.articleBase });
    return { kill() {} };
  }

  const tl = gsap.timeline({
    duration: motion.duration("slow") / 1000,
    scrollTrigger: {
      trigger: article,
      start: "top top",
      end: "bottom 50px",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl.add(createIntroTimeline(article));
  tl.add(createInterTimeline(article));
  tl.add(createOutroTimeline(article));

  const figure = article.querySelector('[data-card-el="figure"]');
  const image = figure?.querySelector("img");

  return {
    kill() {
      killST(tl);
      gsap.set(article, { clearProps: CLEAR.article });
      if (image) gsap.set(image, { clearProps: CLEAR.figureImage });
      if (body) gsap.set(body, { clearProps: CLEAR.body });
    },
  };
}

const VIEWPORT_PATHS = {
  throwIn: [
    { x: 85, y: 100 },
    { x: 10, y: 33 },
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
