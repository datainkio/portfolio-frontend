import { PROCESS_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const PROCESS_EL_ATTR = PROCESS_SELECTORS.elementAttribute;

// Resolve a design-system color token (e.g. "primary-500") to its hex value by
// reading the live CSS custom property. Keeps the painted blocks in sync with
// the tokens in styles/colors.css instead of hardcoding a hex.
const tokenColor = (name) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();

/**
 * Fills the hidden cells of the Process 6x6 Blockframes grid with clones of the
 * library blocks named by each cell's `data-blockframe-block` attribute. The
 * visible r3c3 cell is inlined at build time (process.njk) and never touched
 * here; every filled cell sits outside the wrapper's overflow crop and is held
 * at autoAlpha 0 by the reveal timeline until its zoom-out stage, so this is
 * zero-visual-impact and safe to fire-and-forget — the caller owns the
 * `.catch()`.
 *
 * Idempotent across matchMedia/resize rebuilds: cells that already contain an
 * svg are skipped. Reduced motion never reaches this code (the profile system
 * swaps Process to the `reduced` variant, which calls no builders), so the CDN
 * dependencies below never load for reduced-motion visitors.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {Promise<void>}
 */
export async function fillBlockframesGrid(view) {
  const wrapper =
    view?.querySelector(`[${PROCESS_EL_ATTR}="blockframes"]`) ?? null;
  if (!wrapper) return;

  const cells = [...wrapper.querySelectorAll("[data-blockframe-block]")].filter(
    (cell) => !cell.querySelector("svg"),
  );
  if (!cells.length) return;

  // Non-literal specifier on purpose: buildChoreography.js aliases literal
  // "/assets/js/..." imports (static AND dynamic) into the bundle, where the
  // package's https CDN imports (gsap, SVG.js) can't resolve. A variable
  // specifier is left verbatim by esbuild and resolves at runtime via the
  // Eleventy js -> assets/js passthrough.
  const src = "/assets/js/displays/blockframes/Blockframes.js";
  const { default: Blockframes } = await import(src);

  const frames = new Blockframes("/assets/svg/blockframes.svg");
  await frames.load();

  const palette = {
    primary: {
      light: tokenColor("primary-100"),
      base: tokenColor("primary-500"),
      dark: tokenColor("primary-900"),
    },
    secondary: {
      light: tokenColor("secondary-100"),
      base: tokenColor("secondary-500"),
      dark: tokenColor("secondary-900"),
    },
    neutral: {
      light: tokenColor("neutral-100"),
      base: tokenColor("neutral-500"),
      dark: tokenColor("neutral-900"),
    },
    accent: {
      light: tokenColor("accent-100"),
      base: tokenColor("accent-500"),
      dark: tokenColor("accent-900"),
    },
    semantic: {
      alert: tokenColor("neutral-100"),
      success: tokenColor("neutral-500"),
      fail: tokenColor("neutral-900"),
    },
  };

  cells.forEach((cell) => {
    // Scope to direct children of .Blocks — class names like Header/Vector
    // recur nested inside blocks and would match an unscoped query first.
    const block = frames.getBlock(`.Blocks > .${cell.dataset.blockframeBlock}`);
    if (!block) return;
    frames.placeBlock(block, cell, true);
    // Paint the clone that Builder.insert placed in the cell, not the shared
    // library original: placeBlock clones `block` before paint would run, so
    // painting `block` here leaves every first-use cell colorless. The insert
    // wraps the clone in a fresh svg whose firstElementChild is the cloned
    // `.Name` group with its class list intact, so Painter routing still works.
    const placed = cell.querySelector("svg")?.firstElementChild;
    if (placed) frames.paintBlock(placed, palette);
  });
}
