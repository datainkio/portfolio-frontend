/** @format */

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class BackgroundVideoTriggers extends AbstractSectionTriggers {
  constructor(element, sectionId) {
    super(element, sectionId);
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
