// tailwind.motion.config.cjs
// Example Tailwind config extension that wires motionTokens into Tailwind utilities.
// Import this into your main tailwind.config.cjs or merge its `theme.extend` section.

const { motionTokens } = require('./motion.tokens.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // Map duration tokens to Tailwind transitionDuration
      transitionDuration: {
        instant: `${motionTokens.duration.instant}ms`,
        fast: `${motionTokens.duration.fast}ms`,
        base: `${motionTokens.duration.base}ms`,
        slow: `${motionTokens.duration.slow}ms`,
        slower: `${motionTokens.duration.slower}ms`
      },

      // Map ease tokens to Tailwind transitionTimingFunction
      transitionTimingFunction: {
        standard: motionTokens.ease.standard,
        enter: motionTokens.ease.enter,
        exit: motionTokens.ease.exit,
        emphasis: motionTokens.ease.emphasis
        // springy intentionally omitted; better used directly in GSAP
      },

      // Optional: utility-friendly spacing aliases for motion distances
      spacing: {
        'motion-xs': `${motionTokens.distance.xs}px`,
        'motion-sm': `${motionTokens.distance.sm}px`,
        'motion-md': `${motionTokens.distance.md}px`,
        'motion-lg': `${motionTokens.distance.lg}px`,
        'motion-xl': `${motionTokens.distance.xl}px`
      }
    }
  }
};
