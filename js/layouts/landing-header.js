/**
 * ---
 * aix:
 *   id: frontend.js.layouts.landing-header
 *   role: Frontend runtime module: js/layouts/landing-header.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - layouts
 *     - landing
 *     - scroll
 *     - gsap
 * ---
 */

/**
 * Landing layout header scroll choreography.
 *
 * Approach (no GSAP pin, no CSS sticky — those two fight each other):
 *   - The header is `position: fixed` so it's anchored to the viewport
 *     top and never participates in document flow.
 *   - A sibling spacer reserves the initial hero space so following
 *     content starts below the full-viewport header.
 *   - A single scrubbed ScrollTrigger animates the header's height,
 *     the spacer's height, and the title's font-size in lockstep over
 *     COLLAPSE_DISTANCE_PX. Because the spacer shrinks alongside the
 *     header, downstream content visibly follows the header down.
 *   - Once the scrub completes, the timeline holds its final values:
 *     the header stays fixed at COLLAPSED.headerHeight and the spacer
 *     reserves a matching strip, so the rest of the page scrolls
 *     cleanly underneath the compact bar.
 *
 * Activation: opt-in via `[data-landing-header]` on the header element
 *             and `[data-landing-header-spacer]` on its sibling spacer.
 *             No-ops on pages that don't render those hooks.
 *
 * GSAP: consumed via the curated vendor barrel so the same import works
 *       in both bundled and no-bundle (raw ESM) dev modes.
 */

import { gsap, ScrollTrigger } from "/assets/js/choreography/vendor/gsap/gsap.js";

const SELECTORS = {
  header: "[data-landing-header]",
  spacer: "[data-landing-header-spacer]",
  title: "[data-landing-header-title]",
};

const COLLAPSED = {
  headerHeight: "4rem",
  titleFontSize: "2rem",
};

// Scroll distance (in px) over which the header collapses from full
// viewport height down to COLLAPSED.headerHeight.
const COLLAPSE_DISTANCE_PX = 400;

/**
 * Initialize the shrink-on-scroll choreography for the landing header.
 * Safe to call more than once; returns the created ScrollTrigger or null.
 */
export function initLandingHeader() {
  const header = document.querySelector(SELECTORS.header);
  const spacer = document.querySelector(SELECTORS.spacer);
  if (!header || !spacer) return null;

  const title = header.querySelector(SELECTORS.title);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: spacer,
      start: "top top",
      end: `+=${COLLAPSE_DISTANCE_PX}`,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl.to(header, { height: COLLAPSED.headerHeight, ease: "none" }, 0).to(
    spacer,
    { height: COLLAPSED.headerHeight, ease: "none" },
    0,
  );

  if (title) {
    tl.to(title, { fontSize: COLLAPSED.titleFontSize, ease: "none" }, 0);
  }

  return tl.scrollTrigger;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLandingHeader, {
    once: true,
  });
} else {
  initLandingHeader();
}
