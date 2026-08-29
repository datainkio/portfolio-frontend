import {
  PRELOADER_ATTRIBUTES,
  PRELOADER_DEFERRED_VIDEO_MESSAGES,
  PRELOADER_MEDIA_QUERIES,
  PRELOADER_SELECTORS,
} from "./constants.js";

export const hydrateDeferredVideos = (warn = () => {}) => {
  const videos = document.querySelectorAll(PRELOADER_SELECTORS.deferredVideos);

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia(PRELOADER_MEDIA_QUERIES.reducedMotion).matches;

  videos.forEach((video) => {
    if (video.src) return;

    // Decorative videos never get a src under reduced motion. With no source
    // the element renders its poster and nothing moves — which is the whole
    // fallback. Videos not marked motion-optional are unaffected.
    if (
      prefersReducedMotion &&
      video.matches(PRELOADER_SELECTORS.motionOptional)
    ) {
      video.removeAttribute(PRELOADER_ATTRIBUTES.dataDeferVideo);
      return;
    }

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
