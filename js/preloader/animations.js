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

export const animateExit = ({
  preloader,
  stack,
  prefersReduce,
  onComplete,
  trace = () => {},
}) =>
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

    if (typeof window.gsap !== "undefined") {
      const timeline = window.gsap.timeline({
        defaults: {
          duration: PRELOADER_TIMINGS.gsapExitDuration,
          ease: PRELOADER_ANIMATION.gsapExitEase,
        },
      });

      if (stack) {
        timeline.to(stack, PRELOADER_ANIMATION.stackExitTo, 0);
      }
      timeline.to(preloader, { autoAlpha: 0 }, 0).add(finish);
      return;
    }

    if (prefersReduce) {
      // trace(PRELOADER_ANIMATION_MESSAGES.reducedMotionExit);
      preloader.style.transition =
        PRELOADER_ANIMATION.reducedMotionExitTransition;
      preloader.style.opacity = PRELOADER_STYLE_VALUES.opacityHidden;
      preloader.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, PRELOADER_TIMINGS.reducedMotionFallbackMs);
      return;
    }

    preloader
      .animate(
        [
          PRELOADER_ANIMATION.exitFallbackFrom,
          PRELOADER_ANIMATION.exitFallbackTo,
        ],
        {
          duration: PRELOADER_TIMINGS.exitFallbackDurationMs,
          easing: PRELOADER_ANIMATION.exitFallbackEasing,
          fill: PRELOADER_ANIMATION.fillModeForwards,
        },
      )
      .addEventListener("finish", finish, { once: true });
  });
