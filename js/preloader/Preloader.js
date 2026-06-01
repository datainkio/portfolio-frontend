/**
 * ---
 * aix:
 *   id: frontend.js.preloader.controller
 *   role: Frontend runtime module: js/preloader/controller.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - controller
 * ---
 */

import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import { animateExit, animateIntro } from "./animations.js";
import {
  PRELOADER_ASSET,
  PRELOADER_CONTROLLER_MESSAGES,
  PRELOADER_GLOBAL_FLAGS,
  PRELOADER_MEDIA_QUERIES,
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
import { initRulerIntro } from "/assets/js/choreography/managers/RulerIntroManager/RulerIntroManager.js";
import { ensureScrollSmoother } from "./scroll-smoother.js";

let rulerIntro = null;

const ensureRulerIntro = () => {
  if (!rulerIntro) {
    rulerIntro = initRulerIntro();
    return rulerIntro;
  }

  rulerIntro.init?.();
  return rulerIntro;
};

const createCleanup = ({
  preloader,
  stopObserver,
  restoreState,
  main,
  trace,
  warn,
}) => {
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

    try {
      if (preloader && preloader.isConnected) {
        preloader.remove();
      }
      // trace(PRELOADER_CONTROLLER_MESSAGES.preloaderElementRemoved);
    } catch (error) {
      warn(PRELOADER_CONTROLLER_MESSAGES.preloaderElementCleanupFailed, error);
    }

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
  const ruler = ensureRulerIntro();

  if (PRELOADER_ASSET.consoleImageEnabled) {
    showPreloaderConsoleImage(PRELOADER_ASSET);
  }

  const logger = createPreloaderLogger();
  const { preloader, stack, textEl, main } = getPreloaderElements();

  if (!preloader) {
    logger.warn(PRELOADER_CONTROLLER_MESSAGES.noPreloaderElement);
    ruler?.refresh?.();
    return;
  }

  // logger.trace(PRELOADER_CONTROLLER_MESSAGES.domFound);

  const prefersReduce = window.matchMedia(
    PRELOADER_MEDIA_QUERIES.reducedMotion,
  ).matches;
  // logger.trace(
  //   `${PRELOADER_CONTROLLER_MESSAGES.reducedMotionPreferencePrefix}${prefersReduce}`,
  // );

  const restoreState = lockScrollAndCaptureState();

  const scrollSmootherEnabled = readScrollSmootherPreference(preloader);
  exposeScrollSmootherDXHooks(scrollSmootherEnabled);

  const updateFiletypeMessage = createFiletypeMessageUpdater(textEl);
  const stopObserver = startResourceObserver(
    updateFiletypeMessage,
    logger.trace,
  );

  const cleanup = createCleanup({
    preloader,
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

    animateIntro({
      stack,
      prefersReduce,
      trace: logger.trace,
    });

    // logger.trace(PRELOADER_CONTROLLER_MESSAGES.loadingReadiness);
    await waitForPreloaderReadiness({
      directorReady,
      trace: logger.trace,
    });

    //  logger.trace(PRELOADER_CONTROLLER_MESSAGES.directorReady);
    await animateExit({
      preloader,
      stack,
      prefersReduce,
      trace: logger.trace,
      onComplete: () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(EVENTS.system.preloaderOut));
        }
      },
    });

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
      ruler?.refresh?.();
    }
  }
};
