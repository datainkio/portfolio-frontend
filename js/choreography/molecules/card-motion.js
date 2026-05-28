/**
 * Card-Motion Molecule
 *
 * Encapsulates the scroll-driven animation variants for project cards:
 *
 *   clip  (default) — Scrubbed height collapse on the figure + natural body rise.
 *                     The image is absolutely positioned at its initial dimensions so
 *                     it never scales as the figure shrinks. The card genuinely loses
 *                     height as it exits the viewport.
 *
 *   fade  (md)      — Single-play fade+lift on scroll enter.
 *                     Simpler pattern suited for mid-range breakpoints.
 *
 * The returned object exposes kill() to destroy the internal timeline and its
 * ScrollTrigger. Card.js calls this on breakpoint/reduced-motion transitions.
 *
 * @example
 * const clip = createCardScrollClip({ figure, body, index: 2, triggerEl: root });
 * // on destroy / breakpoint change:
 * clip.kill();
 *
 * const fade = createCardScrollFade({ figure, triggerEl: root });
 * fade.kill();
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
} from "../config/index/index.js";

/**
 * Creates the scrubbed height-collapse + image clip-path variant.
 *
 * The image is absolutely positioned at its initial pixel height so h-full
 * never rescales it as the figure collapses. clip-path on the image provides
 * a GPU-composited mask that hides the bottom in sync with the figure's height
 * tween, preventing any sub-pixel paint artifacts during the scrub.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardScrollClip({ figure, body, index = 0, triggerEl }) {
  const image = figure.querySelector('[data-card-el="image"]');
  const initialHeight = figure.offsetHeight;

  figure.style.willChange = "height";
  gsap.set(figure, { overflow: "hidden" });
  gsap.set(image, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: initialHeight,
    clipPath: "inset(0 0 0% 0)",
    willChange: "clip-path",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_CLIP_TRIGGER,
      id: `${CARD_FIGURE_CLIP_TRIGGER.id}-${index}`,
      trigger: triggerEl,
      end: () => `+=${window.innerHeight}`,
      invalidateOnRefresh: true,
    },
  });

  tl.to(figure, { height: 0, ease: "none" }, 0);
  tl.to(image, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
      gsap.set(image, { clearProps: "all" });
      gsap.set(figure, { clearProps: "height,overflow" });
    },
  };
}

/**
 * Creates the single-play fade+lift variant for mid-range breakpoints.
 *
 * @param {{
 *   figure: Element,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardScrollFade({ figure, triggerEl }) {
  figure.style.willChange = "opacity, transform";
  gsap.set(figure, { autoAlpha: 0, y: 16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 75%",
      once: true,
    },
  });

  tl.to(figure, {
    autoAlpha: 1,
    y: 0,
    duration: 0.48,
    ease: "power2.out",
  });

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
    },
  };
}

/**
 * Creates the scroll-scrubbed parallax variant for md+ breakpoints.
 *
 * Figure moves upward and body drifts downward as the card scrolls through
 * the viewport, creating a depth separation between the image and text layers.
 * Both elements are GPU-promoted via willChange.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ timeline: gsap.core.Timeline, kill(): void }}
 */
export function createCardParallax({ figure, body, index = 0, triggerEl }) {
  figure.style.willChange = "transform";
  body.style.willChange = "transform";

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_PARALLAX_TRIGGER,
      id: `${CARD_FIGURE_PARALLAX_TRIGGER.id}-${index}`,
      trigger: triggerEl,
    },
  });

  tl.fromTo(figure, { yPercent: 0 }, { yPercent: 0, ease: "none" }, 0);
  tl.fromTo(body, { yPercent: 0 }, { yPercent: -25, ease: "none" }, 0);

  return {
    timeline: tl,
    kill() {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      figure.style.willChange = "";
      body.style.willChange = "";
    },
  };
}
