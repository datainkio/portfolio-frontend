/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config.motion
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

export const motionTokens = {
  duration: {
    instant: 80,
    fast: 150,
    base: 220,
    slow: 320,
    slower: 480,
  },

  ease: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
    emphasis: "cubic-bezier(0.3, 0.0, 0.2, 1.1)",
    springy: "cubic-bezier(0.2, 0.8, 0.2, 1.4)",
  },

  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },

  stagger: {
    none: 0,
    tight: 0.05,
    base: 0.1,
    loose: 0.12,
  },
};

export const motion = {
  duration(name = "base") {
    return motionTokens.duration[name] ?? motionTokens.duration.base;
  },
  ease(name = "standard") {
    return motionTokens.ease[name] ?? motionTokens.ease.standard;
  },
  distance(name = "md") {
    return motionTokens.distance[name] ?? motionTokens.distance.md;
  },
  stagger(name = "base") {
    return motionTokens.stagger[name] ?? motionTokens.stagger.base;
  },
};
