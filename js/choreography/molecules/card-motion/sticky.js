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
 * The hold distance is measured from the body's own bottom border, recomputed
 * on every refresh: `body.offsetTop + body.offsetHeight - 25vh`. The figure
 * therefore starts releasing when that border passes 25% down from the top of
 * the viewport, whatever the card's height or the base `pb-[25dvh]` happens to
 * be. Without a body element it falls back to `article.offsetHeight -
 * figure.offsetHeight` (release with the figure bottom at the fold).
 *
 * The release itself is eased rather than instantaneous: a `power2.out` tail
 * over the last `RELEASE_EASE_RATIO` of the range hands the figure back to
 * native scroll speed without the velocity jump a hard cut produces.
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

// Share of the total scroll range spent easing out of the hold, after the
// release point. Expressed as a ratio rather than a pixel distance so the two
// timeline segments keep their proportions across refreshes — scrubbed
// durations are fixed at build time, while function-based values are not.
const RELEASE_EASE_RATIO = 0.15;

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

  // Scroll distance the figure is held for: it translates 1:1 with scroll
  // across this, so it reads as stationary.
  const holdDistance = () =>
    body
      ? Math.max(
          0,
          body.offsetTop +
            body.offsetHeight -
            viewportHeight() * BODY_BOTTOM_RELEASE,
        )
      : Math.max(0, article.offsetHeight - figure.offsetHeight);

  const range = () => holdDistance() / (1 - RELEASE_EASE_RATIO);
  const easeDistance = () => range() - holdDistance();

  // During the tail the figure gives up its 1:1 tracking. `power2.out` is the
  // exact curve for this: its slope starts at 2 and falls to 0, so covering
  // half the tail distance over the full tail leaves the figure moving at
  // scroll speed at handoff (slope 1) and at rest relative to the page by the
  // end — no velocity jump at either edge.
  const easeTravel = () => holdDistance() + easeDistance() / 2;

  gsap.set(figure, { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: buildScrollTrigger(CARD_STICKY_TRIGGER, index, triggerEl, {
      end: () => `+=${range()}`,
    }),
  });

  tl.fromTo(
    figure,
    { y: 0 },
    {
      y: holdDistance,
      ease: "none",
      duration: 1 - RELEASE_EASE_RATIO,
    },
    0,
  );
  tl.to(figure, {
    y: easeTravel,
    ease: "power2.out",
    duration: RELEASE_EASE_RATIO,
  });

  return {
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "y,willChange" });
    },
  };
}
