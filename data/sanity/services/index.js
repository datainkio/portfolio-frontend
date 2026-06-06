/**
 * ---
 * aix:
 *   id: frontend.cms.services.index
 *   role: Public API for the CMS services layer. Primary import surface for Eleventy.
 *   status: stable
 *   surface: internal
 *   tags:
 *     - frontend
 *     - cms
 *     - services
 *   type: module
 *   scope: frontend
 *   audience: maintainers
 *   perf:
 *     readPriority: high
 *     cacheSafe: true
 *     critical: true
 * ---
 */
/** @format */

export { init } from "./sanityService.js";
