import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Bio Overview Gel
 *
 * Anchors the `gel_subheading` gel behind the bio section's overview <h3> as a
 * full-bleed band: viewport width, the overview heading's own height, at its
 * viewport y. Mirrors heading-gel.js's strategy for the <h2>.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), so an absolutely
 * positioned child resolves against the viewport — `top` is the overview
 * heading's raw getBoundingClientRect().top, with no scroll offset added. The
 * fixed container already holds the gel in the viewport, so the gel is never
 * ScrollTrigger-pinned — a pin would be redundant on an element that cannot
 * scroll. The ScrollTrigger below only re-syncs `top` as the heading moves.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

const OVERVIEW_GEL_ID = "gel_subheading";
const SYNC_ST_ID = "bio-overview-gel-sync";
const OVERVIEW_EL = "overview";

const selectOverview = (view) =>
  view?.querySelector(`[${BIO_SELECTORS.elementAttribute}="${OVERVIEW_EL}"]`) ??
  null;

/**
 * @param {HTMLElement|null} view Bio section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The sync trigger, or null when unavailable.
 */
export function attachOverviewGel(view, gelManager) {
  const gel = gelManager?.getGel?.(OVERVIEW_GEL_ID) ?? null;
  const overview = selectOverview(view);
  if (!gel?.view || !overview) return null;

  const el = gel.view;
  let lastHeight = null;

  const sync = () => {
    const rect = overview.getBoundingClientRect();
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
