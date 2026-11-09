/**
 * Creates the scroll-scrubbed image parallax for a clipping band.
 *
 * The band scrolls with the page; its image travels `-yPercent` → `+yPercent`
 * of its own height across the trigger range, so it drifts slower than the band
 * that clips it. The image must bleed past the band by more than that travel
 * (see molecules/band).
 *
 * Reduced motion resets the image and returns a no-op handle.
 *
 * @param {{
 *   band: Element,
 *   image: Element|null,
 *   trigger: object,
 *   yPercent: number,
 *   index?: number,
 *   reduceMotion?: boolean
 * }} param0
 * @returns {{ kill(): void }}
 */
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

export function createBandParallax({
  band,
  image,
  trigger,
  yPercent,
  index = 0,
  reduceMotion,
}) {
  if (!band || !image) return { kill() {} };

  if (isReducedMotion(reduceMotion)) {
    gsap.set(image, { yPercent: 0, clearProps: "willChange" });
    return { kill() {} };
  }

  gsap.set(image, { willChange: "transform" });

  const tween = gsap.fromTo(
    image,
    { yPercent: -yPercent },
    {
      yPercent,
      ease: "none",
      scrollTrigger: {
        ...trigger,
        id: `${trigger.id}-${index}`,
        trigger: band,
      },
    },
  );

  return {
    kill() {
      tween.scrollTrigger?.kill(true);
      tween.kill();
      gsap.set(image, { yPercent: 0, clearProps: "willChange" });
    },
  };
}
