import { PRELOADER_SELECTORS } from "./constants.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Single owner of the `data-defer-video` contract: every
 * `video[data-defer-video][data-src]` on the page gets its `src` assigned
 * here and nowhere else. Runs on every page (see Preloader.js) — on the home
 * page once readiness resolves, so the download warms during the outro;
 * elsewhere immediately, since there is no splash to wait behind.
 */
export const hydrateDeferredVideos = (logger) => {
  const videos = document.querySelectorAll(PRELOADER_SELECTORS.deferredVideos);

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches;

  videos.forEach((video) => {
    if (video.src) return;

    // Decorative videos never get a src under reduced motion. With no source
    // the element renders its poster and nothing moves — which is the whole
    // fallback. Videos not marked motion-optional are unaffected.
    if (
      prefersReducedMotion &&
      video.matches(PRELOADER_SELECTORS.motionOptional)
    ) {
      video.removeAttribute("data-defer-video");
      return;
    }

    const src = video.getAttribute("data-src");
    if (!src) return;

    try {
      video.setAttribute("preload", "metadata");
      video.src = src;
      video.removeAttribute("data-src");
      video.removeAttribute("data-defer-video");
      // load() required here: WebKit (iOS Safari/Brave) doesn't reliably
      // pick up a bare .src reassignment on an already-initialized <video>.
      // Safe at this point — hydration runs before any play() is issued,
      // so there's no in-flight play promise to interrupt.
      video.load();
    } catch (error) {
      logger?.trace?.(
        "Deferred video hydrate failed",
        error,
        "verbose",
        "error",
      );
    }
  });
};
