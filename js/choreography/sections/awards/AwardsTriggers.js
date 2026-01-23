/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardstriggers
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsTriggers.js
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

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  bind(callbacks = {}) {
    const { onEnter, onLeave, onEnterBack, onLeaveBack } = callbacks;

    super.bind({
      onEnter: () => {
        this.section?.playIntro?.();
        onEnter?.();
      },
      onLeave: () => {
        this.section?.playOutro?.();
        onLeave?.();
      },
      onEnterBack: () => {
        this.section?.playIntro?.();
        onEnterBack?.();
      },
      onLeaveBack: () => {
        this.section?.playOutro?.();
        onLeaveBack?.();
      },
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
