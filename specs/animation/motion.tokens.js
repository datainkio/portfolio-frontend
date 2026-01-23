/**
 * ---
 * aix:
 *   id: frontend.specs.animation.motion.tokens
 *   role: Shared motion tokens for frontend choreography and motion tooling.
 *   status: stable
 *   surface: internal
 *   owner: Frontend
 *   tags:
 *     - motion
 *     - tokens
 *     - animation
 *   scope: frontend
 *   runtime: shared
 *   perf:
 *     readPriority: low
 *     cacheSafe: true
 *     critical: false
 * ---
 */
// motion.tokens.js
// Shared motion tokens for GSAP and Tailwind.
// Source of truth for durations, eases, distances, and stagger values.

export const motionTokens = {
  duration: {
    // Very fast, nearly instant UI feedback (e.g., button hover)
    instant: 80,
    // Standard UI affordances, small transitions
    fast: 150,
    // Default duration for most component transitions
    base: 220,
    // More noticeable transitions (modals, section reveals)
    slow: 320,
    // Hero-level or narrative motion, use sparingly
    slower: 480
  },

  ease: {
    // General-purpose “material-ish” curve
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // Ease-out for elements entering
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    // Ease-in for elements exiting
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    // Slightly more pronounced than standard; use for emphasis
    emphasis: 'cubic-bezier(0.3, 0.0, 0.2, 1.1)',
    // For elastic/overshoot-y motion in GSAP; not mapped to Tailwind by default
    springy: 'cubic-bezier(0.2, 0.8, 0.2, 1.4)'
  },

  distance: {
    // Distances in pixels; convert to rems in Tailwind if desired
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40
  },

  stagger: {
    // Stagger values in seconds, for GSAP timelines
    none: 0,
    tight: 0.05,
    base: 0.08,
    loose: 0.12
  }
};

// Convenience helpers for GSAP usage
export const motion = {
  duration(name = 'base') {
    return motionTokens.duration[name] ?? motionTokens.duration.base;
  },
  ease(name = 'standard') {
    return motionTokens.ease[name] ?? motionTokens.ease.standard;
  },
  distance(name = 'md') {
    return motionTokens.distance[name] ?? motionTokens.distance.md;
  },
  stagger(name = 'base') {
    return motionTokens.stagger[name] ?? motionTokens.stagger.base;
  }
};
