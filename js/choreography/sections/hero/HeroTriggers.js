/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.herotriggers
 *   role: Frontend runtime module: js/choreography/sections/hero/HeroTriggers.js
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

import AbstractSectionTriggers from "../abstract-section/AbstractSectionTriggers.js";
export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  // bind(callbacks = {}) {
  //   // Preserve the base trigger bindings for enter/leave events
  //   super.bind(callbacks);
  //   if (!this.view) return;

  //   // // Kill existing custom trigger before re-creating
  //   // this._outroTrigger?.kill();

  //   // this._outroTrigger = ScrollTrigger.create({
  //   //   trigger: this.view,
  //   //   start: HERO_OUTRO_TRIGGER.start,
  //   //   end: HERO_OUTRO_TRIGGER.end,
  //   //   scrub: HERO_OUTRO_TRIGGER.scrub,
  //   //   onLeave: () => this.section?.playOutro?.(),
  //   //   onEnter: () => this.section?.animations?.outroReverse?.(),
  //   //   onEnterBack: () => this.section?.animations?.outroReverse?.(),
  //   // });
  // }

  destroy() {
    this.kill();
    this.section = null;
  }

  kill() {
    super.kill();
    this._outroTrigger?.kill();
    this._outroTrigger = null;
  }
}
