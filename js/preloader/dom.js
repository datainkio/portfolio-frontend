/**
 * ---
 * aix:
 *   id: frontend.js.preloader.dom
 *   role: Frontend runtime module: js/preloader/dom.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - dom
 * ---
 */

import {
  PRELOADER_ATTRIBUTES,
  PRELOADER_SELECTORS,
  PRELOADER_STYLE_VALUES,
} from "./constants.js";

export const getPreloaderElements = () => {
  const preloader = document.querySelector(PRELOADER_SELECTORS.root);
  const main = document.querySelector(PRELOADER_SELECTORS.main);

  if (!preloader) {
    return {
      preloader: null,
      stack: null,
      textEl: null,
      main,
    };
  }

  return {
    preloader,
    stack: preloader.querySelector(PRELOADER_SELECTORS.stack),
    textEl: preloader.querySelector(PRELOADER_SELECTORS.text),
    main,
  };
};

export const lockScrollAndCaptureState = () => {
  const html = document.documentElement;
  const body = document.body;
  const previousState = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    scrollY: window.scrollY,
  };

  html.style.overflow = PRELOADER_STYLE_VALUES.hiddenOverflow;
  body.style.overflow = PRELOADER_STYLE_VALUES.hiddenOverflow;

  return () => {
    html.style.overflow = previousState.htmlOverflow;
    body.style.overflow = previousState.bodyOverflow;
    window.scrollTo({
      top: previousState.scrollY,
      left: 0,
      behavior:
        PRELOADER_STYLE_VALUES.scrollBehaviorInstant in window
          ? PRELOADER_STYLE_VALUES.scrollBehaviorInstant
          : PRELOADER_STYLE_VALUES.scrollBehaviorAuto,
    });
  };
};

export const markMainReady = (main) => {
  if (main) {
    main.setAttribute(
      PRELOADER_ATTRIBUTES.ariaBusy,
      PRELOADER_ATTRIBUTES.ariaBusyReady,
    );
  }
};
