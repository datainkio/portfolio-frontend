/**
 * DOM Selectors
 *
 * Element IDs and classes specific to this site's template structure.
 * These map to elements created in Nunjucks templates (njk/_includes/).
 * The intention is to decouple choreography code from specific
 * template structures, allowing for greater flexibility and design
 * iteration.
 *
 * Update these when:
 * - Changing element IDs in templates
 * - Adapting choreography system to new project
 * - Refactoring page structure
 */
export const SELECTORS = {
  // Section IDs
  organizations: "organizations",
  hero: "manifesto",
  process: "process",
  awards: "awards",
  work: "work",
  contact: "contact",

  // GSAP ScrollSmoother containers
  smoothWrapper: "page-main",
  smoothContent: "page-main-content",

  overlayView: "overlay-view",
  video: "background",
};

/**
 * Background video (`SELECTORS.video` root). The media element is resolved by
 * tag inside that root — the reveal animates the <video> only, never the root,
 * which also holds the gels and the pixelator. `grid` is the element clipped by
 * the intro (a clip-path of revealed cells); it wraps the video, pixelator and gels.
 */
export const VIDEO_SELECTORS = {
  media: "video",
  grid: "[data-video-grid]",
};

// The gel the background video section owns (see BackgroundVideo).
export const VIDEO_GEL_ID = "gel_video";

export const PROJECT_HEADER_SELECTORS = {
  header: "[data-project-header]",
  image: "[data-project-header-image]",
};

export const HERO_SELECTORS = {
  elementAttribute: "data-hero-el",
  header: "header",
  title: "heading",
  // Solid full-bleed plates (molecules/band): one behind the context label +
  // title, which the intro wipes in from the viewport's left edge, and one per
  // statement after the first. Each may hold a parallax `bandImage`.
  band: "band",
  bandImage: "band-image",
  context: "context",
  missionStatement: "mission-statement",
  // Inline prepared SVG inside a statement's figure; its top-level <g>s are
  // revealed in source order as the statement scrolls into view
  // (molecules/svg-reveal).
  statementSvg: "statement-svg",
};

export const PROCESS_SELECTORS = {
  elementAttribute: "data-process-el",
};

/**
 * Badge (organisms/header/badge.njk): the fixed button that opens the
 * site-map dialog, and the dialog's close button.
 */
export const BADGE_SELECTORS = {
  elementAttribute: "data-badge-el",
  toggle: "toggle",
  dialog: "dialog",
  close: "close",
};

export const BUILD_INFO_SELECTORS = {
  elementAttribute: "data-buildinfo-el",
  root: "root",
  toggle: "toggle",
  list: "list",
  close: "close",
  cap: "cap",
  // Presence attribute toggled on the cap <ul> to drive open-state layout (basis)
  // via Tailwind group-data variants.
  openAttribute: "data-open",
};

export const AWARD_SELECTORS = {
  elementAttribute: "data-awards-el",
  context: "context",
  header: "header",
  title: "title",
  subheading: "subheading",
  list: "list",
  organizationCard: "organization-card",
};
