/**
 * ---
 * aix:
 *   id: frontend.js.preloader.preferences
 *   role: Frontend runtime module: js/preloader/preferences.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - preferences
 * ---
 */

import {
  SCROLL_SMOOTHER_DX_MESSAGES,
  SCROLL_SMOOTHER_QUERY_PARAM,
  SCROLL_SMOOTHER_STORAGE_KEY,
  SCROLL_SMOOTHER_STORAGE_VALUES,
  SCROLL_SMOOTHER_TRUE_VALUES,
} from "./constants.js";

export const normalizeBooleanFlag = (value) => {
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return SCROLL_SMOOTHER_TRUE_VALUES.includes(normalized);
};

export const readScrollSmootherPreference = (preloaderEl) => {
  const fromDataset =
    preloaderEl && preloaderEl.dataset
      ? preloaderEl.dataset.scrollSmoother
      : null;

  const fromQuery = (() => {
    try {
      return new URLSearchParams(window.location.search).get(
        SCROLL_SMOOTHER_QUERY_PARAM,
      );
    } catch (_) {
      return null;
    }
  })();

  const fromStorage = (() => {
    try {
      return window.localStorage.getItem(SCROLL_SMOOTHER_STORAGE_KEY);
    } catch (_) {
      return null;
    }
  })();

  return normalizeBooleanFlag(fromQuery ?? fromStorage ?? fromDataset);
};

export const persistScrollSmootherPreference = (value) => {
  try {
    window.localStorage.setItem(
      SCROLL_SMOOTHER_STORAGE_KEY,
      value
        ? SCROLL_SMOOTHER_STORAGE_VALUES.enabled
        : SCROLL_SMOOTHER_STORAGE_VALUES.disabled,
    );
  } catch (_) {
    // Intentionally ignore storage write failures.
  }
};

export const clearScrollSmootherPreference = () => {
  try {
    window.localStorage.removeItem(SCROLL_SMOOTHER_STORAGE_KEY);
  } catch (_) {
    // Intentionally ignore storage write failures.
  }
};

export const exposeScrollSmootherDXHooks = (enabled) => {
  if (typeof window === "undefined") return;

  window.__scrollSmoother = {
    enable() {
      persistScrollSmootherPreference(true);
      console.info(SCROLL_SMOOTHER_DX_MESSAGES.enabled);
    },
    disable() {
      persistScrollSmootherPreference(false);
      console.info(SCROLL_SMOOTHER_DX_MESSAGES.disabled);
    },
    clear() {
      clearScrollSmootherPreference();
    },
    status: () => enabled,
  };
};
