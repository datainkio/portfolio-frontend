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

  // GSAP ScrollSmoother containers
  // TODO: Optimize design to avoid these wrappers, which add complexity to DOM and animations
  smoothWrapper: "smooth-wrapper",
  smoothContent: "smooth-content",

  overlayView: "overlay-view",
  video: "sizzle-background",
  sizzleBackground: "sizzle-background",
};
