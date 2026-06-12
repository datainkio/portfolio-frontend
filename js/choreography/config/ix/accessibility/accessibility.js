/**
 * ACCESSIBILITY SETTINGS
 *
 * Reduced motion settings for users who prefer less animation.
 * These values are used by the ReducedMotionHandler to adjust animation behavior.
 */
export const ACCESSIBILITY_SETTINGS = {
  testReducedMotion: false, // dev override: force reduced motion on regardless of OS setting (see ReducedMotionHandler._setup)
  // TODO: deprecate the above in favor of a query param override, which would be more flexible and less likely to be accidentally left on in dev
  // reducedMotionDuration: 0.1, // seconds
  // reducedMotionStagger: 0.05, // seconds
  // reducedMotionEase: "none", // no easing for reduced motion
};
