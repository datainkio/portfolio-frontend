/**
 * Ruler display defaults
 *
 * Centralized defaults for the ruler display so tuning values
 * are defined in one place and reused by the runtime module.
 */
export const RULER_DEFAULTS = Object.freeze({
  intervals: 12,
  subticksPerInterval: 6,
  height: 48,
  paddingTop: 4,
  paddingBottom: 6,
  tickHeight: 20,
  subtickHeight: 10,
  labelGap: 2,
  startAt: 0,
  step: 1,
  strokeWidth: 1,
  fontSize: 12,
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  color: "#FFFFFF",
});
