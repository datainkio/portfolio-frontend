/**
 * ---
 * aix:
 *   id: frontend.js.preloader.resource-observer
 *   role: Frontend runtime module: js/preloader/resource-observer.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - performance
 * ---
 */

import {
  PRELOADER_RESOURCE_MESSAGES,
  PRELOADER_RESOURCE_OBSERVER,
} from "./constants.js";

export const createFiletypeMessageUpdater = (textEl) => {
  let rafId = null;
  let nextLabel = null;

  return (ext) => {
    if (!textEl || !ext) return;

    nextLabel = PRELOADER_RESOURCE_OBSERVER.loadingLabelTemplate.replace(
      "{EXT}",
      ext.toUpperCase(),
    );
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      textEl.textContent = nextLabel;
      rafId = null;
    });
  };
};

const extractExt = (url) => {
  try {
    const path = new URL(url, window.location.href).pathname;
    const part = path
      .split(PRELOADER_RESOURCE_OBSERVER.extensionSeparator)
      .pop();
    if (
      !part ||
      part.includes(PRELOADER_RESOURCE_OBSERVER.invalidExtensionMarker)
    ) {
      return null;
    }
    return part.toLowerCase();
  } catch (_) {
    return null;
  }
};

export const startResourceObserver = (onExtensionSeen, trace = () => {}) => {
  trace(PRELOADER_RESOURCE_MESSAGES.preparing);

  if (
    !(PRELOADER_RESOURCE_OBSERVER.performanceObserverApi in window) ||
    !(PRELOADER_RESOURCE_OBSERVER.getEntriesByTypeApi in performance)
  ) {
    return () => {};
  }

  const seen = new Set();

  const processEntries = (entries) => {
    for (const entry of entries) {
      const url = entry.name;
      if (!url || seen.has(url)) continue;
      seen.add(url);

      const ext = extractExt(url);
      if (ext) onExtensionSeen(ext);
    }
  };

  processEntries(
    performance.getEntriesByType(PRELOADER_RESOURCE_OBSERVER.resourceEntryType),
  );

  const observer = new PerformanceObserver((list) => {
    processEntries(list.getEntries());
  });

  try {
    observer.observe(PRELOADER_RESOURCE_OBSERVER.bufferedObserveOptions);
  } catch (_) {
    try {
      observer.observe(PRELOADER_RESOURCE_OBSERVER.fallbackObserveOptions);
    } catch (_) {
      return () => {};
    }
  }

  return () => observer.disconnect();
};
