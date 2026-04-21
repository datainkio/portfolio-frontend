/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.registry
 *   role: Frontend runtime module: js/choreography/sections/registry.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/**
 * Section Registry - Canonical section definitions
 *
 * Centralized mapping of section identifiers to their controller classes.
 * Enables scalable section initialization and discovery in AnimationDirector.
 *
 * This pattern reduces boilerplate in Director and makes adding new sections
 * straightforward: just add an entry here and Director auto-discovers it.
 *
 * USAGE:
 * import { SECTION_REGISTRY } from './sections/registry.js';
 *
 * // Initialize all sections
 * Object.entries(SECTION_REGISTRY).forEach(([id, SectionClass]) => {
 *   sections[id] = new SectionClass({ bus, reducedMotionHandler });
 * });
 *
 * @fileoverview Centralized section controller registry
 */

import Hero from "./hero/Hero.js";
import Bio from "./bio/Bio.js";
import BackgroundVideo from "./background/BackgroundVideo.js";
import Awards from "./awards/Awards.js";
import Organizations from "./organizations/Organizations.js";

/**
 * SECTION_REGISTRY - Canonical section definitions
 *
 * Maps section IDs to their controller classes. Used by AnimationDirector
 * to auto-discover and initialize sections.
 *
 * Properties:
 * - Key: Section identifier (must match HTML element IDs)
 * - Value: Section controller class (extends AbstractSection)
 *
 * To add a new section:
 * 1. Create SectionClass extending AbstractSection
 * 2. Add entry: mySection: MySection
 * 3. AnimationDirector auto-discovers and initializes it
 */
export const SECTION_REGISTRY = {
  hero: Hero,
  video: BackgroundVideo,
  bio: Bio,
  awards: Awards,
  organizations: Organizations,
};

/**
 * Helper: Get section display name
 * @param {string} sectionId - Section identifier
 * @returns {string} Human-readable name
 */
export function getSectionName(sectionId) {
  const names = {
    hero: "Hero Section",
    video: "Background Video",
    bio: "Biography Section",
    awards: "Awards Section",
    organizations: "Organizations Section",
  };
  return names[sectionId] || sectionId;
}

/**
 * Helper: Get all section IDs
 * @returns {string[]} Array of registered section identifiers
 */
export function getSectionIds() {
  return Object.keys(SECTION_REGISTRY);
}

/**
 * Helper: Check if section is registered
 * @param {string} sectionId - Section identifier
 * @returns {boolean} True if section is registered
 */
export function isSectionRegistered(sectionId) {
  return sectionId in SECTION_REGISTRY;
}
