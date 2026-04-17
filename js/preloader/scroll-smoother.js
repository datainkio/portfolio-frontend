/**
 * ---
 * aix:
 *   id: frontend.js.preloader.scroll-smoother
 *   role: Frontend runtime module: js/preloader/scroll-smoother.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - scroll
 * ---
 */

import {
  PRELOADER_SCROLL_SMOOTHER_MESSAGES,
  SCROLL_SMOOTHER_SETTINGS,
} from "./constants.js";

const scriptLoads = new Map();

const getGlobalSmoother = () => {
  if (
    typeof window.ScrollSmoother === "undefined" ||
    typeof window.ScrollSmoother.get !== "function"
  ) {
    return null;
  }

  return window.ScrollSmoother.get();
};

const createGlobalSmoother = () => {
  const existing = getGlobalSmoother();
  if (existing) return existing;

  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollSmoother === "undefined"
  ) {
    return null;
  }

  window.gsap.registerPlugin(window.ScrollSmoother);
  return window.ScrollSmoother.create(SCROLL_SMOOTHER_SETTINGS);
};

const loadGSAPScript = (src, trace = () => {}) => {
  trace(`${PRELOADER_SCROLL_SMOOTHER_MESSAGES.loadingScriptPrefix}${src}`);

  if (scriptLoads.has(src)) {
    return scriptLoads.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  promise.catch(() => {
    scriptLoads.delete(src);
  });
  scriptLoads.set(src, promise);

  return promise;
};

const initializeLegacyScrollSmoother = async ({
  gsapSrc,
  trace = () => {},
}) => {
  const immediate = createGlobalSmoother();
  if (immediate) {
    return immediate;
  }

  if (!gsapSrc) {
    return null;
  }

  await loadGSAPScript(gsapSrc, trace);
  return createGlobalSmoother();
};

export const ensureScrollSmoother = async ({
  enabled,
  gsapSrc,
  trace = () => {},
}) => {
  if (!enabled) {
    //  trace(PRELOADER_SCROLL_SMOOTHER_MESSAGES.disabled);
    return null;
  }

  const stage = window.director?.getStage?.();
  if (stage && typeof stage.getSmoother === "function") {
    trace(PRELOADER_SCROLL_SMOOTHER_MESSAGES.delegated);
    return stage.getSmoother();
  }

  trace(PRELOADER_SCROLL_SMOOTHER_MESSAGES.standalone);
  return initializeLegacyScrollSmoother({ gsapSrc, trace });
};
