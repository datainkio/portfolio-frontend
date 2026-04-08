/**
 * ---
 * aix:
 *   id: frontend.js.preloader.readiness
 *   role: Frontend runtime module: js/preloader/readiness.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - readiness
 * ---
 */

import {
  PRELOADER_READINESS,
  PRELOADER_READINESS_MESSAGES,
  PRELOADER_TIMINGS,
} from "./constants.js";

export const createDirectorReadyPromise = ({
  choreographyEnabled,
  directorReadyEvent,
  trace = () => {},
}) =>
  new Promise((resolve) => {
    if (!choreographyEnabled) {
      trace(PRELOADER_READINESS_MESSAGES.choreographyDisabled);
      resolve();
      return;
    }

    if (window.director) {
      resolve();
      return;
    }

    window.addEventListener(
      directorReadyEvent,
      () => {
        resolve();
      },
      { once: true },
    );
  });

export const waitForPreloaderReadiness = async ({
  directorReady,
  trace = () => {},
}) => {
  const fontsReady =
    PRELOADER_READINESS.fontsKey in document
      ? document.fonts.ready
      : Promise.resolve();

  const domReady =
    document.readyState !== PRELOADER_READINESS.documentLoadingState
      ? Promise.resolve()
      : new Promise((resolve) =>
          document.addEventListener(
            PRELOADER_READINESS.domContentLoadedEvent,
            resolve,
            {
              once: true,
            },
          ),
        );

  const timeout = new Promise((resolve) =>
    setTimeout(resolve, PRELOADER_TIMINGS.domReadyTimeoutMs),
  );

  await fontsReady;
  trace(PRELOADER_READINESS_MESSAGES.fontsReady);

  await Promise.race([domReady, timeout]);
  trace(PRELOADER_READINESS_MESSAGES.domReadyOrTimeout);

  await directorReady;
};
