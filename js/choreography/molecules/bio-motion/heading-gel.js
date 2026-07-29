import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Bio Heading Gel
 *
 * Pins the `gel_hero` gel behind the bio section's <h2> as a full-bleed band:
 * viewport width, the heading's own height, at the heading's viewport y.
 *
 * The gel lives in `#background` (`fixed inset-0`), so an absolutely positioned
 * child resolves against the viewport — `top` is the heading's raw
 * getBoundingClientRect().top, with no scroll offset added. Because the
 * container is fixed, the gel does not scroll with the page on its own; a
 * ScrollTrigger re-syncs `top` as the heading moves through the viewport.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

const HEADING_GEL_ID = "gel_hero";
const SYNC_ST_ID = "bio-heading-gel-sync";
const HEADING_EL = "heading";

const selectHeading = (view) =>
  view?.querySelector(
    `[${BIO_SELECTORS.elementAttribute}="${HEADING_EL}"]`,
  ) ?? null;

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
