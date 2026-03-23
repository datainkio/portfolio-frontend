/**
 * ACCESSIBILITY SETTINGS
 *
 * Reduced motion settings for users who prefer less animation.
 * These values are used by the ReducedMotionHandler to adjust animation behavior.
 */
export const ACCESSIBILITY_SETTINGS = {
  prefersReducedMotion: false, // default; will be updated by ReducedMotionHandler
  reducedMotionDuration: 0.1, // seconds
  reducedMotionStagger: 0.05, // seconds
  reducedMotionEase: "none", // no easing for reduced motion
};
