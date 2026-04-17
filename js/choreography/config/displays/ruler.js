/**
 * Ruler display defaults
 *
 * Centralized defaults for the ruler display so tuning values
 * are defined in one place and reused by the runtime module.
 */

// TODO: Review value of using Object.freeze for these config objects. It prevents mutation but also prevents extension, which could be a problem if we want to allow users to add custom tokens or other values.
// Issue URL: https://github.com/datainkio/portfolio-frontend/issues/39
export const RULER_DEFAULTS = Object.freeze({
  intervals: 12,
  subticksPerInterval: 6,
  startAt: 0,
  step: 1,
  rootClasses:
    "ruler w-full h-6 sm:h-10 md:h-12 pt-1 sm:pt-2 pb-1 sm:pb-2 text-white text-xs font-mono [--ruler-tick-height:24] sm:[--ruler-tick-height:28] md:[--ruler-tick-height:32] [--ruler-subtick-height:8] sm:[--ruler-subtick-height:9] md:[--ruler-subtick-height:10] [--ruler-label-gap:2]",
  svgClasses: "block w-full select-none",
  baselineClasses:
    "stroke-current [stroke-width:1px] [vector-effect:non-scaling-stroke] [shape-rendering:geometricPrecision]",
  majorTickClasses:
    "stroke-current [stroke-width:1px] [vector-effect:non-scaling-stroke] [shape-rendering:geometricPrecision]",
  minorTickClasses:
    "stroke-current [stroke-width:1px] [vector-effect:non-scaling-stroke] [shape-rendering:geometricPrecision] [&.tick-odd]:opacity-0 sm:[&.tick-odd]:opacity-100",
  labelClasses: "fill-current font-mono",
});

/**
 * Scroll-triggered intro animation defaults for the ruler display.
 */
export const RULER_INTRO_DEFAULTS = Object.freeze({
  selectorTrigger: "#section-cap-anchor",
  selectorRulerContainer: "#ruler-wrap",
  selectorSvg: "svg",
  selectorBaseline: "[data-ruler-baseline]",
  selectorTargets: "line:not([data-ruler-baseline]), text",
  start: "top 25%",
  once: true,
  durationToken: "base",
  staggerAmountToken: "slow",
  staggerOrder: "start",
  easeToken: "enter",
});
