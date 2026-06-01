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
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
  motion,
} from "../../config/index/index.js";
export function createCardScrollClip({
  figure,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
}) {
  const image = figure.querySelector('[data-card-el="image"]');
  if (!image) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: CLEAR.figure });
    gsap.set(image, { clearProps: CLEAR.figureImage });
    return { kill() {} };
  }

  const initialHeight = getViewport().height;
  gsap.set(figure, { overflow: "hidden", willChange: "height" });
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
    scrollTrigger: buildScrollTrigger(
      CARD_FIGURE_CLIP_TRIGGER,
      index,
      triggerEl,
      {
        end: () => `+=${window.innerHeight}`,
        invalidateOnRefresh: true,
      },
    ),
  });

  tl.to(figure, { height: 0, ease: "none" }, 0);
  tl.to(image, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);

  return {
    kill() {
      killST(tl);
      gsap.set(image, { clearProps: CLEAR.figureImage });
      gsap.set(figure, { clearProps: CLEAR.figure });
    },
  };
}
