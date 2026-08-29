import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import { getSessionManager } from "/assets/js/choreography/managers/SessionManager/SessionManager.js";
import { animateExit, animateIntro } from "./animations.js";
import {
  PRELOADER_ASSET,
  PRELOADER_CONTROLLER_MESSAGES,
  PRELOADER_GLOBAL_FLAGS,
  PRELOADER_MEDIA_QUERIES,
  PRELOADER_STATE,
} from "./constants.js";
import { hydrateDeferredVideos } from "./deferred-videos.js";
import {
  getPreloaderElements,
  lockScrollAndCaptureState,
  markMainReady,
} from "./dom.js";
import { createPreloaderLogger, showPreloaderConsoleImage } from "./logger.js";
import {
  exposeScrollSmootherDXHooks,
  readScrollSmootherPreference,
} from "./preferences.js";
import {
  createDirectorReadyPromise,
  waitForPreloaderReadiness,
} from "./readiness.js";
import {
  createFiletypeMessageUpdater,
  startResourceObserver,
} from "./resource-observer.js";

import { ensureScrollSmoother } from "./scroll-smoother.js";

const createCleanup = ({ stopObserver, restoreState, main, trace, warn }) => {
  let cleaned = false;

  return () => {
    if (cleaned) return;
    cleaned = true;

    try {
      stopObserver();
      // trace(PRELOADER_CONTROLLER_MESSAGES.resourceObserverStopped);
    } catch (error) {
      warn(PRELOADER_CONTROLLER_MESSAGES.resourceObserverCleanupFailed, error);
    }

    // The preloader element is intentionally NOT removed: the landing header
    // persists as the page hero once its outro has revealed the hgroup. The
    // CSS outro (data-preloader-state="exit") drops the fixed overlay so the
    // header settles into normal flow. See styles/components/hanko.css.

    try {
      restoreState();
      // trace(PRELOADER_CONTROLLER_MESSAGES.scrollPositionRestored);
    } catch (error) {
      warn(PRELOADER_CONTROLLER_MESSAGES.scrollStateRestorationFailed, error);
    }

    markMainReady(main);
    // trace(PRELOADER_CONTROLLER_MESSAGES.mainContentReady);

    hydrateDeferredVideos(warn);
    // trace(PRELOADER_CONTROLLER_MESSAGES.deferredVideosHydrated);
  };
};

export const initPreloader = async () => {
  if (PRELOADER_ASSET.consoleImageEnabled) {
    showPreloaderConsoleImage(PRELOADER_ASSET);
  }

  const logger = createPreloaderLogger();
  const { preloader, stack, textEl, main } = getPreloaderElements();

  if (!preloader) {
    logger.warn(PRELOADER_CONTROLLER_MESSAGES.noPreloaderElement);
    // ruler?.refresh?.();
    return;
  }

  // logger.trace(PRELOADER_CONTROLLER_MESSAGES.domFound);

  const prefersReduce = window.matchMedia(
    PRELOADER_MEDIA_QUERIES.reducedMotion,
  ).matches;
  // logger.trace(
  //   `${PRELOADER_CONTROLLER_MESSAGES.reducedMotionPreferencePrefix}${prefersReduce}`,
  // );

  // Repeat visit this session: the loading splash already played once, and
  // sections are independently gated to their end states (see
  // AbstractSection's session-played channel). Showing the splash again would
  // be re-running the one remaining piece of "the same sequence twice."
  // Nothing here needs to lock scroll or observe resource loads for a
  // filetype message the visitor will never see.
  const sessionManager = getSessionManager();
  const isReturnVisit = sessionManager.hasVisited();
  sessionManager.markVisited();

  const restoreState = isReturnVisit ? () => {} : lockScrollAndCaptureState();

  const scrollSmootherEnabled = readScrollSmootherPreference(preloader);
  exposeScrollSmootherDXHooks(scrollSmootherEnabled);

  const updateFiletypeMessage = createFiletypeMessageUpdater(textEl);
  const stopObserver = isReturnVisit
    ? () => {}
    : startResourceObserver(updateFiletypeMessage, logger.trace);

  const cleanup = createCleanup({
    stopObserver,
    restoreState,
    main,
    trace: logger.trace,
    warn: logger.warn,
  });

  const choreographyFlag = PRELOADER_GLOBAL_FLAGS.enableChoreography;
  const choreographyEnabled =
    typeof window[choreographyFlag] === "boolean"
      ? window[choreographyFlag]
      : true;

  const directorReady = createDirectorReadyPromise({
    choreographyEnabled,
    directorReadyEvent: EVENTS.system.directorReady,
    trace: logger.trace,
  });

  try {
    // logger.trace(PRELOADER_CONTROLLER_MESSAGES.initializationComplete);

    if (isReturnVisit) {
      // Already settled — a synchronous pre-paint check in the page markup
      // sets this before first render so the loading pulse never flashes;
      // this is a harmless no-op re-assertion if that check didn't run.
      preloader.setAttribute(PRELOADER_STATE.attribute, PRELOADER_STATE.exit);
    } else {
      animateIntro({
        stack,
        prefersReduce,
        trace: logger.trace,
      });
    }

    // logger.trace(PRELOADER_CONTROLLER_MESSAGES.loadingReadiness);
    await waitForPreloaderReadiness({
      directorReady,
      trace: logger.trace,
    });

    //  logger.trace(PRELOADER_CONTROLLER_MESSAGES.directorReady);
    if (isReturnVisit) {
      // No CSS transition to wait out — state was already settled above (or
      // before paint). Dispatch directly instead of routing through
      // animateExit()'s animationend/timeout promise, which would otherwise
      // hold preloaderOut for its ~1.6s no-op fallback with nothing to wait
      // for the second time around.
      window.dispatchEvent(new Event(EVENTS.system.preloaderOut));
    } else {
      await animateExit({
        preloader,
        trace: logger.trace,
        onComplete: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event(EVENTS.system.preloaderOut));
          }
        },
      });
    }

    // logger.trace(PRELOADER_CONTROLLER_MESSAGES.exitComplete);
  } catch (error) {
    logger.warn(PRELOADER_CONTROLLER_MESSAGES.flowFailed, error);
  } finally {
    cleanup();

    try {
      await ensureScrollSmoother({
        enabled: scrollSmootherEnabled,
        gsapSrc: preloader.dataset.gsapSrc,
        trace: logger.trace,
      });
    } catch (error) {
      logger.warn(
        PRELOADER_CONTROLLER_MESSAGES.scrollSmootherInitializationFailed,
        error,
      );
    } finally {
      // uhhh....
    }
  }
};
