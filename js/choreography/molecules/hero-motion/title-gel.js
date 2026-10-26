import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Hero Title Gel
 *
 * Holds the `gel_title` gel as a full-width band behind the hero header's
 * content — the context label through the h1: `left: 0 / width: 100vw`, with
 * that block's height and vertical position. It is separate from `gel_hero`
 * (see heading-gel.js), which keeps filling the viewport behind it.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), but the header
 * scrolls. So the block is measured only on refresh (resize), as a document-relative
 * `top`, and scroll is followed with a `y` transform taken from the scroll
 * position — no layout read per tick. The gel is never ScrollTrigger-pinned.
 *
 * `scaleX` is not geometry and `sync()` never touches it: `attachTitleGel`
 * parks it at 0 and the split intro wipes it 0 → 1 from the left edge.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

export const TITLE_GEL_ID = "gel_title";
const SYNC_ST_ID = "hero-title-gel-sync";

// view -> the live `sync` closure, so the intro can re-measure on demand.
const syncs = new WeakMap();

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_SELECTORS.elementAttribute}="${name}"]`) ?? null;

// Layout box without GSAP's `y`: the intro pre-sets the context label at a
// `from` offset, and getBoundingClientRect() includes transforms.
const untransformedBox = (el) => {
  const rect = el.getBoundingClientRect();
  const y = Number(gsap.getProperty(el, "y")) || 0;
  return { top: rect.top - y, bottom: rect.bottom - y };
};

export const getTitleGelEl = (gelManager) =>
  gelManager?.getGel?.(TITLE_GEL_ID)?.view ?? null;

// Re-measure on demand — the intro calls this after SplitText has re-flowed
// the h1, since the split can change its height.
export const syncTitleGel = (view) => syncs.get(view)?.();

/**
 * Place the title gel on the label + h1 block and park it collapsed (`scaleX: 0`) at the
 * viewport's left edge, ready for the intro's wipe.
 *
 * @param {HTMLElement|null} view Hero section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The resize/scroll hook, or null when unavailable.
 */
export function attachTitleGel(view, gelManager) {
  const gel = gelManager?.getGel?.(TITLE_GEL_ID) ?? null;
  const title = selectHeroEl(view, HERO_SELECTORS.title);
  if (!gel?.view || !title) return null;
  // The band spans the header's visible content: context label + h1. The
  // header itself is h-dvh, so its own box would be the whole viewport.
  const blocks = [selectHeroEl(view, HERO_SELECTORS.context), title].filter(
    Boolean,
  );

  const el = gel.view;
  const setY = gsap.quickSetter(el, "y", "px");
  let lastHeight = null;

  const sync = () => {
    const boxes = blocks.map(untransformedBox);
    const top = Math.min(...boxes.map((box) => box.top));
    const height = Math.max(...boxes.map((box) => box.bottom)) - top;
    if (!height) return;

    gsap.set(el, {
      left: 0,
      top: top + window.scrollY,
      width: "100vw",
      height,
      // Neutralize any transform left by another variant. scaleX is
      // deliberately absent — the park below and the intro wipe own it.
      x: 0,
      y: -window.scrollY,
      rotation: 0,
      xPercent: 0,
      yPercent: 0,
      scaleY: 1,
      transformOrigin: "left center",
      autoAlpha: 1,
    });

    // The SVG mask is measured from the element box, so it only needs rebuilding
    // when the box actually resizes. At scaleX 0 the measured width is 0 and
    // GelGeometry falls back to offsetWidth, the untransformed width.
    if (height !== lastHeight) {
      lastHeight = height;
      gel.refresh();
    }
  };

  syncs.set(view, sync);

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(SYNC_ST_ID)?.kill();

  sync();
  gsap.set(el, { scaleX: 0 });

  // `onRefresh` re-measures the block on resize. `onUpdate` follows scroll with
  // the transform only — `self.scroll()` is not a layout read.
  return ScrollTrigger.create({
    id: SYNC_ST_ID,
    trigger: view,
    start: "top bottom",
    end: "bottom top",
    onRefresh: sync,
    onUpdate: (self) => setY(-self.scroll()),
  });
}
