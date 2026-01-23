/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.organizations.organizationsanimations
 *   role: Frontend runtime module: js/choreography/sections/organizations/OrganizationsAnimations.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/** @format */

import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';
import { motion } from '../../motion.tokens.js';

const toSeconds = value => (typeof value === 'number' ? value / 1000 : value);

export default class OrganizationsAnimations extends AbstractSectionAnimations {
  /**
   * Extends AbstractSectionAnimations, which:
   * - Stores the section root element and ID
   * - Sets up shared GSAP timeline primitives and intro/outro hooks
   * - Provides common utilities (pause/resume/reset) used by sections
   */
  /**
   * @param {HTMLElement} view
   * @param {Object} options
   */
  constructor(view, options = {}) {
    super(view);
    this.options = {
      duration: options.duration ?? toSeconds(motion.duration('slow')),
      stagger: options.stagger ?? motion.stagger('loose'),
      translateY: options.translateY ?? -motion.distance('md'),
      ease: {
        in: options.ease?.in ?? motion.ease('exit'),
        out: options.ease?.out ?? motion.ease('enter'),
      },
      ...options,
    };
  }
}
