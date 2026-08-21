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
 * Travel is measured from the body's own bottom border, recomputed on every
 * refresh: `body.offsetTop + body.offsetHeight - 25vh`. The hold therefore
 * releases when that border passes 25% down from the top of the viewport,
 * whatever the card's height or the base `pb-[25dvh]` happens to be.
 * Without a body element it falls back to `article.offsetHeight -
 * figure.offsetHeight` (release with the figure bottom at the fold).
 *
 * @param {{
 *   article: Element,
 *   figure: Element,
 *   body?: Element,
 *   index?: number,
 *   triggerEl?: Element,
 *   reduceMotion?: boolean
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import { killST, buildScrollTrigger } from "./card-motion.js";

// Release point for the held figure, as a fraction of viewport height measured
// down from the top: the body's bottom border lands here when the hold ends.
const BODY_BOTTOM_RELEASE = 0.25;

const CARD_STICKY_TRIGGER = {
  id: "card-sticky",
  start: "top top",
  scrub: true,
  invalidateOnRefresh: true,
};

export function createCardSticky({
  article,
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
} = {}) {
  if (!article || !figure) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: "y,willChange" });
    return { kill() {} };
  }

  const viewportHeight = () =>
    window.visualViewport?.height ?? window.innerHeight;

  const travel = () =>
    body
      ? Math.max(
          0,
          body.offsetTop +
            body.offsetHeight -
            viewportHeight() * BODY_BOTTOM_RELEASE,
        )
      : Math.max(0, article.offsetHeight - figure.offsetHeight);

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
