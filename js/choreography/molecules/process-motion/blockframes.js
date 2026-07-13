import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { PROCESS_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const PROCESS_EL_ATTR = PROCESS_SELECTORS.elementAttribute;

// Resolve a design-system color token (e.g. "primary-500") to its hex value by
// reading the live CSS custom property. Keeps motion in sync with the tokens in
// styles/colors.css instead of hardcoding a hex.
const tokenColor = (name) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();

// Stable id so rebuilds (matchMedia / resize re-invoke the variant) can kill the
// prior instance instead of stacking duplicate triggers.
const BLOCKFRAMES_REVEAL_ST_ID = "process-blockframes-reveal";

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
  const wrapper =
    view?.querySelector(`[${PROCESS_EL_ATTR}="blockframes"]`) ?? null;
  // Scope to the visible cell: the wrapper is a 12×3 grid and the 35 hidden
  // cells gain their own svgs at runtime (blockframes-grid.js), some of which
  // precede the visible cell in DOM order.
  const svg =
    wrapper?.querySelector(`[${PROCESS_EL_ATTR}="blockframes-visible"] svg`) ??
    null;
  if (!wrapper || !svg) return null;

  // Idempotent across rebuilds: kill the prior trigger before creating a fresh
  // one so matchMedia/resize re-invocations don't stack duplicates.
  ScrollTrigger.getById(BLOCKFRAMES_REVEAL_ST_ID)?.kill();
  // Drop any prior connector overlay so rebuilds don't stack SVGs.
  wrapper.querySelector(`[${PROCESS_EL_ATTR}="blockframes-line"]`)?.remove();

  const tl = gsap.timeline({
    scrollTrigger: {
      id: BLOCKFRAMES_REVEAL_ST_ID,
      trigger: wrapper,
      start: "center center",
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

  // 4. Zoom out: once the Basic fade-in settles, uniformly scale the 12×3
  //    grid to 1/12 while one randomly chosen hidden cell fades in (the rest
  //    stay hidden — leaving the main block + one second block). Scaling
  //    1 -> 1/12 fits the grid to the wrapper width, revealing a full-width
  //    band ~1/4 the wrapper height; origin 45.4545%/50% (ox=5/11 lands it
  //    flush-left/full-width since the grid sits at -500%; oy=0.5 centers the
  //    band vertically).
  const grid = wrapper.querySelector(`[${PROCESS_EL_ATTR}="blockframes-grid"]`);
  if (grid) {
    const hiddenCells = [...grid.querySelectorAll("[data-blockframe-block]")];
    // Pick one; gsap.utils.random(array) returns a random element.
    const chosen = gsap.utils.random(hiddenCells);

    // Hold every hidden cell out of view up front; only the chosen one is
    // revealed. Without this the non-chosen cells render at their native
    // autoAlpha:1 once stage 4 no longer tweens them from 0.
    gsap.set(hiddenCells, { autoAlpha: 0 });

    tl.to(grid, {
      scale: 1 / 12,
      transformOrigin: "45.4545% 50%",
      duration: 0.8,
      ease: "power2.inOut",
    });
    if (chosen) {
      tl.fromTo(chosen, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<");
    }

    // 5. Connector: once both blocks are settled in view (once:true => layout
    //    is static), draw a curved cubic-Bezier line between the main block and
    //    the revealed cell. Measured at timeline completion so the endpoints
    //    reflect post-zoom positions. Decorative overlay (aria-hidden); JS binds
    //    to the data-attr, never a class.
    const SVG_NS = "http://www.w3.org/2000/svg";

    const drawConnector = () => {
      if (!chosen) return;

      const mainEl =
        wrapper.querySelector(`[${PROCESS_EL_ATTR}="blockframes-visible"]`) ??
        svg.parentElement;
      const chosenEl = chosen;
      if (!mainEl || !chosenEl) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const rectOf = (el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        return {
          cx: r.left - wrapperRect.left + r.width / 2,
          cy: r.top - wrapperRect.top + r.height / 2,
          hw: r.width / 2,
          hh: r.height / 2,
        };
      };

      const a = rectOf(mainEl);
      const b = rectOf(chosenEl);
      if (!a || !b) return;

      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;

      // Point where the center-to-center ray exits an axis-aligned box.
      const edge = (box, vx, vy) => {
        if (vx === 0 && vy === 0) return { x: box.cx, y: box.cy };
        const t = 1 / Math.max(Math.abs(vx) / box.hw, Math.abs(vy) / box.hh);
        return { x: box.cx + vx * t, y: box.cy + vy * t };
      };

      const p0 = edge(a, dx, dy); // main block edge facing the second block
      const p1 = edge(b, -dx, -dy); // second block edge facing the main block

      const k = Math.min(Math.hypot(p1.x - p0.x, p1.y - p0.y) / 2, 150);
      const dir = Math.sign(p1.x - p0.x) || 1;
      const c1 = { x: p0.x + dir * k, y: p0.y };
      const c2 = { x: p1.x - dir * k, y: p1.y };
      const d = `M ${p0.x},${p0.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;

      const overlay = document.createElementNS(SVG_NS, "svg");
      overlay.setAttribute(PROCESS_EL_ATTR, "blockframes-line");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.overflow = "visible";
      overlay.style.pointerEvents = "none";

      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      // Grid palette primary base — matches the painted blocks.
      path.setAttribute("stroke", tokenColor("primary-500"));
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      overlay.appendChild(path);
      wrapper.appendChild(overlay);

      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    tl.call(drawConnector);
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
