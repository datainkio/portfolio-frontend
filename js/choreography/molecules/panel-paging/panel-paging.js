/**
 * Pages a run of full-viewport panels.
 *
 * One gesture (wheel, touch swipe, or paging key) tweens the scroll straight to
 * the next or previous panel's top. Native scroll never moves the page while
 * paging is engaged, so a panel only ever comes to rest at its destination.
 *
 * Engaged while the scroll sits above the last panel's top. Landing on the last
 * panel releases native scroll so the page carries on past it; scrolling back
 * up across that top re-engages and pages to the previous panel.
 *
 * Scroll is driven through ScrollSmoother when it exists, else the window.
 * ScrollSmoother's normalizer scrolls the page on wheel/touch by itself, so it
 * is disabled while engaged (the same thing ScrollSmoother#paused does).
 *
 * Reduced motion returns a no-op handle and leaves native scroll alone.
 *
 * @param {{
 *   panels: Element[],
 *   id: string,
 *   duration: number,
 *   ease: string,
 *   reduceMotion?: boolean
 * }} param0
 * @returns {{ kill(): void }}
 */
import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
} from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

// Key → direction. Shift+Space reverses Space.
const PAGE_KEYS = {
  ArrowDown: 1,
  PageDown: 1,
  " ": 1,
  ArrowUp: -1,
  PageUp: -1,
};
// Keys typed into these keep their native meaning.
const KEY_EXEMPT = "input, textarea, select, button, [contenteditable]";
// Within this many px of a stop counts as resting on it.
const EPSILON = 1;

export function createPanelPaging({
  panels,
  id,
  duration,
  ease,
  reduceMotion,
}) {
  if (!panels || panels.length < 2 || isReducedMotion(reduceMotion)) {
    return { kill() {} };
  }

  const getY = () => ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
  const setY = (y) => {
    const smoother = ScrollSmoother.get();
    smoother ? smoother.scrollTop(y) : window.scrollTo(0, y);
  };
  // Measured on demand, so a resize or late layout shift never leaves stale stops.
  const stops = () => {
    const y = getY();
    return panels.map((panel) => panel.getBoundingClientRect().top + y);
  };

  let tween = null;
  let restIndex = 0;
  let engaged = false;
  let normalizer = null;
  // Set by a gesture page, cleared when that gesture stops, so trackpad momentum
  // still arriving after the tween can't page a second time.
  let awaitingStop = false;

  // direction: 1 next, -1 previous, 0 nearest.
  const goTo = (direction) => {
    if (tween) return false;
    const y = getY();
    const points = stops();
    let index;
    if (direction > 0) {
      index = points.findIndex((stop) => stop > y + EPSILON);
    } else if (direction < 0) {
      index = points.findLastIndex((stop) => stop < y - EPSILON);
    } else {
      index = points.reduce(
        (best, stop, i) =>
          Math.abs(stop - y) < Math.abs(points[best] - y) ? i : best,
        0,
      );
    }
    if (index < 0) return false;
    restIndex = index;
    if (Math.abs(points[index] - y) <= EPSILON) return false;

    const proxy = { y };
    tween = gsap.to(proxy, {
      y: points[index],
      duration,
      ease,
      onUpdate: () => setY(proxy.y),
      onComplete: () => {
        tween = null;
      },
    });
    return true;
  };

  const page = (direction) => {
    if (awaitingStop) return;
    if (goTo(direction)) awaitingStop = true;
  };

  const onKey = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey) return;
    if (event.metaKey || event.target.closest?.(KEY_EXEMPT)) return;
    let direction = PAGE_KEYS[event.key];
    if (!direction) return;
    if (event.key === " " && event.shiftKey) direction = -1;
    event.preventDefault();
    goTo(direction);
  };

  // wheelSpeed -1 lines wheel up with a touch swipe up: both read as onUp,
  // which means "move to the next panel".
  const observer = ScrollTrigger.observe({
    type: "wheel,touch",
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onUp: () => page(1),
    onDown: () => page(-1),
    onStop: () => {
      awaitingStop = false;
    },
  });
  observer.disable();

  const engage = () => {
    if (engaged) return;
    engaged = true;
    normalizer = ScrollTrigger.normalizeScroll();
    normalizer?.disable();
    observer.enable();
    window.addEventListener("keydown", onKey);
  };

  const release = () => {
    if (!engaged) return;
    engaged = false;
    awaitingStop = false;
    observer.disable();
    window.removeEventListener("keydown", onKey);
    normalizer?.enable();
    normalizer = null;
  };

  // Above the last panel's top: engaged, and if native scroll left the page
  // between stops (re-entry from below), page on in the direction of travel.
  const sync = (direction) => {
    const points = stops();
    const y = getY();
    if (y >= points[points.length - 1] - EPSILON) {
      release();
      return;
    }
    engage();
    goTo(direction);
  };

  const trigger = ScrollTrigger.create({
    id,
    trigger: panels[0],
    start: "top top",
    endTrigger: panels[panels.length - 1],
    end: "top top",
    invalidateOnRefresh: true,
    onUpdate: (self) => sync(self.direction),
    // A resize moves every stop; put the resting panel back at the top.
    onRefresh: () => {
      if (engaged && !tween) setY(stops()[restIndex]);
    },
  });

  sync(0);

  return {
    kill() {
      trigger.kill();
      tween?.kill();
      tween = null;
      release();
      observer.kill();
    },
  };
}
