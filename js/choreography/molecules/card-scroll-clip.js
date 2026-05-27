/**
 * Card-Scroll-Clip Molecule
 *
 * Encapsulates the two scroll-driven animation variants for project cards:
 *
 *   clip  (default, lg+) — Scrubbed clip-path on the figure + matching body translate.
 *                          The figure clips bottom-to-top as the card exits the viewport.
 *                          Both figure and body are promoted to compositor layers.
 *
 *   fade  (md)           — Single-play fade+lift on scroll enter.
 *                          Simpler pattern suited for mid-range breakpoints.
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
import { CARD_FIGURE_CLIP_TRIGGER } from "../config/index/index.js";

/**
 * Creates the scrubbed clip-path + body-translate variant.
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
  figure.style.willChange = "clip-path";
  body.style.willChange = "transform";

  gsap.set(figure, { clipPath: "inset(0 0 0% 0)" });
  gsap.set(body, { y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      ...CARD_FIGURE_CLIP_TRIGGER,
      id: `${CARD_FIGURE_CLIP_TRIGGER.id}-${index}`,
      trigger: triggerEl,
      end: () => `+=${window.innerHeight}`,
    },
  });

  tl.to(figure, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);
  tl.to(body, { y: () => -window.innerHeight, ease: "none" }, 0);

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
