/**
 * Preloader
 *
 * Gates the home splash's outro and hands off to the choreography system.
 * The visuals are pure CSS (styles/components/hanko.css): the intro
 * (S00 -> S03) and idle pulse (S04) start at first paint on their own. This
 * module decides *when* to flip `data-preloader-state="exit"` (the outro,
 * S03 -> S00), hides the root once that lands, and dispatches `preloader:out`.
 *
 * It does not touch the background video element. It hydrates the deferred
 * `src` (a bandwidth staging concern it owns), then hands off: BackgroundVideo
 * starts playback and reports state as `video:media:*` events on `window`,
 * which is all this module gates on.
 *
 *   boot (every page that includes choreography-script.njk)
 *     ├─ no [data-preloader] → hydrate deferred videos, return
 *     └─ home
 *        ├─ SessionManager: hasVisited() → isReturnVisit; markVisited()
 *        ├─ first visit: lock scroll
 *        ├─ in parallel:
 *        │    intro: animationend on the subtitle (bounded)
 *        │    readiness: fonts.ready (bounded) → director:ready (bounded)
 *        │               → hydrate the background video only
 *        │               → cue preloader:video:hydrated, then wait for
 *        │                 BackgroundVideo's video:media:* answer (bounded)
 *        ├─ outro: flip exit state, await animationend on the logo (bounded),
 *        │         then `hidden` on the root
 *        │  return visit: root already `hidden` pre-paint by
 *        │                session-management-script.njk — outro skipped
 *        ├─ dispatch preloader:out → LandingSequence
 *        └─ cleanup: unlock scroll, main[aria-busy=false],
 *                    hydrate the remaining deferred videos, observe
 *                    play-in-view (card) videos
 */
import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import { getSessionManager } from "/assets/js/choreography/managers/SessionManager/SessionManager.js";
import {
  BACKGROUND_VIDEO_SETTLED_EVENTS,
  isBackgroundVideoSettled,
} from "/assets/js/choreography/organisms/background/BackgroundVideoEvent.js";
import {
  CHOREOGRAPHY_FLAG,
  PRELOADER_SELECTORS,
  PRELOADER_STATE,
  PRELOADER_TIMINGS,
} from "./constants.js";
import {
  hydrateDeferredVideos,
  observeInViewVideos,
} from "./deferred-videos.js";

const logger = Lumberjack.createScoped("Preloader", {
  prefix: "",
  color: "#5e99d9",
});
logger.enabled = true;
logger.trace("Preloader initialized");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Race `promise` against a timeout; `onTimeout` runs only if the timeout wins.
 * Resolves `true` when `promise` settled first, `false` when the timeout won.
 */
const bounded = (promise, ms, onTimeout) => {
  let settled = false;
  return Promise.race([
    promise.then(() => {
      settled = true;
      return true;
    }),
    delay(ms).then(() => {
      if (!settled) onTimeout?.();
      return settled;
    }),
  ]);
};

/**
 * Resolve once every CSS animation currently on `element` has finished.
 * Resolves immediately when there are none — an intro that already landed
 * before this module evaluated, or reduced motion (the global utility forces
 * `animation: none`, so the states snap and nothing is listed). A cancelled
 * animation rejects `finished`; treat that as done too.
 */
const animationsSettled = (element) =>
  Promise.all(
    (element?.getAnimations?.() ?? []).map((animation) =>
      animation.finished.catch(() => {}),
    ),
  );

const lockScroll = () => {
  logger.trace("Locking scroll");
  const html = document.documentElement;
  const body = document.body;
  const previous = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    scrollY: window.scrollY,
  };

  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  return () => {
    logger.trace("Unlocking scroll");
    html.style.overflow = previous.htmlOverflow;
    body.style.overflow = previous.bodyOverflow;
    window.scrollTo(0, previous.scrollY);
  };
};

/**
 * The CSS intro is already running by the time this module evaluates; wait
 * for its last child (the subtitle) to land so the outro never cuts it short.
 */
const introDone = (preloader) =>
  bounded(
    animationsSettled(preloader.querySelector(PRELOADER_SELECTORS.introLast)),
    PRELOADER_TIMINGS.introFallbackMs,
    () =>
      logger.trace(
        `Intro not finished within ${PRELOADER_TIMINGS.introFallbackMs}ms; continuing`,
      ),
  );

const fontsReady = () =>
  "fonts" in document
    ? bounded(document.fonts.ready, PRELOADER_TIMINGS.fontsReadyTimeoutMs)
    : Promise.resolve();

const isChoreographyEnabled = () =>
  typeof window[CHOREOGRAPHY_FLAG] === "boolean"
    ? window[CHOREOGRAPHY_FLAG]
    : true;

const directorReady = () => {
  if (!isChoreographyEnabled() || window.director) return Promise.resolve(true);

  const ready = new Promise((resolve) =>
    window.addEventListener(EVENTS.system.directorReady, resolve, {
      once: true,
    }),
  );
  return bounded(ready, PRELOADER_TIMINGS.directorReadyTimeoutMs, () =>
    console.warn(
      `[Preloader] director:ready not received within ${PRELOADER_TIMINGS.directorReadyTimeoutMs}ms; releasing the preloader anyway.`,
    ),
  );
};

/**
 * Resolve once the background video has settled, so the splash never lifts
 * onto a paused poster.
 *
 * This only *observes*. BackgroundVideo owns the element: it starts playback,
 * applies the reduced-motion policy, and answers on every path — `playing`
 * when it moves, `error` on a refused play(), `unavailable` when there is no
 * video or no src. One of those always arrives, so the timeout below is a true
 * failsafe rather than the normal exit for a page with no video.
 *
 * `isBackgroundVideoSettled` decides which of those actually ends the wait —
 * notably `ready` fires from `canplay` on every path, so it only counts under
 * reduced motion. LandingSequence's reveal cue asks the same question through
 * the same predicate.
 *
 * Call this BEFORE dispatching `preloader:video:hydrated` — the listeners must
 * be attached before the section is cued, and the bound starts here.
 */
const backgroundVideoSettled = () => {
  if (!isChoreographyEnabled()) {
    // Nothing constructs BackgroundVideo, so nothing will ever answer.
    logger.trace("Choreography disabled; skipping background video gate");
    return Promise.resolve(true);
  }

  const settled = new Promise((resolve) => {
    const done = (event) => {
      if (!isBackgroundVideoSettled(event.type, event.detail)) return;
      BACKGROUND_VIDEO_SETTLED_EVENTS.forEach((name) =>
        window.removeEventListener(name, done),
      );
      logger.trace(`Background video gate released by ${event.type}`);
      resolve();
    };
    // Not `once`: a declined event has to stay subscribed.
    BACKGROUND_VIDEO_SETTLED_EVENTS.forEach((name) =>
      window.addEventListener(name, done),
    );
  });

  return bounded(settled, PRELOADER_TIMINGS.videoPlayingTimeoutMs, () =>
    logger.trace(
      `Background video did not report within ${PRELOADER_TIMINGS.videoPlayingTimeoutMs}ms; releasing the preloader anyway`,
    ),
  );
};

/**
 * Flip the exit state, resolve when the last child out (the logo) has faded,
 * then hide the root so it stops occupying a viewport of flow. Reading the
 * logo's animations right after the flip forces the style recalc that
 * starts them, so the outro's own fade is what gets awaited.
 */
const runExit = async (preloader) => {
  preloader.setAttribute(PRELOADER_STATE.attribute, PRELOADER_STATE.exit);
  await bounded(
    animationsSettled(preloader.querySelector(PRELOADER_SELECTORS.outroLast)),
    PRELOADER_TIMINGS.outroFallbackMs,
  );
  preloader.hidden = true;
};

export const initPreloader = async () => {
  const preloader = document.querySelector(PRELOADER_SELECTORS.root);

  // Let's make sure the preloader element exists first!
  if (!preloader) {
    logger.trace(
      "No preloader found; skipping and going straight to hydrating the deferred videos",
    );
    // No splash on this page — nothing to wait behind.
    hydrateDeferredVideos(logger);
    observeInViewVideos(logger);
    return;
  }

  // Showing the splash again would make for a shitty experience, so let's
  // skip the preloader animation on return visits.
  const sessionManager = getSessionManager();
  const isReturnVisit = sessionManager.hasVisited();
  sessionManager.markVisited();

  const unlockScroll = isReturnVisit ? () => {} : lockScroll();

  try {
    logger.trace("Starting preloader flow...");
    // The CSS intro is already running; let it finish while readiness resolves.
    const intro = introDone(preloader);

    logger.trace("Waiting for fonts to be ready");
    await fontsReady();
    logger.trace("Fonts ready; waiting for director to be ready");
    const directorIsReady = await directorReady();
    logger.trace(
      directorIsReady
        ? "Director ready; hydrating background video"
        : "Director gate released by timeout; hydrating background video",
    );
    // Subscribe first: BackgroundVideo answers the cue below synchronously
    // when the element is already buffered.
    const videoSettled = backgroundVideoSettled();
    hydrateDeferredVideos(logger, PRELOADER_SELECTORS.deferredBackgroundVideo);
    window.dispatchEvent(new Event(EVENTS.system.preloaderVideoHydrated));

    logger.trace("Waiting for background video");
    await videoSettled;

    await intro;

    if (preloader.hidden) {
      // Already hidden — session-management-script.njk pre-paints `hidden`
      // on a return visit so the splash never shows. Nothing to animate.
      logger.trace("Preloader already hidden; skipping outro");
    } else {
      logger.trace("Running outro");
      await runExit(preloader);
    }

    window.dispatchEvent(new Event(EVENTS.system.preloaderOut));
  } catch (error) {
    logger.trace("Preloader flow failed", error, "verbose", "error");
  } finally {
    logger.trace("Unlock scroll");
    unlockScroll();
    document
      .querySelector(PRELOADER_SELECTORS.main)
      ?.setAttribute("aria-busy", "false");
    // Everything the first pass skipped. Runs in `finally` so a failed flow
    // still leaves every video hydratable. Card videos only get a src as they
    // near the viewport.
    logger.trace("Hydrating remaining deferred videos");
    hydrateDeferredVideos(logger);
    observeInViewVideos(logger);
  }
};
