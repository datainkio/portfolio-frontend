import { SCREENS } from "../../../../breakpoints.config.js";

export const TAILWIND_BREAKPOINTS = Object.freeze({ ...SCREENS });

// Derive min/max matchMedia condition strings from the shared breakpoint
// values instead of hardcoding a second, parallel set of numbers.
const ORDER = ["sm", "md", "lg", "xl"];
const remValue = (token) => parseFloat(token);
const justUnder = (token) => (remValue(token) - 0.001).toFixed(3) + "rem";

const conditions = {
  base: `(max-width: ${justUnder(SCREENS.sm)})`,
};
ORDER.forEach((key, i) => {
  const next = ORDER[i + 1];
  conditions[key] = next
    ? `(min-width: ${SCREENS[key]}) and (max-width: ${justUnder(SCREENS[next])})`
    : `(min-width: ${SCREENS[key]})`;
});

export const BREAKPOINT_MATCH_MEDIA_CONDITIONS = Object.freeze({
  ...conditions,
  reduceMotion: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
});

const BREAKPOINT_PRIORITY = Object.freeze(["xl", "lg", "md", "sm", "base"]);

export function getActiveBreakpoint(conditions = {}) {
  const matched = BREAKPOINT_PRIORITY.find((key) => conditions[key]);
  // console.log("getActiveBreakpoint", { conditions, matched });
  return matched ?? "base";
}
