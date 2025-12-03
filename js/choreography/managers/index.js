/**
 * Manager Modules - Centralized Export
 *
 * Provides convenient single import point for all manager modules.
 *
 * Usage:
 * import { ReducedMotionHandler, GelAnimationManager } from './managers/index.js';
 */

export { default as ReducedMotionHandler } from './ReducedMotionHandler.js';
export { default as BackgroundLayerManager } from './BackgroundLayerManager.js';
export { default as ScrollSmootherManager } from './ScrollSmootherManager.js';
export { default as GelAnimationManager, DEFAULT_GEL_CONFIG } from './GelAnimationManager.js';
