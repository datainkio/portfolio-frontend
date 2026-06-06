/**
 * Creates the single-play fade+lift variant for mid-range breakpoints.
 *
 * @param {{
 *   figure: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
  motion,
} from "../../config/index/index.js";
export function createCardScrollFade({
  figure,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { autoAlpha: 1, y: 0 });
    return { kill() {} };
  }

  gsap.set(figure, { autoAlpha: 0, y: 16, willChange: "opacity, transform" });

  const tl = gsap.timeline({
    scrollTrigger: {
      id: `card-scroll-fade-${index}`,
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
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "willChange" });
    },
  };
}
