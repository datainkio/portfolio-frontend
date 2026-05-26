/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.index
 *   role: Frontend runtime module: js/choreography/managers/index.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - managers
 * ---
 */
/**
 * Manager Modules - Centralized Export
 *
 * Provides convenient single import point for all manager modules.
 *
 * Usage:
 * import { ReducedMotionHandler, GelAnimationManager } from './managers/index.js';
 */

export { default as ReducedMotionHandler } from "./ReducedMotionHandler.js";
export { default as ScrollSmootherManager } from "./ScrollSmootherManager.js";
export { default as GelAnimationManager } from "./GelAnimationManager.js";
export { default as RulerIntroManager } from "./RulerIntroManager.js";
export { default as LineManager } from "./LineManager.js";
export { default as ProjectHeaderManager } from "./ProjectHeaderManager.js";
