/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardsanimations
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsAnimations.js
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

export default class AwardsAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? toSeconds(motion.duration('slower')),
      stagger: options.stagger ?? motion.stagger('base'),
      translateY: options.translateY ?? -motion.distance('lg'),
      ease: {
        in: options.ease?.in ?? motion.ease('exit'),
        out: options.ease?.out ?? motion.ease('enter'),
      },
    };

    this.targets = this._getTargets();
    this._buildTimelines();
  }

  intro() {
    return this.timeline.play('intro');
  }

  outro() {
    return this.timeline.play('outro');
  }

  _getTargets() {
    if (!this.view) return [];

    const listItems = Array.from(this.view.querySelectorAll('.awards-list__item'));
    if (listItems.length) return listItems;

    const emptyState = this.view.querySelector('.awards-list__empty');
    return emptyState ? [emptyState] : [];
  }

  _buildTimelines() {
    if (!this.view || !this.targets.length) return;

    const { duration, stagger, translateY, ease } = this.options;

    this.timeline.clear();

    // Intro
    this.timeline.addLabel('intro', 0);
    this.timeline.set(this.view, { autoAlpha: 1 }, 'intro');
    this.timeline.set(this.targets, { autoAlpha: 0, y: translateY }, 'intro');
    this.timeline.to(
      this.targets,
      {
        autoAlpha: 1,
        y: 0,
        duration,
        ease: ease.out,
        stagger,
      },
      'intro'
    );
    this.timeline.addLabel('intro:end', this.timeline.duration());
    this.timeline.addPause('intro:end');

    // Outro
    this.timeline.addLabel('outro', this.timeline.duration());
    this.timeline.to(
      this.targets,
      {
        autoAlpha: 0,
        y: translateY * 0.5,
        duration: duration * 0.8,
        ease: ease.in,
        stagger: Math.min(stagger, 0.1),
      },
      'outro'
    );
    this.timeline.addLabel('outro:end', this.timeline.duration());
    this.timeline.addPause('outro:end');
  }
}
