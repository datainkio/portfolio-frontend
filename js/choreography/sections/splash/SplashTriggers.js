/** @format */

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class SplashTriggers extends AbstractSectionTriggers {
  constructor(element, sectionId, section) {
    super(element, sectionId);
    this.section = section;
  }
}
