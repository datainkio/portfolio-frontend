import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { PROCESS_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const PROCESS_EL_ATTR = PROCESS_SELECTORS.elementAttribute;

// Stable id so rebuilds (matchMedia / resize re-invoke the variant) can kill the
// prior instance instead of stacking duplicate triggers.
const BLOCKFRAMES_REVEAL_ST_ID = "process-blockframes-reveal";

/**
 * Scroll-triggered reveal for the Process 12x3 Blockframes grid. The grid
 * fills its wrapper 1:1 (12 columns x 3 rows, no gap), so each of the 36
 * `data-blockframe-block` cells (filled at runtime by blockframes-grid.js) is
 * naturally 1/12 the wrapper's width and sits flush against its neighbors.
 * All 36 cells start hidden; a single timeline fades every cell's opacity to
 * 100 with a stagger keyed to the grid's physical [12, 3] layout, so the
 * reveal sweeps across the board in DOM/row-major order. Fires once when the
 * wrapper reaches viewport center — no scrub, no pin. Reduced motion is
 * handled upstream by the profile system swapping to the `reduced` variant,
 * so no reduced branch belongs here.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {gsap.core.Timeline|null}
 */
export function buildBlockframesReveal(view) {
  const wrapper =
    view?.querySelector(`[${PROCESS_EL_ATTR}="blockframes"]`) ?? null;
  const grid =
    wrapper?.querySelector(`[${PROCESS_EL_ATTR}="blockframes-grid"]`) ?? null;
  if (!wrapper || !grid) return null;

  // Idempotent across rebuilds: kill the prior trigger before creating a fresh
  // one so matchMedia/resize re-invocations don't stack duplicates.
  ScrollTrigger.getById(BLOCKFRAMES_REVEAL_ST_ID)?.kill();

  // The 36 grid cells in DOM/row-major order (12 wide, 3 tall) — all
  // data-blockframe-block placeholders, filled at runtime by
  // blockframes-grid.js.
  const blocks = [...grid.children];

  gsap.set(blocks, { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      id: BLOCKFRAMES_REVEAL_ST_ID,
      trigger: wrapper,
      start: "center center",
      once: true,
    },
  });

  tl.to(blocks, {
    autoAlpha: 1,
    duration: 0.6,
    stagger: { each: 0.03, grid: [12, 3] },
  });

  return tl;
}
