// Keep these values aligned with tailwind.config.js screens.
export const TAILWIND_BREAKPOINTS = Object.freeze({
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
});

export const BREAKPOINT_MATCH_MEDIA_CONDITIONS = Object.freeze({
  base: "(max-width: 39.999rem)",
  sm: "(min-width: 40rem) and (max-width: 47.999rem)",
  md: "(min-width: 48rem) and (max-width: 63.999rem)",
  lg: "(min-width: 64rem) and (max-width: 79.999rem)",
  xl: "(min-width: 80rem)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
});

const BREAKPOINT_PRIORITY = Object.freeze(["xl", "lg", "md", "sm", "base"]);

export function getActiveBreakpoint(conditions = {}) {
  const matched = BREAKPOINT_PRIORITY.find((key) => conditions[key]);
  console.log("getActiveBreakpoint", { conditions, matched });
  return matched ?? "base";
}
