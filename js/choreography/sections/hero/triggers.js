/** @format */

/**
 * Hero Section Scroll Triggers
 *
 * Factory for creating scroll-driven timelines tied to the hero title.
 * Mirrors the scoped API pattern used by animations.js.
 *
 * @module Hero/Triggers
 */

import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { gsap } from '/assets/js/gsap/all.js';

// Register GSAP plugin (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

// Defaults
const START = 'center center';
const END = 'bottom center';
const SCRUB = 1;

/**
 * Create a scoped hero triggers helper
 * @param {HTMLElement} element - The hero title element
 * @param {gsap.core.Timeline|null} introTimeline - The intro timeline to reverse/drive
 * @param {string} scopeId - Section id used for namespacing
 * @param {AnimationBus|null} bus - Optional bus for coordination events
 */
export function createHeroTriggers(element, introTimeline, scopeId = 'main-header', bus = null) {
  const scopedId = suffix => `${scopeId}:${suffix}`;

  /**
   * Attach scroll trigger to drive reverse of the intro timeline.
   * If no timeline is provided, returns null.
   */
  function attachReverseOnScroll(options = {}) {
    if (!element || !introTimeline) return null;

    const { start = START, end = END, scrub = SCRUB } = options;

    const trigger = ScrollTrigger.create({
      id: scopedId('title-reverse'),
      trigger: element,
      start,
      end,
      scrub,
      onEnter: () => {
        bus?.emit(`section:${scopeId}:scroll:enter`, { sectionId: scopeId, element });
      },
      onLeave: () => {
        bus?.emit(`section:${scopeId}:scroll:exit`, { sectionId: scopeId, element });
        bus?.emit(`section:${scopeId}:outro:start`, { sectionId: scopeId, element });
      },
      // Drive the timeline progress with scroll: from end → start (reverse)
      animation: introTimeline,
    });

    // Ensure the timeline is set to end before reversing via scroll
    introTimeline.progress(1).pause();
    introTimeline.reverse();

    return trigger;
  }

  return {
    attachReverseOnScroll,
  };
}

export const HeroTriggers = {
  create: createHeroTriggers,
};

export default HeroTriggers;
