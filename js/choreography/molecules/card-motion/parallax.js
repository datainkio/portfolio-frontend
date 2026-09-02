/**
 * Creates the scroll-scrubbed parallax variant for lg+ breakpoints.
 *
 * Body drifts upward faster than the figure as the card scrolls through
 * the viewport, creating a subtle depth separation. Figure remains at
 * default speed (no movement), while body moves with a slight upward offset.
 * Both elements are GPU-promoted via willChange.
 *
 * Timing: Starts when body enters viewport (top bottom), ends when bottom
 * of body passes top of figure or card leaves viewport (bottom top).
 * Reverses on scroll-back (once: false).
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element,
 *   reduceMotion?: boolean
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import { killST, buildScrollTrigger } from "./card-motion.js";
import { CARD_FIGURE_PARALLAX_TRIGGER } from "../../organisms/card/CardTriggers.js";

export function createCardParallax({
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set([figure, body], { yPercent: 0, clearProps: "willChange" });
    return { kill() {} };
  }

  gsap.set([figure, body], { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: buildScrollTrigger(
      CARD_FIGURE_PARALLAX_TRIGGER,
      index,
      triggerEl,
    ),
  });

  tl.fromTo(body, { yPercent: 0 }, { yPercent: -12, ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set([figure, body], { yPercent: 0, clearProps: "willChange" });
    },
  };
}
