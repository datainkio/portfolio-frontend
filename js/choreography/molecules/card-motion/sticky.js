/**
 * Creates the sticky-figure variant for Variant 01 (below lg).
 *
 * Reproduces `position: sticky` with a scrubbed transform instead of CSS or a
 * ScrollTrigger `pin`. Both alternatives were rejected: CSS sticky breaks
 * inside ScrollSmoother's transformed content wrapper, and `pin` cannot hold
 * the figure without either adding pin spacing (which pushes the body down so
 * it never slides over the figure) or dropping it from flow (which snaps the
 * body up by a full viewport at pin start). A y-translate leaves layout
 * untouched, so the body keeps following native scroll.
 *
 * Travel is `article.offsetHeight - figure.offsetHeight`, recomputed on every
 * refresh. With the card's base `pb-[25dvh]`, that lands the release exactly
 * where the spec asks: body bottom at 75% of the viewport, figure bottom at
 * the fold, next card still below it.
 *
 * @param {{
 *   article: Element,
 *   figure: Element,
 *   index?: number,
 *   triggerEl?: Element,
 *   reduceMotion?: boolean
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import { killST, buildScrollTrigger } from "./card-motion.js";

const CARD_STICKY_TRIGGER = {
  id: "card-sticky",
  start: "top top",
  scrub: true,
  invalidateOnRefresh: true,
};

export function createCardSticky({
  article,
  figure,
  index = 0,
  triggerEl,
  reduceMotion,
} = {}) {
  if (!article || !figure) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: "y,willChange" });
    return { kill() {} };
  }

  const travel = () =>
    Math.max(0, article.offsetHeight - figure.offsetHeight);

  gsap.set(figure, { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: buildScrollTrigger(CARD_STICKY_TRIGGER, index, triggerEl, {
      end: () => `+=${travel()}`,
    }),
  });

  tl.fromTo(figure, { y: 0 }, { y: travel, ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "y,willChange" });
    },
  };
}
