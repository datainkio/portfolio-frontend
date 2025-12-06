/**
 * Manager Modules Quick Reference
 *
 * Import paths and basic usage for all manager modules.
 */

// === INDIVIDUAL IMPORTS ===

// Accessibility foundation
import ReducedMotionHandler from '/assets/js/choreography/managers/ReducedMotionHandler.js';

// Background layer positioning
import BackgroundLayerManager from '/assets/js/choreography/managers/BackgroundLayerManager.js';

// GSAP ScrollSmoother integration
import ScrollSmootherManager from '/assets/js/choreography/managers/ScrollSmootherManager.js';

// Gel animation system
import GelAnimationManager from '/assets/js/choreography/managers/GelAnimationManager.js';

// === BATCH IMPORT ===
import {
  ReducedMotionHandler,
  BackgroundLayerManager,
  ScrollSmootherManager,
  GelAnimationManager,
  GEL_CONFIG,
} from '/assets/js/choreography/managers/index.js';

// === USAGE EXAMPLES ===

// 1. Reduced Motion Detection
const reducedMotion = new ReducedMotionHandler();
if (reducedMotion.isReducedMotion()) {
  console.log('User prefers reduced motion');
}
reducedMotion.onChange(enabled => {
  console.log('Motion preference changed:', enabled);
});

// 2. Background Layer Fixing
const bgLayers = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
bgLayers.fix();

// 3. Scroll Smoother Management
const scrollMgr = new ScrollSmootherManager(reducedMotion);
const smoother = scrollMgr.getSmoother(); // null if unavailable
if (scrollMgr.isActive()) {
  console.log('Smooth scrolling enabled');
}

// 4. Gel Animation
const gelMgr = new GelAnimationManager(GEL_CONFIG, reducedMotion);
gelMgr.initialize();
gelMgr.animate('#smooth-wrapper'); // or undefined for window

// 5. Coordinated Setup (StageManager pattern)
const reducedMotion2 = new ReducedMotionHandler();
const bgLayers2 = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
const scrollMgr2 = new ScrollSmootherManager(reducedMotion2);
const gelMgr2 = new GelAnimationManager(undefined, reducedMotion2);

bgLayers2.fix();
gelMgr2.initialize();
const scroller = scrollMgr2.isActive() ? '#smooth-wrapper' : undefined;
gelMgr2.animate(scroller);

// === CLEANUP ===
// Always cleanup when done
gelMgr.destroy();
scrollMgr.destroy();
reducedMotion.destroy();
