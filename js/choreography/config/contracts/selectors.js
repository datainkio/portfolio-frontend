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
  hero: "hero",
  organizations: "organizations",
  bio: "introduction",
  awards: "recognition",
  work: "work",
  contact: "contact",

  // GSAP ScrollSmoother containers
  // TODO: Optimize design to avoid these wrappers, which add complexity to DOM and animations
  // Issue URL: https://github.com/datainkio/portfolio-frontend/issues/38
  smoothWrapper: "page-main",
  smoothContent: "page-main-content",

  overlayView: "overlay-view",
  video: "background",
};

export const BIO_SELECTORS = {
  elementAttribute: "data-bio-el",
  subSectionHook: "sub-section",
  subSectionSelector: '.sub-section, [data-bio-el="sub-section"]',
  subSectionLineKeyAttribute: "data-bio-line-key",
};
