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
  hero: "hero",
  organizations: "organizations",
  bio: "introduction",
  awards: "recognition",
  work: "work",
  contact: "contact",

  // GSAP ScrollSmoother containers
  // [ ] REFACTOR: Remove wrapper requirement from GSAP ScrollSmoother containers [refs=#38]
  // Issue URL: https://github.com/datainkio/portfolio-frontend/issues/38
  smoothWrapper: "page-main",
  smoothContent: "page-main-content",

  overlayView: "overlay-view",
  video: "background",
};

export const PROJECT_HEADER_SELECTORS = {
  header: "[data-project-header]",
  image: "[data-project-header-image]",
};

export const BIO_SELECTORS = {
  elementAttribute: "data-bio-el",
  subSectionHook: "sub-section",
  subSectionSelector: '.sub-section, [data-bio-el="sub-section"]',
  subSectionLineKeyAttribute: "data-bio-line-key",
};
