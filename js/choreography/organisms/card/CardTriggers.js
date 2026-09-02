import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";

export const CARD_DEAL_TRIGGER = {
  ...SCROLL_DEFAULTS,
  start: "top top",
  end: "bottom -=1500px",
  pin: true,
  pinSpacing: true,
  scrub: 5,
  invalidateOnRefresh: true,
};

/**
 * Card Figure Clip Trigger Defaults
 *
 * Drives a synchronized height collapse (figure) and clip-path scrub (image).
 * pinSpacing: false — the card's actual height shrinks during the animation,
 * so no extra scroll space should be reserved by the pin.
 */
export const CARD_FIGURE_CLIP_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "card-figure-clip",
  // once: false overrides SCROLL_DEFAULTS so the clip reverses on scroll-back
  pin: true,
  pinSpacing: true,
  once: false,
  start: "top top",
  scrub: true,
};

/**
 * Card Figure Parallax Trigger Defaults
 *
 * Drives a scroll-scrubbed parallax split between the card figure and body.
 * No pin — both elements shift in opposite directions as the card scrolls
 * through the viewport, creating a depth separation effect.
 * Covers the full in-viewport range: top-of-card at viewport-bottom to
 * bottom-of-card at viewport-top.
 */
export const CARD_FIGURE_PARALLAX_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "card-figure-parallax",
  once: false,
  start: "top bottom",
  end: "bottom top",
  scrub: true,
  pin: false,
  pinSpacing: false,
  invalidateOnRefresh: true,
};
