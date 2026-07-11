import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

/**
 * Fills the hidden cells of the Bio 6x6 Blockframes grid with clones of the
 * library blocks named by each cell's `data-blockframe-block` attribute. The
 * visible r3c3 cell is inlined at build time (bio.njk) and never touched here;
 * every filled cell sits outside the wrapper's overflow crop and is held at
 * autoAlpha 0 by the reveal timeline until its zoom-out stage, so this is
 * zero-visual-impact and safe to fire-and-forget — the caller owns the
 * `.catch()`.
 *
 * Idempotent across matchMedia/resize rebuilds: cells that already contain an
 * svg are skipped. Reduced motion never reaches this code (the profile system
 * swaps Bio to the `reduced` variant, which calls no builders), so the CDN
 * dependencies below never load for reduced-motion visitors.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {Promise<void>}
 */
export async function fillBlockframesGrid(view) {
  const wrapper = view?.querySelector(`[${BIO_EL_ATTR}="blockframes"]`) ?? null;
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
    primary: { light: "#e0f2fe", base: "#0ea5e9", dark: "#0c4a6e" },
    secondary: { light: "#fce7f3", base: "#ec4899", dark: "#831843" },
    neutral: { light: "#f5f5f5", base: "#737373", dark: "#171717" },
    accent: { light: "#fef3c7", base: "#f59e0b", dark: "#78350f" },
    semantic: { alert: "#f5f5f5", success: "#737373", fail: "#171717" },
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
    // Builder.insert emits the svg without a viewBox, and its scale/move
    // math leaves content at unpredictable coordinates (library blocks are
    // drawn at absolute canvas positions, e.g. Blog at x≈1297). Frame the
    // viewBox on the measured content bbox instead — the svg is in the DOM
    // by now and getBBox is unaffected by opacity.
    const svg = cell.querySelector("svg");
    const bbox = svg?.getBBox();
    if (bbox?.width && bbox?.height) {
      svg.setAttribute(
        "viewBox",
        `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`,
      );
    }
  });
}
