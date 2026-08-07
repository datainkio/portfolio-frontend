/**
 * ---
 * aix:
 *   id: frontend.js.preloader.deferred-videos
 *   role: Frontend runtime module: js/preloader/deferred-videos.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - video
 * ---
 */

import {
  PRELOADER_ATTRIBUTES,
  PRELOADER_DEFERRED_VIDEO_MESSAGES,
  PRELOADER_SELECTORS,
} from "./constants.js";

export const hydrateDeferredVideos = (warn = () => {}) => {
  const videos = document.querySelectorAll(PRELOADER_SELECTORS.deferredVideos);

  videos.forEach((video) => {
    if (video.src) return;

    const src = video.getAttribute(PRELOADER_ATTRIBUTES.dataSrc);
    if (!src) return;

    try {
      video.setAttribute(
        PRELOADER_ATTRIBUTES.preload,
        PRELOADER_ATTRIBUTES.preloadMetadata,
      );
      video.src = src;
      video.removeAttribute(PRELOADER_ATTRIBUTES.dataSrc);
      video.removeAttribute(PRELOADER_ATTRIBUTES.dataDeferVideo);
      // load() required here: WebKit (iOS Safari/Brave) doesn't reliably
      // pick up a bare .src reassignment on an already-initialized <video>.
      // Safe at this point — hydration runs before any play() is issued,
      // so there's no in-flight play promise to interrupt.
      video.load();
    } catch (error) {
      warn(PRELOADER_DEFERRED_VIDEO_MESSAGES.hydrateFailed, error);
    }
  });
};
