/**
 * Section lead line display defaults.
 *
 * Centralizes visual styling and theme-token mapping used by LandingSequence
 * when drawing LeaderLine connectors between sections.
 */
export const SECTION_LEAD_LINE_STYLES = Object.freeze({
  path: "fluid",
  size: 2,
  outline: true,
  startPlug: "behind",
  endPlug: "arrow1",
  dash: Object.freeze({
    len: 10,
    gap: 6,
  }),
});

export const SECTION_LEAD_LINE_ANCHORS = Object.freeze({
  start: Object.freeze({
    x: "50%",
    y: "100%",
  }),
  end: Object.freeze({
    x: "50%",
    y: 0,
  }),
});

export const SECTION_LEAD_LINE_THEME = Object.freeze({
  stroke: Object.freeze({
    variableName: "--color-accent-400",
  }),
  outline: Object.freeze({
    variableName: "--color-primary-950",
    fallback: "rgba(7, 48, 74, 0.85)",
  }),
});
