/**
 * ---
 * aix:
 *   id: frontend.js.hero-playground
 *   role: Frontend runtime module: js/hero-playground.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - hero-playground.js
 * ---
 */
/** @format */

import lumberjack from '/assets/js/utils/lumberjack/index.js';
import { EVENTS } from '/assets/js/choreography/constants.js';
import { AnimationBus } from '/assets/js/choreography/AnimationBus.js';
import Hero from '/assets/js/choreography/sections/hero/Hero.js';

const logger = lumberjack.createScoped('HeroPlayground', {
  color: '#22d3ee',
  enabled: true,
});

const HERO_API = {
  intro: hero => hero?.playIntro?.(),
  outro: hero => hero?.playOutro?.(),
};

const state = {
  bus: null,
  hero: null,
  subscriptions: [],
  autoScroll: true,
  eventCount: 0,
};

const ui = {
  initBtn: null,
  destroyBtn: null,
  restartBtn: null,
  clearLogBtn: null,
  startIntroBtn: null,
  startOutroBtn: null,
  lifecycleStatus: null,
  statusActive: null,
  statusLast: null,
  activeModeChip: null,
  autoScroll: null,
  logList: null,
  logSummary: null,
};

document.addEventListener('DOMContentLoaded', () => {
  cacheUi();
  bindUi();
  setLifecycleStatus('Select Init to begin');
  updateStatusTexts();
});

function cacheUi() {
  ui.initBtn = document.querySelector('#init-btn');
  ui.destroyBtn = document.querySelector('#destroy-btn');
  ui.restartBtn = document.querySelector('#restart-btn');
  ui.clearLogBtn = document.querySelector('#clear-log-btn');
  ui.startIntroBtn = document.querySelector('#start-intro');
  ui.startOutroBtn = document.querySelector('#start-outro');
  ui.lifecycleStatus = document.querySelector('#lifecycle-status');
  ui.statusActive = document.querySelector('#status-active');
  ui.statusLast = document.querySelector('#status-last');
  ui.activeModeChip = document.querySelector('#active-mode');
  ui.autoScroll = document.querySelector('#auto-scroll');
  ui.logList = document.querySelector('#event-log');
  ui.logSummary = document.querySelector('#log-summary');
}

function bindUi() {
  ui.initBtn?.addEventListener('click', initHero);
  ui.destroyBtn?.addEventListener('click', destroyHero);
  ui.restartBtn?.addEventListener('click', async () => {
    await destroyHero('restart');
    await initHero();
  });
  ui.clearLogBtn?.addEventListener('click', clearLog);
  ui.startIntroBtn?.addEventListener('click', () => triggerHero('intro'));
  ui.startOutroBtn?.addEventListener('click', () => triggerHero('outro'));
  ui.autoScroll?.addEventListener('change', e => {
    state.autoScroll = Boolean(e.target.checked);
  });
}

async function initHero() {
  await destroyHero('reinit');
  try {
    state.bus = new AnimationBus();
    state.hero = new Hero({ bus: state.bus });
    subscribeHeroEvents();
    setLifecycleStatus('Hero ready');
    setControlsEnabled(true);
    logSystem('Hero initialized', 'hero.init');
  } catch (error) {
    logger.trace('Hero init failed', error);
    setLifecycleStatus('Hero init failed', true);
    setControlsEnabled(false);
  }
  updateStatusTexts();
}

async function destroyHero(reason = 'manual') {
  clearSubscriptions();

  if (state.hero?.destroy) {
    try {
      state.hero.destroy();
    } catch (error) {
      logger.trace('Hero destroy failed', error);
    }
  }
  state.hero = null;
  state.bus = null;

  if (reason !== 'reinit') {
    logSystem('Destroyed hero playground', 'hero.destroy');
  }
  setControlsEnabled(false);
  setLifecycleStatus('Select Init to begin');
  updateStatusTexts();
}

function triggerHero(kind) {
  if (!state.hero) {
    setLifecycleStatus('Init hero first', true);
    return;
  }

  const action = HERO_API[kind];
  if (typeof action !== 'function') {
    setLifecycleStatus(`Hero has no ${kind}`, true);
    return;
  }

  try {
    action(state.hero);
    logEvent('action', `hero:${kind}`, `hero.${kind}`);
    setLifecycleStatus(`Triggered ${kind}`);
  } catch (error) {
    logger.trace('Hero action failed', { kind, error });
    setLifecycleStatus(`Failed ${kind}`, true);
  }
}

function subscribeHeroEvents() {
  clearSubscriptions();
  if (!state.bus) return;

  const heroEvents = Object.values(EVENTS.hero || {});
  heroEvents.forEach(eventName => {
    const unsub = state.bus.on(eventName, payload => {
      logEvent('event', eventName, 'hero', payload);
    });
    state.subscriptions.push(unsub);
  });
}

function logSystem(message, path) {
  logEvent('system', message, path || 'system');
}

function logEvent(kind, eventName, path, payload = null) {
  if (!ui.logList) return;
  const time = new Date().toLocaleTimeString();
  const item = document.createElement('li');
  item.className = getLogClass(kind);

  const meta = document.createElement('div');
  meta.className = 'flex items-center justify-between gap-3 text-[11px] text-neutral-400';
  meta.innerHTML = `<span>${time}</span><span>${kind}</span>`;

  const title = document.createElement('div');
  title.className = 'text-xs text-neutral-100';
  title.textContent = eventName;

  const detail = document.createElement('div');
  detail.className = 'text-[11px] text-neutral-400';
  detail.textContent = path || '';

  item.appendChild(meta);
  item.appendChild(title);
  item.appendChild(detail);

  if (payload && typeof payload === 'object' && Object.keys(payload).length) {
    const payloadEl = document.createElement('pre');
    payloadEl.className = 'mt-1 rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 overflow-auto';
    payloadEl.textContent = JSON.stringify(payload, null, 2);
    item.appendChild(payloadEl);
  }

  ui.logList.prepend(item);
  state.eventCount += 1;
  if (state.autoScroll) {
    item.scrollIntoView({ block: 'nearest' });
  }
  updateStatusTexts(eventName, kind);
}

function getLogClass(kind) {
  const base = 'rounded border px-3 py-2 space-y-1';
  const variants = {
    event: `${base} border-emerald-700 bg-emerald-900/50`,
    system: `${base} border-neutral-700 bg-neutral-900`,
    action: `${base} border-primary-700 bg-primary-900/60`,
  };
  return variants[kind] || base;
}

function clearLog() {
  if (!ui.logList) return;
  ui.logList.innerHTML = '';
  state.eventCount = 0;
  updateStatusTexts();
}

function clearSubscriptions() {
  state.subscriptions.forEach(unsub => {
    try {
      unsub();
    } catch (error) {
      logger.trace('Unsubscribe failed', error);
    }
  });
  state.subscriptions = [];
}

function setControlsEnabled(enabled) {
  const buttons = [ui.startIntroBtn, ui.startOutroBtn];
  buttons.forEach(btn => {
    if (!btn) return;
    btn.disabled = !enabled;
  });
}

function setLifecycleStatus(message, isError = false) {
  if (!ui.lifecycleStatus) return;
  ui.lifecycleStatus.textContent = message;
  ui.lifecycleStatus.className = `text-xs ${isError ? 'text-rose-300' : 'text-neutral-400'}`;
}

function updateStatusTexts(lastEvent, kind = '') {
  if (ui.statusActive) ui.statusActive.textContent = state.hero ? 'Hero ready' : 'Idle';
  if (ui.statusLast) ui.statusLast.textContent = `Last: ${lastEvent || '–'}`;
  if (ui.activeModeChip) ui.activeModeChip.textContent = state.bus ? 'Bus: active' : 'Bus: idle';
  if (ui.logSummary) ui.logSummary.textContent = `${state.eventCount} events${kind ? ' • ' + kind : ''}`;
}
