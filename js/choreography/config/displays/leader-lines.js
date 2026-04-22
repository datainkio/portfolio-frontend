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
      x: "50%",
      y: "100%",
    }),
    terminus: Object.freeze({
      element: "#hero-title",
      x: "0%",
      y: "50%",
    }),
  }),
  [SELECTORS.bio]: Object.freeze({
    origin: Object.freeze({
      element: "#introduction",
      x: "100%",
      y: "85%",
    }),
    terminus: Object.freeze({
      element: "#introduction",
      x: "15%",
      y: "0%",
    }),
  }),
  [SELECTORS.awards]: Object.freeze({
    origin: Object.freeze({
      element: "#recognition",
      x: "100%",
      y: "85%",
    }),
    terminus: Object.freeze({
      element: "#recognition",
      x: "0%",
      y: "0%",
    }),
  }),
  [SELECTORS.work]: Object.freeze({
    origin: Object.freeze({
      element: "#work",
      x: "80%",
      y: "100%",
    }),
    terminus: Object.freeze({
      element: "#work",
      x: "20%",
      y: "0%",
    }),
  }),
  [SELECTORS.organizations]: Object.freeze({
    origin: Object.freeze({
      element: "#organizations",
      x: "80%",
      y: "100%",
    }),
    terminus: Object.freeze({
      element: "#organizations",
      x: "20%",
      y: "0%",
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
  origin: Object.freeze({
    x: "85%",
    y: "100%",
  }),
  terminus: Object.freeze({
    x: "15%",
    y: "0%",
  }),
  showEffect: "draw",
  showAnimOptions: Object.freeze({
    duration: ANIMATION_DEFAULTS.duration,
  }),
});
