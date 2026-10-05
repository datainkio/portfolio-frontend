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
  // Layout
  header: "global-header",

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
 * which also holds the gels and the pixelator.
 */
export const VIDEO_SELECTORS = {
  media: "video",
};

export const PROJECT_HEADER_SELECTORS = {
  header: "[data-project-header]",
  image: "[data-project-header-image]",
};

export const HERO_SELECTORS = {
  elementAttribute: "data-hero-el",
  header: "header",
  title: "heading",
  // Opaque legibility band inside the title. SplitText's deepSlice clones it
  // once per line, so after the split each line holds its own band.
  band: "band",
  context: "context",
  missionStatement: "mission-statement",
};

export const PROCESS_SELECTORS = {
  elementAttribute: "data-process-el",
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
