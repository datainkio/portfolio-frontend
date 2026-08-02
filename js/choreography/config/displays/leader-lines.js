/**
 * Section lead line display defaults.
 *
 * Defines connector lines and visual tokens used by LineManager.
 *
 * Each property in SOCKETS defines an origin/terminus socket pair keyed by the id for a section.
 *
 * Socket fields:
 * - element: selector for the anchor element.
 * - x, y: anchor point percentages used by LeaderLine.pointAnchor.
 * - scope (optional): selector or Element used as the query root for `element`.
 *   When omitted, LineManager resolves against its configured root and then document.
 */
import { SELECTORS } from "../contracts/selectors.js";
import { ANIMATION_DEFAULTS } from "../ix/motion.js";

export const SOCKETS = Object.freeze({
  [SELECTORS.hero]: Object.freeze({
    origin: Object.freeze({
      element: "#hero-title",
    }),
    terminus: Object.freeze({
      element: "#hero-title",
    }),
  }),
  [SELECTORS.bio]: Object.freeze({
    origin: Object.freeze({
      element: "#introduction",
    }),
    terminus: Object.freeze({
      element: "#introduction",
    }),
  }),
  [SELECTORS.awards]: Object.freeze({
    origin: Object.freeze({
      element: "#recognition",
    }),
    terminus: Object.freeze({
      element: "#recognition",
    }),
  }),
  [SELECTORS.work]: Object.freeze({
    origin: Object.freeze({
      element: "#work",
    }),
    terminus: Object.freeze({
      element: "#work",
    }),
  }),
  [SELECTORS.organizations]: Object.freeze({
    origin: Object.freeze({
      element: "#organizations",
    }),
    terminus: Object.freeze({
      element: "#organizations",
    }),
  }),
});

export const LINE_STYLES = Object.freeze({
  path: "fluid",
  size: 4,
  outline: true,
  startPlug: "behind",
  endPlug: "arrow1",
  classes: "fill-current stroke-current",
  // dash: Object.freeze({
  //   len: 10,
  //   gap: 6,
  // }),
});

export const BIO_SUB_SECTION_LINE_DEFAULTS = Object.freeze({
  origin: Object.freeze({}),
  terminus: Object.freeze({}),
  showEffect: "draw",
  showAnimOptions: Object.freeze({
    duration: ANIMATION_DEFAULTS.duration,
  }),
});
