/**
 * Motion Config
 *
 * Global motion surface: the motion tokens (defined in tokens/motion/ and
 * re-exported here), the `motion` token accessor, `toSeconds`, and
 * ANIMATION_DEFAULTS. Section motion presets live in ./presets/ — one file per
 * consumer area — and import from here.
 */
export { motionTokens } from "../../tokens/motion/motion.js";
import { motionTokens } from "../../tokens/motion/motion.js";
export const toSeconds = (value) =>
  typeof value === "number" ? value / 1000 : value;

/**
 * GSAP Ease per Motion Token
 *
 * The tokens hold CSS `cubic-bezier()` strings, which GSAP can't parse without
 * CustomEase — it silently falls back to `power1.out`. So `motion.ease()` hands
 * GSAP the nearest core ease instead. The curves are fitted to each token's
 * bezier, weighted to the landing (t ≥ 0.4), where the eye reads an ease.
 * `standard` and `emphasis` start slower than any core ease, so their soft start
 * is lost. CSS consumers still get the exact curves via `styles/motion.css`.
 *
 * Adding a token to `motionTokens.ease` means adding its GSAP name here;
 * `test/choreography/motion-eases.test.js` fails until you do.
 */
export const GSAP_EASE = {
  standard: "power1.out", // cubic-bezier(0.4, 0, 0.2, 1)  landing Δ ≤ 0.04
  enter: "power2.out", // cubic-bezier(0, 0, 0.2, 1)      Δ ≤ 0.04 throughout
  exit: "sine.in", // cubic-bezier(0.4, 0, 1, 1)          Δ ≤ 0.03 throughout
  emphasis: "power2.out", // cubic-bezier(0.3, 0, 0.2, 1.1) landing Δ ≤ 0.07
  springy: "back.out(2)", // cubic-bezier(0.2, 0.8, 0.2, 1.4) Δ ≤ 0.05 throughout
};

export const motion = {
  duration(name = "base") {
    return motionTokens.duration[name] ?? motionTokens.duration.base;
  },
  /** GSAP ease name for a motion token — see GSAP_EASE. Not for CSS. */
  ease(name = "standard") {
    return GSAP_EASE[name] ?? GSAP_EASE.standard;
  },
  distance(name = "md") {
    return motionTokens.distance[name] ?? motionTokens.distance.md;
  },
  stagger(name = "base") {
    return motionTokens.stagger[name] ?? motionTokens.stagger.base;
  },
};

/**
 * Animation Default Settings
 *
 * Base timing and easing values used across all sections.
 *
 * `ease.in` / `ease.out` / `ease.inOut` follow GSAP's sense: `in` accelerates
 * (for exits), `out` decelerates (for arrivals and reveals). They are not
 * "entering" / "leaving" — the `exit` token is the accelerating curve.
 */
export const ANIMATION_DEFAULTS = {
  duration: toSeconds(motion.duration("base")),
  stagger: motion.stagger("base"),
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
    inOut: motion.ease("standard"),
  },
  // translateY: -motion.distance("md"),
  // translateX: -motion.distance("md"),
  overwrite: "auto",
};
