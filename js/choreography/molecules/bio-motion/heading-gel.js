import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Bio Heading Gel
 *
 * Anchors the `gel_bio` gel behind the bio section's <h2> as a full-bleed band:
 * viewport width, the heading's own height, at the heading's viewport y.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), so an absolutely
 * positioned child resolves against the viewport — `top` is the heading's raw
 * getBoundingClientRect().top, with no scroll offset added. The fixed container
 * already holds the gel in the viewport, so the gel is never ScrollTrigger-
 * pinned — a pin would be redundant on an element that cannot scroll. The
 * ScrollTrigger below only re-syncs `top` as the heading moves past it.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

export const HEADING_GEL_ID = "gel_bio";
const SYNC_ST_ID = "bio-heading-gel-sync";
const HEADING_EL = "heading";

const selectHeading = (view) =>
  view?.querySelector(`[${BIO_SELECTORS.elementAttribute}="${HEADING_EL}"]`) ??
  null;

// The outro pin owns `scaleY` on the gel band during its gel-expand beat.
// `sync()` runs on every scroll tick across the whole section and would reset
// scaleY to 1 each time — suspend it while the outro pin is active.
const suspended = new WeakSet();

export function suspendHeadingGelSync(view) {
  if (view) suspended.add(view);
}

export function resumeHeadingGelSync(view) {
  if (view) suspended.delete(view);
}

export const getHeadingGelEl = (gelManager) =>
  gelManager?.getGel?.(HEADING_GEL_ID)?.view ?? null;

/**
 * @param {HTMLElement|null} view Bio section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The sync trigger, or null when unavailable.
 */
export function attachHeadingGel(view, gelManager) {
  const gel = gelManager?.getGel?.(HEADING_GEL_ID) ?? null;
  const heading = selectHeading(view);
  if (!gel?.view || !heading) return null;

  const el = gel.view;
  let lastHeight = null;

  const sync = () => {
    if (suspended.has(view)) return;
    const rect = heading.getBoundingClientRect();
    if (!rect.height) return;

    gsap.set(el, {
      left: 0,
      top: rect.top,
      width: "100vw",
      height: rect.height,
      // Neutralize any transform left by another variant/arrangement — the band
      // is positioned purely by left/top/width/height.
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "center center",
      autoAlpha: 1,
    });

    // The SVG mask is measured from the element box, so it only needs rebuilding
    // when the box actually resizes — not on every scroll tick.
    if (rect.height !== lastHeight) {
      lastHeight = rect.height;
      gel.refresh();
    }
  };

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(SYNC_ST_ID)?.kill();

  sync();

  return ScrollTrigger.create({
    id: SYNC_ST_ID,
    trigger: view,
    start: "top bottom",
    end: "bottom top",
    onUpdate: sync,
    onRefresh: sync,
    onToggle: sync,
  });
}
