import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { BIO_TRIGGER } from "../../config/index/index.js";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return BIO_TRIGGER;
  }
}
