/**
 * ---
 * aix:
 *   id: frontend.js.choreography-playground
 *   role: Frontend runtime module: js/choreography-playground.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography-playground.js
 * ---
 */
/** @format */

import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import { AnimationBus } from "/assets/js/choreography/system/AnimationBus.js";
import {
  SECTION_REGISTRY,
  getSectionName,
} from "/assets/js/choreography/sections/registry/registry.js";

const logger = lumberjack.createScoped("ChoreoPlayground", {
  color: "#22d3ee",
  enabled: true,
});

const state = {
  mode: "manual",
  bus: null,
  director: null,
  sectionInstance: null,
  subscriptions: [],
  windowSubscriptions: [],
  activeSections: [],
  autoScroll: true,
  initialized: false,
  eventCount: 0,
};

const ui = {
  modeDirector: null,
  modeManual: null,
  initBtn: null,
  destroyBtn: null,
  restartBtn: null,
  clearLogBtn: null,
  autoScroll: null,
  sectionSelect: null,
  startIntroBtn: null,
  startOutroBtn: null,
  lifecycleStatus: null,
  logList: null,
  logSummary: null,
  wiredSections: null,
  statusActiveMode: null,
  statusLastEvent: null,
  activeModeChip: null,
};

const flattenedEvents = flattenEvents(EVENTS);
const sectionIdsFromEvents = deriveSectionIds(flattenedEvents);

// Explicit adapter layer for section lifecycle triggers
const SECTION_API = {
  hero: {
    intro: (section) => section?.playIntro?.(),
    outro: (section) => section?.playOutro?.(),
  },
  video: {
    intro: (section) => section?.playIntro?.(),
    outro: (section) => section?.playOutro?.(),
  },
  bio: {
    intro: (section) => section?.playIntro?.(),
    outro: (section) => section?.playOutro?.(),
  },
};

document.addEventListener("DOMContentLoaded", () => {
  cacheUi();
  renderSectionOptions();
  bindUi();
  updateLifecycleControls();
  updateStatusTexts();
  logSystem("Playground ready", "system.ready");
});

function cacheUi() {
  ui.modeDirector = document.querySelector("#mode-director");
  ui.modeManual = document.querySelector("#mode-manual");
  ui.initBtn = document.querySelector("#init-btn");
  ui.destroyBtn = document.querySelector("#destroy-btn");
  ui.restartBtn = document.querySelector("#restart-btn");
  ui.clearLogBtn = document.querySelector("#clear-log-btn");
  ui.autoScroll = document.querySelector("#auto-scroll");
  ui.sectionSelect = document.querySelector("#section-select");
  ui.startIntroBtn = document.querySelector("#start-intro");
  ui.startOutroBtn = document.querySelector("#start-outro");
  ui.lifecycleStatus = document.querySelector("#lifecycle-status");
  ui.logList = document.querySelector("#event-log");
  ui.logSummary = document.querySelector("#log-summary");
  ui.wiredSections = document.querySelector("#wired-sections");
  ui.statusActiveMode = document.querySelector("#status-active-mode");
  ui.statusLastEvent = document.querySelector("#status-last-event");
  ui.activeModeChip = document.querySelector("#active-mode");
}

function bindUi() {
  ui.initBtn?.addEventListener("click", handleInit);
  ui.destroyBtn?.addEventListener("click", () => destroy("manual"));
  ui.restartBtn?.addEventListener("click", handleRestart);
  ui.clearLogBtn?.addEventListener("click", clearLog);
  ui.autoScroll?.addEventListener("change", (e) => {
    state.autoScroll = Boolean(e.target.checked);
  });
  ui.modeDirector?.addEventListener("change", updateModeFromUi);
  ui.modeManual?.addEventListener("change", updateModeFromUi);
  ui.startIntroBtn?.addEventListener("click", () => triggerLifecycle("intro"));
  ui.startOutroBtn?.addEventListener("click", () => triggerLifecycle("outro"));
  ui.sectionSelect?.addEventListener("change", updateLifecycleControls);
}

function updateModeFromUi() {
  const mode = ui.modeDirector?.checked ? "director" : "manual";
  state.mode = mode;
  updateStatusTexts();
}

function flattenEvents(node, path = []) {
  if (!node || typeof node !== "object") return [];
  const result = [];
  Object.entries(node).forEach(([key, value]) => {
    const nextPath = [...path, key];
    if (typeof value === "string") {
      result.push({
        path: nextPath.join("."),
        event: value,
        group: path[0] ?? key,
        label: key,
      });
      return;
    }
    if (typeof value === "object") {
      result.push(...flattenEvents(value, nextPath));
    }
  });
  return result;
}

function deriveSectionIds(events) {
  const ids = new Set();
  events.forEach((evt) => {
    const [group] = evt.path.split(".");
    if (group && group !== "system") ids.add(group);
  });
  return Array.from(ids).sort();
}

function renderSectionOptions() {
  if (!ui.sectionSelect) return;
  ui.sectionSelect.innerHTML = "";

  sectionIdsFromEvents.forEach((id) => {
    const option = document.createElement("option");
    const inRegistry = Boolean(SECTION_REGISTRY[id]);
    option.value = id;
    option.textContent = inRegistry
      ? getSectionName(id)
      : `${id} (events only)`;
    if (!inRegistry) option.disabled = true;
    ui.sectionSelect.appendChild(option);
  });

  if (ui.sectionSelect.options.length) {
    ui.sectionSelect.selectedIndex = 0;
  }
}

async function handleInit() {
  await destroy("reinit");
  updateModeFromUi();
  state.autoScroll = Boolean(ui.autoScroll?.checked);
  if (state.mode === "director") {
    await initDirectorMode();
  } else {
    initManualMode();
  }
  updateStatusTexts();
}

async function initDirectorMode() {
  try {
    const module = await import("/assets/js/choreography/AnimationDirector.js");
    const AnimationDirector =
      module.default || module.AnimationDirector || module.Director;
    if (!AnimationDirector) throw new Error("AnimationDirector unavailable");

    const existing =
      window.director instanceof AnimationDirector ? window.director : null;
    state.director = existing || new AnimationDirector();
    window.director = state.director;
    state.bus = state.director?.bus ?? new AnimationBus();
    if (typeof state.director.enableDebug === "function") {
      state.director.enableDebug(true);
    } else if (typeof state.bus.enableDebug === "function") {
      state.bus.enableDebug(true);
    }
    state.activeSections = Object.keys(state.director?.sections || {});
    subscribeAll();
    state.initialized = true;
    logSystem("Director mode initialized", "director.ready");
    updateLifecycleControls();
  } catch (error) {
    logger.trace("Director mode failed; falling back to manual bus", error);
    logSystem("Director init failed; using manual bus", "director.error");
    state.bus = new AnimationBus();
    state.activeSections = [];
    subscribeAll();
    state.initialized = true;
    updateLifecycleControls();
  }
}

function initManualMode() {
  state.bus = new AnimationBus();
  const sectionId = getSelectedSectionId();
  state.activeSections = [];

  if (sectionId && SECTION_REGISTRY[sectionId]) {
    const SectionClass = SECTION_REGISTRY[sectionId];
    try {
      state.sectionInstance = new SectionClass({ bus: state.bus });
      state.activeSections.push(sectionId);
    } catch (error) {
      logger.trace("Section init failed", { sectionId, error });
      logSystem(`Section init failed: ${sectionId}`, "section.error");
    }
  }

  subscribeAll();
  state.initialized = true;
  logSystem("Manual mode initialized", "manual.ready");
  updateLifecycleControls();
}

function subscribeAll() {
  clearSubscriptions();
  if (!state.bus) return;

  flattenedEvents.forEach((evt) => {
    const unsub = state.bus.on(evt.event, (payload) =>
      logEvent("received", evt.event, evt.path, payload),
    );
    state.subscriptions.push(unsub);
  });

  const onDirectorReady = () =>
    logEvent("system", "director:ready", "system.directorReady");
  window.addEventListener("director:ready", onDirectorReady);
  state.windowSubscriptions.push(() =>
    window.removeEventListener("director:ready", onDirectorReady),
  );
}

function logSystem(message, path) {
  logEvent("system", message, path || "system");
}

function logEvent(kind, eventName, path, payload = null) {
  if (!ui.logList) return;
  const time = new Date().toLocaleTimeString();
  const item = document.createElement("li");
  item.className = getLogClass(kind);
  const meta = document.createElement("div");
  meta.className =
    "flex items-center justify-between gap-3 text-[11px] text-neutral-400";
  meta.innerHTML = `<span>${time}</span><span>${kind}</span>`;

  const title = document.createElement("div");
  title.className = "text-xs text-neutral-100";
  title.textContent = eventName;

  const detail = document.createElement("div");
  detail.className = "text-[11px] text-neutral-400";
  detail.textContent = path || "";

  item.appendChild(meta);
  item.appendChild(title);
  item.appendChild(detail);

  if (payload && typeof payload === "object" && Object.keys(payload).length) {
    const payloadEl = document.createElement("pre");
    payloadEl.className =
      "mt-1 rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 overflow-auto";
    payloadEl.textContent = JSON.stringify(payload, null, 2);
    item.appendChild(payloadEl);
  }

  ui.logList.prepend(item);
  state.eventCount += 1;
  if (state.autoScroll) {
    item.scrollIntoView({ block: "nearest" });
  }
  updateStatusTexts(eventName, kind);
}

function getLogClass(kind) {
  const base = "rounded border px-3 py-2 space-y-1";
  const variants = {
    received: `${base} border-emerald-700 bg-emerald-900/50`,
    system: `${base} border-neutral-700 bg-neutral-900`,
    action: `${base} border-primary-700 bg-primary-900/60`,
  };
  return variants[kind] || base;
}

async function handleRestart() {
  if (!state.initialized) {
    logSystem("Nothing to restart; init first", "restart.skip");
    return;
  }

  if (state.mode === "director" && state.director) {
    if (typeof state.director.restart === "function") {
      try {
        state.director.restart();
        logSystem("Director restart invoked", "director.restart");
        return;
      } catch (error) {
        logger.trace("Director restart failed; reinitializing", error);
      }
    }
  }

  const previousSection = ui.sectionSelect?.value;
  await handleInit();
  if (ui.sectionSelect) ui.sectionSelect.value = previousSection;
}

function clearLog() {
  if (!ui.logList) return;
  ui.logList.innerHTML = "";
  state.eventCount = 0;
  updateStatusTexts();
}

async function destroy(reason = "manual") {
  clearSubscriptions();

  if (state.sectionInstance?.destroy) {
    try {
      state.sectionInstance.destroy();
    } catch (error) {
      logger.trace("Section destroy failed", error);
    }
  }
  state.sectionInstance = null;

  if (state.director) {
    try {
      state.director.destroy?.();
    } catch (error) {
      logger.trace("Director destroy failed", error);
    }
    if (window.director === state.director) {
      window.director = null;
    }
  }
  state.director = null;

  state.bus = null;
  state.activeSections = [];
  state.initialized = false;
  if (reason !== "reinit") {
    logSystem("Destroyed playground state", "destroy");
  }
  updateLifecycleControls();
  updateStatusTexts();
}

function clearSubscriptions() {
  state.subscriptions.forEach((unsub) => {
    try {
      unsub();
    } catch (error) {
      logger.trace("Unsubscribe failed", error);
    }
  });
  state.subscriptions = [];

  state.windowSubscriptions.forEach((unsub) => {
    try {
      unsub();
    } catch (error) {
      logger.trace("Window unsubscribe failed", error);
    }
  });
  state.windowSubscriptions = [];
}

function getSelectedSectionId() {
  return ui.sectionSelect?.value || null;
}

function getActiveSectionInstance() {
  if (state.mode === "director" && state.director) {
    const id = getSelectedSectionId();
    return state.director.sections?.[id] || null;
  }
  return state.sectionInstance;
}

function getSectionAdapter(sectionId) {
  return SECTION_API[sectionId] || null;
}

function triggerLifecycle(kind) {
  const sectionId = getSelectedSectionId();
  const adapter = getSectionAdapter(sectionId);
  const instance = getActiveSectionInstance();

  if (!sectionId || !adapter || !instance) {
    setLifecycleStatus("No section ready", true);
    return;
  }

  const action = adapter[kind];
  if (typeof action !== "function") {
    setLifecycleStatus(`${sectionId} has no ${kind}`, true);
    return;
  }

  try {
    action(instance);
    logEvent("action", `${sectionId}:${kind}`, `${sectionId}.${kind}`);
    setLifecycleStatus(`Triggered ${kind} on ${sectionId}`);
  } catch (error) {
    logger.trace("Lifecycle trigger failed", { sectionId, kind, error });
    setLifecycleStatus(`Failed ${kind} on ${sectionId}`, true);
  }
}

function setLifecycleStatus(message, isError = false) {
  if (!ui.lifecycleStatus) return;
  ui.lifecycleStatus.textContent = message;
  ui.lifecycleStatus.className = `text-xs ${isError ? "text-rose-300" : "text-neutral-400"}`;
}

function updateLifecycleControls() {
  const sectionId = getSelectedSectionId();
  const adapter = getSectionAdapter(sectionId) || {};
  const instance = getActiveSectionInstance();
  const hasIntro = typeof adapter.intro === "function";
  const hasOutro = typeof adapter.outro === "function";

  const disabledIntro = !hasIntro || !instance;
  const disabledOutro = !hasOutro || !instance;

  if (ui.startIntroBtn) ui.startIntroBtn.disabled = disabledIntro;
  if (ui.startOutroBtn) ui.startOutroBtn.disabled = disabledOutro;

  if (!sectionId) {
    setLifecycleStatus("Select a section");
    return;
  }

  if (!instance) {
    setLifecycleStatus(`Init to load ${sectionId}`, true);
    return;
  }

  setLifecycleStatus(`Ready: ${sectionId}`);
}

function updateStatusTexts(lastEvent, kind = "") {
  const wired = state.activeSections.length
    ? state.activeSections.join(", ")
    : "none";
  if (ui.wiredSections)
    ui.wiredSections.textContent = `Wired sections: ${wired}`;
  if (ui.statusActiveMode)
    ui.statusActiveMode.textContent = `Mode: ${state.mode}`;
  if (ui.statusLastEvent)
    ui.statusLastEvent.textContent = `Last: ${lastEvent || "–"}`;
  if (ui.activeModeChip) {
    const label = state.bus ? `Bus: ${state.mode}` : "Bus: idle";
    ui.activeModeChip.textContent = label;
  }
  if (ui.logSummary)
    ui.logSummary.textContent = `${state.eventCount} events (${kind || state.mode})`;
}
