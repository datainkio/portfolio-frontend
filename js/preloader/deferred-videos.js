import { PRELOADER_SELECTORS, PRELOADER_IN_VIEW } from "./constants.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

/**
 * Give one deferred video its src. Returns true when the video ended up with
 * a src (now or already), false when it was left posterized.
 */
const hydrateVideo = (video, logger, reducedMotion) => {
  if (video.src) return true;

  // Decorative videos never get a src under reduced motion. With no source
  // the element renders its poster and nothing moves — which is the whole
  // fallback. Videos not marked motion-optional are unaffected.
  if (reducedMotion && video.matches(PRELOADER_SELECTORS.motionOptional)) {
    video.removeAttribute("data-defer-video");
    return false;
  }

  const src = video.getAttribute("data-src");
  if (!src) return false;

  try {
    // The template's own preload attribute stands: the hero carries
    // "metadata", card videos "none".
    video.src = src;
    video.removeAttribute("data-src");
    video.removeAttribute("data-defer-video");
    // load() required here: WebKit (iOS Safari/Brave) doesn't reliably
    // pick up a bare .src reassignment on an already-initialized <video>.
    // Safe at this point — hydration runs before any play() is issued,
    // so there's no in-flight play promise to interrupt.
    video.load();
    return true;
  } catch (error) {
    logger?.trace?.("Deferred video hydrate failed", error, "verbose", "error");
    return false;
  }
};

export const hydrateDeferredVideos = (
  logger,
  selector = PRELOADER_SELECTORS.deferredVideos,
) => {
  const reducedMotion = prefersReducedMotion();
  document
    .querySelectorAll(selector)
    .forEach((video) => hydrateVideo(video, logger, reducedMotion));
};

/**
 * Play-in-view videos (`[data-play-in-view]`, e.g. card videos) carry no
 * `autoplay` — `autoplay` overrides `preload="none"` and would fetch every one
 * the moment it gets a src, on screen or not. Instead each gets its src and
 * plays only as it nears the viewport, and pauses once it leaves, so
 * off-screen videos neither download nor decode.
 */
export const observeInViewVideos = (
  logger,
  selector = PRELOADER_SELECTORS.inViewVideos,
) => {
  const videos = document.querySelectorAll(selector);
  if (!videos.length || !("IntersectionObserver" in window)) return;

  const reducedMotion = prefersReducedMotion();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (!isIntersecting) {
          video.pause();
          return;
        }
        if (!hydrateVideo(video, logger, reducedMotion)) {
          observer.unobserve(video);
          return;
        }
        // Muted + playsinline, so autoplay policy allows this; a refusal
        // just leaves the poster up.
        video
          .play()
          ?.catch?.((error) =>
            logger?.trace?.("In-view video play refused", error, "verbose"),
          );
      });
    },
    { rootMargin: PRELOADER_IN_VIEW.rootMargin },
  );

  videos.forEach((video) => observer.observe(video));
};
