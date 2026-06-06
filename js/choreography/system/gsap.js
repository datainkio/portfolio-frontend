/**
 * Centralized GSAP Vendor Setup
 *
 * Consolidates all GSAP imports and plugin registration in a single location.
 * This avoids duplication across the choreography system and provides a
 * single point of truth for GSAP configuration.
 *
 * All GSAP plugins and utilities are imported from local npm-vendored modules:
 * - gsap: Core animation library
 * - ScrollTrigger: Scroll-based animation plugin
 * - ScrollSmoother: Smooth scroll plugin
 * - SplitText: Text splitting utility for character/word animations
 * - Draggable: Drag interaction plugin
 *
 * USAGE:
 * import { gsap, ScrollTrigger, ScrollSmoother, SplitText, Draggable } from './system/gsap.js';
 *
 * @fileoverview Centralized GSAP vendor configuration and imports from local modules
 */

import gsap from "/assets/js/vendor/gsap/index.js";
import ScrollTrigger from "/assets/js/vendor/gsap/ScrollTrigger.js";
import ScrollSmoother from "/assets/js/vendor/gsap/ScrollSmoother.js";
import SplitText from "/assets/js/vendor/gsap/SplitText.js";
import Draggable from "/assets/js/vendor/gsap/Draggable.js";
import MotionPathPlugin from "/assets/js/vendor/gsap/MotionPathPlugin.js";
import MotionPathHelper from "/assets/js/vendor/gsap/MotionPathHelper.js";
import { ANIMATION_DEFAULTS } from "../config/index/index.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable, MotionPathPlugin, MotionPathHelper);

// Only pass GSAP-global properties here; section-level values like stagger/translateY stay local.
gsap.defaults({
  duration: ANIMATION_DEFAULTS.duration,
  ease: ANIMATION_DEFAULTS.ease.out,
  overwrite: ANIMATION_DEFAULTS.overwrite,
});

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Draggable, MotionPathPlugin, MotionPathHelper };
