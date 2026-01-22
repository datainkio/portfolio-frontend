/**
 * ---
 * aix:
 *   id: frontend.js.section-playback
 *   role: Frontend runtime module: js/section-playback.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - section-playback.js
 * ---
 */
import { SECTION_REGISTRY } from '/assets/js/choreography/sections/registry.js';
import { EVENTS } from '/assets/js/choreography/constants.js';
import { AnimationBus } from '/assets/js/choreography/AnimationBus.js';
import ReducedMotionHandler from '/assets/js/choreography/managers/ReducedMotionHandler.js';

console.info('[section-playback] script loaded');

const instances = new Map(); // Cache per-section instance so multiple control bars share it
const reducedMotionHandler = new ReducedMotionHandler();

const STATUS = {
  idle: 'Idle',
  intro: 'Playing intro…',
  outro: 'Playing outro…',
  done: 'Complete',
  disabled: 'Unavailable',
  error: 'Init failed',
};

function ensureInstance(sectionId) {
  if (instances.has(sectionId)) return instances.get(sectionId);

  const SectionClass = SECTION_REGISTRY[sectionId];
  if (!SectionClass) return null;

  try {
    const bus = new AnimationBus();
    const section = new SectionClass({ bus, reducedMotionHandler });
    if (!section || section.isDisabled) return null;
    const entry = { section, bus };
    instances.set(sectionId, entry);
    return entry;
  } catch (error) {
    console.warn(`[section-playback] Failed to init section ${sectionId}`, error);
    return null;
  }
}

function getEvents(sectionId) {
  return EVENTS[sectionId] || {};
}

function setState(el, state, statusText, { introBtn, outroBtn, statusEl } = {}) {
  el.dataset.state = state;
  if (statusEl) statusEl.textContent = statusText ?? STATUS[state] ?? STATUS.idle;

  if (introBtn && outroBtn) {
    switch (state) {
      case 'intro':
        introBtn.disabled = true;
        outroBtn.disabled = false;
        break;
      case 'outro':
        introBtn.disabled = false;
        outroBtn.disabled = true;
        break;
      case 'disabled':
        introBtn.disabled = true;
        outroBtn.disabled = true;
        break;
      default:
        introBtn.disabled = false;
        outroBtn.disabled = false;
        break;
    }
  }
}

function bindControl(controlEl) {
  const sectionId = controlEl?.dataset?.sectionId;
  const introBtn = controlEl.querySelector('[data-play-intro]');
  const outroBtn = controlEl.querySelector('[data-play-outro]');
  const statusEl = controlEl.querySelector('[data-playback-status]');

  if (!sectionId || !introBtn || !outroBtn || !statusEl) {
    setState(controlEl, 'disabled', STATUS.disabled, { introBtn, outroBtn, statusEl });
    return;
  }

  const instance = ensureInstance(sectionId);
  if (!instance) {
    setState(controlEl, 'disabled', 'Section not available', { introBtn, outroBtn, statusEl });
    console.warn('[section-playback] No instance available for', sectionId);
    return;
  }

  const { section, bus } = instance;
  const events = getEvents(sectionId);
  const unsubscribers = [];

  console.info('[section-playback] bound control', {
    sectionId,
    hasEvents: Boolean(events?.introComplete || events?.outroComplete),
  });

  const updateIdle = message =>
    setState(controlEl, 'idle', message ?? STATUS.idle, { introBtn, outroBtn, statusEl });

  if (section.isIntroComplete) {
    updateIdle('Ready');
  } else {
    updateIdle();
  }

  introBtn.addEventListener('click', () => {
    setState(controlEl, 'intro', STATUS.intro, { introBtn, outroBtn, statusEl });
    try {
      section.playIntro?.();
    } catch (error) {
      console.warn('[section-playback] intro failed', error);
      setState(controlEl, 'disabled', STATUS.error, { introBtn, outroBtn, statusEl });
    }
  });

  outroBtn.addEventListener('click', () => {
    setState(controlEl, 'outro', STATUS.outro, { introBtn, outroBtn, statusEl });
    try {
      section.playOutro?.();
    } catch (error) {
      console.warn('[section-playback] outro failed', error);
      setState(controlEl, 'disabled', STATUS.error, { introBtn, outroBtn, statusEl });
    }
  });

  if (events.introComplete) {
    unsubscribers.push(bus.on(events.introComplete, () => updateIdle('Intro complete')));
  }

  if (events.outroComplete) {
    unsubscribers.push(bus.on(events.outroComplete, () => updateIdle('Outro complete')));
  }

  controlEl._teardown = () => {
    unsubscribers.forEach(unsub => {
      try {
        unsub?.();
      } catch (error) {
        console.warn('Playback unsubscribe failed', error);
      }
    });
  };
}

function init() {
  const controls = Array.from(document.querySelectorAll('[data-section-playback]'));
  console.info('[section-playback] initializing', { count: controls.length });
  if (!controls.length) {
    console.warn('[section-playback] No controls found on page');
  }
  controls.forEach(bindControl);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already ready (module loaded late) — run immediately
  init();
}

// Allow hot re-entry if script is re-run
export function teardownPlayback() {
  const controls = Array.from(document.querySelectorAll('[data-section-playback]'));
  controls.forEach(control => control._teardown?.());
}
