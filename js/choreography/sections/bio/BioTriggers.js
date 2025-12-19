/** @format */

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
