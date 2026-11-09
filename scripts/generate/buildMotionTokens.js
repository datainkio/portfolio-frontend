/** @format */

/**
 * Mirrors the choreography motion tokens into CSS, so CSS transitions and GSAP
 * can read one source. js/choreography/tokens/motion/motion.js stays the
 * authority; styles/motion.css is generated from it.
 *
 * USAGE:
 *   npm run build:motion          write styles/motion.css
 *   npm run check:motion          exit 1 if styles/motion.css differs from a
 *                                 fresh build (hand-edited or stale); never writes
 */

import fs from "node:fs";
import path from "node:path";
import { projectRoot } from "../lib/paths.js";
import { motionTokens } from "../../js/choreography/tokens/motion/motion.js";

const rows = (prefix, group, format = (v) => v) =>
  Object.entries(group).map(([k, v]) => `  --${prefix}-${k}: ${format(v)};`);

const css = `/** @format */
/**
 * @fileoverview Motion tokens generated from js/choreography/tokens/motion/motion.js.
 * Do not edit by hand; change the JS tokens and run npm run build:motion.
 */

@theme {
${[
  ...rows("transition-duration", motionTokens.duration, (ms) => `${ms}ms`),
  ...rows("ease", motionTokens.ease),
].join("\n")}
}
`;

const target = path.join(projectRoot, "styles/motion.css");

if (process.argv.includes("--check")) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (current !== css) {
    console.error(
      "styles/motion.css differs from a fresh build of js/choreography/tokens/motion/motion.js.\n" +
        "It's generated: change motion.js, then run npm run build:motion.",
    );
    process.exit(1);
  }
  console.log("styles/motion.css matches a fresh build");
} else {
  fs.writeFileSync(target, css);
  console.log("Wrote styles/motion.css");
}
