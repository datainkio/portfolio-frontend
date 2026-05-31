/** @format */

export const SECTION_TO_GEL_ARRANGEMENT = {
  hero: "hero",
  bio: "bio",
  awards: "awards",
};

/**
 * Gel Arrangement Transition Defaults
 */
export const GEL_ARRANGEMENT_TRANSITION = {
  duration: 0.8,
  ease: "power2.inOut",
  refreshOnUpdate: true,
};

/**
 * Color Classes
 */

export const GEL_ARRANGEMENTS = {
  hero: {
    id: "hero",
    gels: {
      "bg-gel-0": {
        x: 0.0,
        y: 0.0,
        width: 1.0,
        height: 1.0,
        origin: "top center",
        blendMode: "multiply",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0,
        width: 0.0,
        height: 0.0,
        blendMode: "screen",
      },
      "bg-gel-2": {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 0,
        origin: "left center",
        blendMode: "multiply",
      },
      "bg-gel-3": {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 0,
        origin: "left center",
        blendMode: "multiply",
      },
      "bg-gel-4": {
        x: 0.0,
        y: 0.0,
        width: 0.5,
        height: 1.0,
        origin: "left center",
        blendMode: "normal",
      },
    },
  },
  hero_outro: {
    id: "hero_outro",
    gels: {
      "bg-gel-0": {
        x: 0.0,
        y: 0.0,
        width: 1.0,
        height: 0.5,
        origin: "top center",
        blendMode: "multiply",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0,
        width: 0.0,
        height: 0.0,
        blendMode: "screen",
      },
      "bg-gel-2": {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 0,
        origin: "left center",
        blendMode: "multiply",
      },
      "bg-gel-3": {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 0,
        origin: "left center",
        blendMode: "multiply",
      },
      "bg-gel-4": {
        x: 0.0,
        y: 0.0,
        width: 0.5,
        height: 1.0,
        origin: "left center",
        blendMode: "normal",
      },
    },
  },
  bio: {
    id: "bio",
    gels: {
      "bg-gel-1": {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        origin: "left center",
        blendMode: "darken",
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
        blendMode: "multiply",
      },
      "bg-gel-1": {
        x: 0.0,
        y: 0.2,
        width: 0.85,
        height: 0.75,
        origin: "left center",
        blendMode: "multiply",
      },
      "bg-gel-2": {
        x: 0.4,
        y: 0.35,
        width: 0.6,
        height: 0.6,
        origin: "right center",
        blendMode: "multiply",
      },
      "bg-gel-3": {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 1,
        origin: "left center",
        blendMode: "multiply",
      },
    },
  },
};
