/**
 * Preloader
 *
 * Gates the home landing header's outro and hands off to the choreography
 * system. The visuals are pure CSS (styles/components/hanko.css); this module
 * only decides *when* to flip `data-preloader-state="exit"` and when to
 * dispatch `preloader:out`.
 *
 *   boot (every page that includes choreography-script.njk)
 *     ├─ no [data-preloader] → hydrate deferred videos, return
 *     └─ home
 *        ├─ SessionManager: hasVisited() → isReturnVisit; markVisited()
 *        ├─ first visit: lock scroll
 *        ├─ wait: fonts.ready (bounded) → director:ready (bounded)
 *        ├─ hydrate deferred videos (download warms during the outro)
 *        ├─ first visit: flip exit state, await hanko settle transitionend
 *        │  return visit: state already set pre-paint by
 *        │                session-management-script.njk — nothing to wait for
 *        ├─ dispatch preloader:out → LandingSequence / HomeHeaderManager
 *        └─ cleanup: unlock scroll, main[aria-busy=false]
 */
import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import { getSessionManager } from "/assets/js/choreography/managers/SessionManager/SessionManager.js";
import {
  CHOREOGRAPHY_FLAG,
  PRELOADER_SELECTORS,
  PRELOADER_STATE,
  PRELOADER_TIMINGS,
} from "./constants.js";
import { hydrateDeferredVideos } from "./deferred-videos.js";

const logger = Lumberjack.createScoped("Preloader", {
  prefix: "",
  color: "#5e99d9",
});

const once = (fn) => {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    fn(...args);
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Race `promise` against a timeout; `onTimeout` runs only if the timeout wins. */
const bounded = (promise, ms, onTimeout) =>
  Promise.race([
    promise,
    delay(ms).then(() => {
      onTimeout?.();
    }),
  ]);

const lockScroll = () => {
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
    html.style.overflow = previous.htmlOverflow;
    body.style.overflow = previous.bodyOverflow;
    window.scrollTo(0, previous.scrollY);
  };
};

const fontsReady = () =>
  "fonts" in document
    ? bounded(document.fonts.ready, PRELOADER_TIMINGS.fontsReadyTimeoutMs)
    : Promise.resolve();

const directorReady = () => {
  const enabled =
    typeof window[CHOREOGRAPHY_FLAG] === "boolean"
      ? window[CHOREOGRAPHY_FLAG]
      : true;
  if (!enabled || window.director) return Promise.resolve();

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
 * Flip the exit state and resolve when the hanko settle transition ends.
 * Under prefers-reduced-motion the global utility forces `transition: none`
 * so no `transitionend` fires — the timeout fallback covers that path.
 */
const runExit = (preloader) =>
  new Promise((resolve) => {
    const finish = once(() => {
      preloader.removeEventListener("transitionend", onTransitionEnd);
      resolve();
    });
    const onTransitionEnd = (event) => {
      if (
        event.propertyName === "opacity" &&
        event.target.closest?.(PRELOADER_SELECTORS.hankoMount)
      ) {
        finish();
      }
    };

    preloader.addEventListener("transitionend", onTransitionEnd);
    setTimeout(finish, PRELOADER_TIMINGS.settleFallbackMs);

    preloader.setAttribute(PRELOADER_STATE.attribute, PRELOADER_STATE.exit);
  });

export const initPreloader = async () => {
  const preloader = document.querySelector(PRELOADER_SELECTORS.root);

  if (!preloader) {
    // No splash on this page — nothing to wait behind.
    hydrateDeferredVideos(logger);
    return;
  }

  // Repeat visit this session: the loading splash already played once, and
  // sections are independently gated to their end states (see
  // AbstractSection's session-played channel). Showing the splash again would
  // be re-running the one remaining piece of "the same sequence twice."
  const sessionManager = getSessionManager();
  const isReturnVisit = sessionManager.hasVisited();
  sessionManager.markVisited();

  const unlockScroll = isReturnVisit ? () => {} : lockScroll();

  try {
    await fontsReady();
    await directorReady();
    logger.trace("Ready; starting outro");

    hydrateDeferredVideos(logger);

    if (isReturnVisit) {
      // Already settled — session-management-script.njk sets this before
      // first paint so the pulse never flashes; harmless re-assertion if that
      // inline check didn't run.
      preloader.setAttribute(PRELOADER_STATE.attribute, PRELOADER_STATE.exit);
    } else {
      await runExit(preloader);
    }

    window.dispatchEvent(new Event(EVENTS.system.preloaderOut));
  } catch (error) {
    logger.trace("Preloader flow failed", error, "verbose", "error");
  } finally {
    unlockScroll();
    document
      .querySelector(PRELOADER_SELECTORS.main)
      ?.setAttribute("aria-busy", "false");
  }
};
