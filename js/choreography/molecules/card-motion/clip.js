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
import { clipRevealOut } from "../../atoms/clip-reveal/clip-reveal.js";
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

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: figure,
      start: "top top",
      end: "bottom -=1500px",
      pin: true,
      pinSpacing: false,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.addLabel("intro");
  tl.add(createIntroTimeline(figure, image));
  tl.addLabel("inter");
  tl.add(createInterTimeline(figure, image));
  tl.addLabel("outro");
  tl.add(createOutroTimeline(figure, image));

  if (isReducedMotion(reduceMotion)) {
    gsap.set(figure, { clearProps: CLEAR.figure });
    gsap.set(image, { clearProps: CLEAR.figureImage });
    return { kill() {} };
  }

  setDefaults(figure, body);

  return {
    kill() {
      killST(tl);
      gsap.set(image, { clearProps: CLEAR.figureImage });
      gsap.set(figure, { clearProps: CLEAR.figure });
    },
  };
}

function setDefaults(figure, body) {
  const initialHeight = getViewport().height;
  gsap.set([figure], { y: initialHeight });
}

function createIntroTimeline(figure, image) {
  const initialHeight = getViewport().height;

  const tl = gsap.timeline();
  // tl.to(figure, { height: 0, ease: "none" }, 0);
  tl.to(figure, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);
  tl.to(image, { scale: 1.1, ease: "none" }, 0);
  return tl;
}

function createInterTimeline(figure, image) {
  const tl = gsap.timeline();
  return tl;
  //   const figure = article.querySelector('[data-card-el="figure"]');
  //   const image = article.querySelector('[data-card-el="image"]');
  //   const initialHeight = getViewport().height;
  //   gsap.set([figure, image], { y: initialHeight });
  //   const tl = gsap.timeline();
  //   tl.to(figure, { height: 0, ease: "none" }, 0);
  //   tl.to(image, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);
  //   return tl;
  // }
}

function createOutroTimeline(figure, image) {
  const tl = gsap.timeline();
  return tl;
}

const getViewport = () => {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
  };
};
