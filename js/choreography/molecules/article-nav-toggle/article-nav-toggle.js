/**
 * Article Nav Toggle Molecule
 *
 * Collapses/expands the article jump-links list on mobile. Above the sm
 * breakpoint the toggle is hidden by CSS and the list is always visible;
 * GSAP inline styles are cleared so nothing bleeds into the sidebar layout.
 *
 * Usage:
 *   const toggle = createArticleNavToggle(nav);
 *   // nav must contain [data-article-nav-toggle] and [data-article-nav-list].
 *   // Call toggle.destroy() to remove listeners when the element leaves the DOM.
 *
 * @example
 * const nav = document.querySelector('[data-article-nav-links]');
 * if (nav) createArticleNavToggle(nav);
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";

const SM_BREAKPOINT = "(min-width: 40rem)";

/**
 * @param {HTMLElement} nav - The <nav data-article-nav-links> element.
 * @returns {{ open(): void, close(): void, toggle(): void, destroy(): void } | null}
 */
export function createArticleNavToggle(nav) {
  const btn = nav.querySelector("[data-article-nav-toggle]");
  const container = nav.querySelector("[data-article-nav-list]");
  if (!btn || !container) return null;

  const chevron = btn.querySelector("[data-chevron]");
  let isOpen = false;

  const durOpen = motion.duration("base") / 1000;
  const durClose = motion.duration("fast") / 1000;
  const easeOpen = motion.ease("enter");
  const easeClose = motion.ease("exit");

  function open() {
    isOpen = true;
    btn.setAttribute("aria-expanded", "true");
    gsap.to(container, {
      height: container.scrollHeight,
      autoAlpha: 1,
      duration: durOpen,
      ease: easeOpen,
    });
    if (chevron) {
      gsap.to(chevron, { rotation: 180, duration: durClose, ease: easeOpen });
    }
  }

  function close() {
    isOpen = false;
    btn.setAttribute("aria-expanded", "false");
    gsap.to(container, {
      height: 0,
      autoAlpha: 0,
      duration: durClose,
      ease: easeClose,
    });
    if (chevron) {
      gsap.to(chevron, { rotation: 0, duration: durClose, ease: easeClose });
    }
  }

  function reset() {
    isOpen = true;
    btn.setAttribute("aria-expanded", "true");
    gsap.set(container, { clearProps: "height,opacity,visibility" });
    if (chevron) gsap.set(chevron, { clearProps: "rotation" });
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  const mq = window.matchMedia(SM_BREAKPOINT);

  function handleBreakpoint(e) {
    if (e.matches) {
      reset();
    } else {
      gsap.set(container, { height: 0, autoAlpha: 0 });
      isOpen = false;
      btn.setAttribute("aria-expanded", "false");
      if (chevron) gsap.set(chevron, { rotation: 0 });
    }
  }

  if (mq.matches) {
    reset();
  } else {
    gsap.set(container, { height: 0, autoAlpha: 0 });
  }

  mq.addEventListener("change", handleBreakpoint);
  btn.addEventListener("click", toggle);

  return {
    open,
    close,
    toggle,
    destroy() {
      btn.removeEventListener("click", toggle);
      mq.removeEventListener("change", handleBreakpoint);
    },
  };
}
