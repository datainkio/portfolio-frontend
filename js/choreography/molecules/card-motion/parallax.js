/**
 * Creates the scroll-scrubbed parallax variant for md+ breakpoints.
 *
 * Body drifts upward as the card scrolls through the viewport, creating
 * a depth separation between the image and text layers. Both elements are
 * GPU-promoted via willChange.
 *
 * @param {{
 *   figure: Element,
 *   body: Element,
 *   index?: number,
 *   triggerEl?: Element
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
export function createCardParallax({
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { yPercent: 0, clearProps: "willChange" });
    if (body) gsap.set(body, { yPercent: 0, clearProps: "willChange" });
    return { kill() {} };
  }

  gsap.set([figure, body], { willChange: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: buildScrollTrigger(
      CARD_FIGURE_PARALLAX_TRIGGER,
      index,
      triggerEl,
    ),
  });

  tl.fromTo(body, { yPercent: 0 }, { yPercent: -25, ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set(figure, { clearProps: "willChange" });
      gsap.set(body, { clearProps: "yPercent,willChange" });
    },
  };
}
