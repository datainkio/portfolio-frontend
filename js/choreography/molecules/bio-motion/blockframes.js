import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

// Stable id so rebuilds (matchMedia / resize re-invoke the variant) can kill the
// prior instance instead of stacking duplicate triggers.
const BLOCKFRAMES_REVEAL_ST_ID = "bio-blockframes-reveal";

/**
 * Scroll-triggered reveal for the inlined `.Basic` Blockframes SVG, separate
 * from the intro timeline (which plays up-front off the header). Fires once when
 * the wrapper's top reaches viewport center — no scrub, no pin — assembling the
 * mock UI in stages: chrome/background, then toolbar, then the staggered content
 * (sidebar, banner, title, subtitle, text lines).
 *
 * `.from()` tweens degrade to visible-if-JS-fails and animate opacity back to
 * each target's native attribute value (e.g. `.197`), so elements settle at
 * their designed resting opacity automatically. Reduced motion is handled
 * upstream by the profile system swapping to the `reduced` variant, so no
 * reduced branch belongs here.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {gsap.core.Timeline|null}
 */
export function buildBlockframesReveal(view) {
  const wrapper = view?.querySelector(`[${BIO_EL_ATTR}="blockframes"]`) ?? null;
  // Scope to the visible cell: the wrapper is a 6x6 grid and the 35 hidden
  // cells gain their own svgs at runtime (blockframes-grid.js), some of which
  // precede the visible cell in DOM order.
  const svg =
    wrapper?.querySelector(`[${BIO_EL_ATTR}="blockframes-visible"] svg`) ??
    null;
  if (!wrapper || !svg) return null;

  // Idempotent across rebuilds: kill the prior trigger before creating a fresh
  // one so matchMedia/resize re-invocations don't stack duplicates.
  ScrollTrigger.getById(BLOCKFRAMES_REVEAL_ST_ID)?.kill();

  const tl = gsap.timeline({
    scrollTrigger: {
      id: BLOCKFRAMES_REVEAL_ST_ID,
      trigger: wrapper,
      start: "top 33%",
      once: true,
    },
  });

  // 1. Chrome/background frame fades up first — the window shell.
  tl.from(svg.querySelectorAll("g.chrome g.background path"), {
    opacity: 0,
    duration: 0.4,
  });

  // 2. Toolbar (background + dots) fades in with a slight rise.
  tl.from(
    svg.querySelectorAll("g.toolbar path"),
    { opacity: 0, y: 10, duration: 0.3 },
    "-=0.15",
  );

  // 3. Content populates: sidebar items, banner scenery, title, subtitle, and
  //    body text lines rise and fade in together with a short stagger.
  tl.from(
    svg.querySelectorAll(
      "g.sidebar .item path, g.banner path, g.title path, g.subtitle path, path.text_line",
    ),
    { opacity: 0, y: 20, duration: 0.3, stagger: 0.05 },
    "-=0.1",
  );

  // 4. Zoom out: once the Basic fade-in settles, scale the 6x6 grid to fit
  //    the wrapper while the hidden cells fade in. Scaling 1 -> 1/6 about
  //    origin 40%/40% lands the grid exactly in the wrapper box: the grid
  //    sits at -200%/-200% and 0.4 * 600% * (1 - 1/6) = 200% cancels it.
  const grid = wrapper.querySelector(`[${BIO_EL_ATTR}="blockframes-grid"]`);
  if (grid) {
    tl.to(grid, {
      scale: 1 / 6,
      transformOrigin: "40% 40%",
      duration: 0.8,
      ease: "power2.inOut",
    });
    tl.fromTo(
      grid.querySelectorAll("[data-blockframe-block]"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, stagger: 0.02 },
      "<",
    );
  }

  // tl.to(grid.querySelectorAll("[data-blockframe-block]"), {
  //   duration: 1,
  //   scale: 0.1,
  //   y: 60,
  //   yoyo: true,
  //   repeat: 1,
  //   ease: "power1.inOut",
  //   stagger: {
  //     amount: 1.5,
  //     grid: [6, 6], //stagger based on a grid
  //     axis: "both", // x, y, or both
  //     ease: "power1.inOut", // power1.inOut, power2.inOut, etc.
  //     from: "center", // center, edges, random, 0-35, etc.
  //   },
  // });

  return tl;
}
