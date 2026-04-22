/**
 * Section lead line display defaults.
 *
 * Defines connector points and visual tokens used by LineManager.
 *
 * Points are interpreted in start/end pairs:
 * [start0, end0, start1, end1, ...]
 * Each pair creates one connector line.
 */
import { SELECTORS } from "../contracts/selectors.js";

export const SECTION_LEAD_LINE_POINTS = Object.freeze([
  Object.freeze({
    id: SELECTORS.hero + "-out",
    section: SELECTORS.hero,
    element: "#hero-title",
    x: "50%",
    y: "100%",
  }),
  Object.freeze({
    id: SELECTORS.bio + "-in",
    section: SELECTORS.bio,
    element: "#introduction h2",
    x: "66%",
    y: "0%",
  }),
  Object.freeze({
    id: SELECTORS.bio + "-out",
    section: SELECTORS.bio,
    element: "#introduction",
    x: "80%",
    y: "100%",
  }),
  Object.freeze({
    id: SELECTORS.awards + "-in",
    section: SELECTORS.awards,
    element: "#recognition",
    x: "0%",
    y: "0%",
  }),
  Object.freeze({
    id: SELECTORS.awards + "-out",
    section: SELECTORS.awards,
    element: "#recognition",
    x: "80%",
    y: "100%",
  }),
  Object.freeze({
    id: SELECTORS.work + "-in",
    section: SELECTORS.work,
    element: "#work",
    x: "0%",
    y: "0%",
  }),
  Object.freeze({
    id: SELECTORS.work + "-out",
    section: SELECTORS.work,
    element: "#work",
    x: "80%",
    y: "100%",
  }),
  Object.freeze({
    id: SELECTORS.organizations + "-in",
    section: SELECTORS.organizations,
    element: "#organizations",
    x: "0%",
    y: "0%",
  }),
]);

export const SECTION_LEAD_LINE_STYLES = Object.freeze({
  path: "fluid",
  size: 4,
  outline: true,
  startPlug: "behind",
  endPlug: "arrow1",
  // dash: Object.freeze({
  //   len: 10,
  //   gap: 6,
  // }),
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
