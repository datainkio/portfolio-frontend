/**
 * Centralized GSAP Vendor Setup
 *
 * Consolidates all GSAP imports and plugin registration in a single location.
 * This avoids duplication across the choreography system and provides a
 * single point of truth for GSAP configuration.
 *
 * All GSAP plugins and utilities are imported from Skypack CDN:
 * - gsap: Core animation library
 * - ScrollTrigger: Scroll-based animation plugin
 * - ScrollSmoother: Smooth scroll plugin
 * - SplitText: Text splitting utility for character/word animations
 * - Draggable: Drag interaction plugin
 *
 * USAGE:
 * import { gsap, ScrollTrigger, ScrollSmoother, SplitText, Draggable } from './vendor/gsap.js';
 *
 * // Plugins are pre-registered globally
 * const tl = gsap.timeline();
 *
 * @fileoverview Centralized GSAP vendor configuration and imports from Skypack
 */

// Import GSAP core and plugins from Skypack CDN (ES module support with CORS)
import gsap from "https://cdn.skypack.dev/gsap@3.13.0";
import ScrollTrigger from "https://cdn.skypack.dev/gsap@3.13.0/ScrollTrigger";
import ScrollSmoother from "https://cdn.skypack.dev/gsap@3.13.0/ScrollSmoother";
import SplitText from "https://cdn.skypack.dev/gsap@3.13.0/SplitText";
import Draggable from "https://cdn.skypack.dev/gsap@3.13.0/Draggable";
import { ANIMATION_DEFAULTS } from "../config/runtime.js";

// Register plugins globally so they're available to all GSAP instances
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable);

// Only pass GSAP-global properties here; section-level values like stagger/translateY stay local.
gsap.defaults({
  duration: ANIMATION_DEFAULTS.duration,
  ease: ANIMATION_DEFAULTS.ease.out,
});

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Draggable };
