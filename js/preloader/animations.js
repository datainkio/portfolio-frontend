/**
 * ---
 * aix:
 *   id: frontend.js.preloader.animations
 *   role: Frontend runtime module: js/preloader/animations.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - animation
 * ---
 */

import {
  PRELOADER_ANIMATION,
  PRELOADER_ANIMATION_MESSAGES,
  PRELOADER_SELECTORS,
  PRELOADER_STATE,
  PRELOADER_STYLE_VALUES,
  PRELOADER_TIMINGS,
} from "./constants.js";

const once = (fn) => {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    fn(...args);
  };
};

export const animateIntro = ({ stack, prefersReduce, trace = () => {} }) => {
  // trace(PRELOADER_ANIMATION_MESSAGES.introStarted);
  if (!stack) return;

  if (typeof window.gsap !== "undefined") {
    const timeline = window.gsap.timeline({
      defaults: {
        duration: PRELOADER_TIMINGS.gsapIntroDuration,
        ease: PRELOADER_ANIMATION.gsapIntroEase,
      },
    });

    timeline.fromTo(
      stack,
      PRELOADER_ANIMATION.introFrom,
      PRELOADER_ANIMATION.introTo,
    );
    return;
  }

  if (prefersReduce) {
    stack.style.opacity = PRELOADER_STYLE_VALUES.opacityVisible;
    stack.style.transform = PRELOADER_ANIMATION.reducedMotionIntroTransform;
    return;
  }

  stack.animate(
    [
      PRELOADER_ANIMATION.introFallbackFrom,
      PRELOADER_ANIMATION.introFallbackTo,
    ],
    {
      duration: PRELOADER_TIMINGS.introFallbackDurationMs,
      easing: PRELOADER_ANIMATION.introFallbackEasing,
      fill: PRELOADER_ANIMATION.fillModeForwards,
    },
  );
};

/**
 * The outro is pure CSS (styles/components/hanko.css), driven entirely by a
 * single state flip on the preloader root. JS does not animate or remove the
 * element here — the landing header persists as the page hero. Flipping
 * `data-preloader-state="exit"` triggers, in CSS: the hanko settles to its
 * fully-lit default, then the hgroup reveals (reusing the hanko intro), then
 * the fixed overlay is dropped so the header sits in normal flow.
 *
 * The hgroup is the last thing to animate, so its `animationend` marks the end
 * of the outro and resolves the promise. Under `prefers-reduced-motion` the
 * global utility forces `animation: none`, so no `animationend` fires — the
 * timeout fallback covers that path.
 */
export const animateExit = ({ preloader, onComplete, trace = () => {} }) =>
  new Promise((resolve) => {
    // trace(PRELOADER_ANIMATION_MESSAGES.exitStarted);
    if (!preloader) {
      resolve();
      return;
    }

    const finish = once(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
      resolve();
    });

    const hgroup = preloader.querySelector(PRELOADER_SELECTORS.hgroup);
    if (hgroup) {
      hgroup.addEventListener("animationend", finish, { once: true });
    }
    setTimeout(finish, PRELOADER_TIMINGS.cssOutroFallbackMs);

    preloader.setAttribute(PRELOADER_STATE.attribute, PRELOADER_STATE.exit);
  });
