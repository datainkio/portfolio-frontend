/** @format */

/**
 * BackgroundVideoEvent
 *
 * Builds the payload every `video:media:*` event carries — one frozen snapshot
 * of the background video, taken at emit time.
 *
 * Why a snapshot and not the live element: these events cross the module
 * boundary onto `window`, where the preloader reads them. Handing out a live
 * `<video>` there would re-create the coupling this replaces — a consumer could
 * call `play()`, reassign `src`, or read a value that has moved on since the
 * event fired. Only `element` (the section root) is a live reference, and only
 * because every other `_emit` in the system already carries it.
 *
 * `lifecycle.phase` is derived from timeline progress rather than stored on the
 * section: AbstractSection tracks phase implicitly through PromiseResolverQueue,
 * which exposes no settled state, and adding a field to the base class to serve
 * one section's events would be the wrong place to pay for it.
 */
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** End of the last buffered range, or 0 when nothing has buffered. */
const readBufferedEnd = (video) => {
  const ranges = video?.buffered;
  if (!ranges?.length) return 0;
  try {
    return ranges.end(ranges.length - 1);
  } catch {
    // Firefox throws INDEX_SIZE_ERR on a range that vanished between the
    // length read and the end() call.
    return 0;
  }
};

/**
 * Which lifecycle timeline the section is sitting in. Read in reverse order
 * (outro first) so the latest phase to have started wins.
 */
const readPhase = (section) => {
  const progress = (id) =>
    section?.animations?.getTimeline?.(id)?.progress?.() ?? 0;

  if (progress(TIMELINE_IDS.outro) > 0) return "outro";
  if (progress(TIMELINE_IDS.intro) >= 1) return "idle";
  if (progress(TIMELINE_IDS.intro) > 0) return "intro";
  if (progress(TIMELINE_IDS.landing) > 0) return "landing";
  return "pending";
};

const readVideoState = (video) => {
  if (!video) {
    return {
      hasSrc: false,
      isPlaying: false,
      paused: true,
      readyState: 0,
      networkState: 0,
      currentTime: 0,
      duration: 0,
      bufferedEnd: 0,
      error: null,
    };
  }

  return {
    hasSrc: Boolean(video.currentSrc || video.src),
    // HAVE_FUTURE_DATA (3) or better: the element has enough to keep going, so
    // `!paused` actually means moving rather than merely intending to.
    isPlaying: !video.paused && video.readyState >= 3,
    paused: video.paused,
    readyState: video.readyState,
    networkState: video.networkState,
    currentTime: video.currentTime,
    // NaN until metadata lands; normalize so consumers never branch on it.
    duration: Number.isFinite(video.duration) ? video.duration : 0,
    bufferedEnd: readBufferedEnd(video),
    error: video.error?.code ?? null,
  };
};

const readLifecycleState = (section) => ({
  phase: readPhase(section),
  breakpoint: section?._activeBreakpoint ?? "base",
  isInView: Boolean(section?._isInView),
  isReducedMotion:
    section?._isReducedMotionMode ??
    (typeof window.matchMedia === "function" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches),
  motionEnabled: Boolean(section?._isLifecycleMotionEnabled),
  documentReadyState: document.readyState,
  visibilityState: document.visibilityState,
  timestamp: performance.now(),
});

/**
 * @param {import("./BackgroundVideo.js").default} section
 * @returns {Readonly<{
 *   element: HTMLElement | null,
 *   video: Readonly<Object>,
 *   lifecycle: Readonly<Object>,
 * }>}
 */
export const buildBackgroundVideoEvent = (section) =>
  Object.freeze({
    element: section?.view ?? null,
    video: Object.freeze(readVideoState(section?.videoEl)),
    lifecycle: Object.freeze(readLifecycleState(section)),
  });

export default buildBackgroundVideoEvent;
