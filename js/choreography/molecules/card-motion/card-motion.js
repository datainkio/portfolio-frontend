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
import { createThrowTimeline } from "./throw.js";
export { createThrowTimeline } from "./throw.js";
import { createCardScrollClip } from "./clip.js";
export { createCardScrollClip } from "./clip.js";
import { createCardParallax } from "./parallax.js";
export { createCardParallax } from "./parallax.js";
import { createCardScrollFade } from "./fade-n-lift.js";
export { createCardScrollFade } from "./fade-n-lift.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
  motion,
} from "../../config/index/index.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

const killST = (tl) => {
  tl?.scrollTrigger?.kill(true);
  tl?.kill();
};

const CLEAR = {
  figure: "height,overflow,willChange",
  figureImage: "position,top,left,width,height,clipPath,willChange",
  body: "position,top,bottom,left,right,zIndex,y",
  article: "x,y,height,rotation,transformOrigin,autoAlpha,willChange",
  articleBase: "x,y,rotation,transformOrigin,willChange",
};

const buildScrollTrigger = (base, index, triggerEl, overrides = {}) => ({
  ...base,
  id: `${base.id}-${index}`,
  trigger: triggerEl,
  ...overrides,
});
