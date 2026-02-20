/**
 * ---
 * aix:
 *   id: frontend.js.choreography.gel-arrangements
 *   role: Frontend runtime module: js/choreography/gel-arrangements.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - gels
 * ---
 */
/** @format */

/**
 * Section-to-gel arrangement mapping.
 *
 * 1:1 mapping contract for MVP:
 * - each section id maps to exactly one arrangement id
 * - arrangement ids are stable keys in GEL_ARRANGEMENTS
 */
export const SECTION_TO_GEL_ARRANGEMENT = {
  video: "video",
  hero: "hero",
  bio: "bio",
  awards: "awards",
};

/**
 * Gel arrangements expressed in viewport-relative units.
 *
 * Schema:
 * {
 *   id: string,
 *   gels: {
 *     [gelId]: {
 *       x: number,      // viewport width fraction [0..1]
 *       y: number,      // viewport height fraction [0..1]
 *       width: number,  // viewport width fraction [0..1]
 *       height: number, // viewport height fraction [0..1]
 *       origin?: string // optional transform-origin
 *     }
 *   }
 * }
 */
export const GEL_ARRANGEMENTS = {
  video: {
    id: "video",
    gels: {
      "bg-gel-0": {
        x: 0.0,
        y: 0.0,
        width: 1.0,
        height: 1.0,
        // origin: "center center",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0.05,
        width: 1.0,
        height: 0.9,
        // origin: "center top",
      },
      "bg-gel-2": {
        x: 0.05,
        y: 0.05,
        width: 0.9,
        height: 0.9,
        // origin: "center center",
      },
    },
  },
  hero: {
    id: "hero",
    gels: {
      "bg-gel-0": {
        x: 0.0,
        y: 0.0,
        width: 1.0,
        height: 1.0,
        // origin: "center center",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0.0,
        width: 0,
        height: 1,
        // origin: "center center",
      },
      "bg-gel-2": {
        x: 0.0,
        y: 0.0,
        width: 1,
        height: 0,
        // origin: "center center",
      },
    },
  },
  bio: {
    id: "bio",
    gels: {
      "bg-gel-0": {
        x: 0.0,
        y: 0.0,
        width: 0.9,
        height: 1.0,
        origin: "left center",
      },
      "bg-gel-1": {
        x: 0.1,
        y: 0.1,
        width: 0.9,
        height: 0.8,
        origin: "right center",
      },
      "bg-gel-2": {
        x: 0.0,
        y: 0.45,
        width: 0.6,
        height: 0.55,
        origin: "left bottom",
      },
    },
  },
  awards: {
    id: "awards",
    gels: {
      "bg-gel-0": {
        x: 0.1,
        y: 0.0,
        width: 0.9,
        height: 1.0,
        origin: "right center",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0.2,
        width: 0.85,
        height: 0.75,
        origin: "left center",
      },
      "bg-gel-2": {
        x: 0.4,
        y: 0.35,
        width: 0.6,
        height: 0.6,
        origin: "right center",
      },
    },
  },
};
