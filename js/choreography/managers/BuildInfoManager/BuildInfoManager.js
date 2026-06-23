import { BUILD_INFO_SELECTORS as SEL } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const ATTR = SEL.elementAttribute;

/**
 * BuildInfoManager — click-driven disclosure for the section-cap build info.
 *
 * State machine:
 *   closed → click <toggle> (the <time>) → open: list shown
 *   open   → click <toggle> OR anywhere in the build-info region → closed: list hidden
 *
 * No motion: the list toggles in/out of view via inline `display` (which wins
 * over the Tailwind `flex` utility). A single delegated click listener on the
 * root distinguishes the toggle from the rest of the region. No-ops gracefully
 * when the markup is absent.
 */
export default class BuildInfoManager {
  constructor() {
    this.logger = lumberjack.createScoped("BuildInfoManager", {
      color: "#22D3EE",
      enabled: true,
    });

    this._root = document.querySelector(`[${ATTR}="${SEL.root}"]`);

    if (!this._root) {
      this.logger.trace("root not found; BuildInfoManager disabled");
      return;
    }

    this._toggle = this._root.querySelector(`[${ATTR}="${SEL.toggle}"]`);
    this._list = this._root.querySelector(`[${ATTR}="${SEL.list}"]`);
    // Cap <ul> ancestor: carries the open-state attribute that drives item basis.
    this._cap = this._root.closest(`[${ATTR}="${SEL.cap}"]`);

    if (!this._toggle || !this._list) {
      this.logger.trace("toggle/list not found; BuildInfoManager disabled");
      return;
    }

    this._open = false;
    this._onClick = (event) => this._handleClick(event);

    this._init();
  }

  _init() {
    this._list.style.display = "none";
    this._root.addEventListener("click", this._onClick);
    this.logger.trace("initialized");
  }

  _handleClick(event) {
    if (event.target.closest(`[${ATTR}="${SEL.close}"]`)) {
      this.close();
      return;
    }
    if (event.target.closest(`[${ATTR}="${SEL.toggle}"]`)) {
      this.open();
    }
  }

  open() {
    if (this._open) return;
    this._open = true;
    this._toggle.setAttribute("aria-expanded", "true");
    this._list.setAttribute("aria-hidden", "false");
    this._list.style.display = "";
    this._cap?.setAttribute(SEL.openAttribute, "");
  }

  close() {
    if (!this._open) return;
    this._open = false;
    this._toggle.setAttribute("aria-expanded", "false");
    this._list.setAttribute("aria-hidden", "true");
    this._list.style.display = "none";
    this._cap?.removeAttribute(SEL.openAttribute);
  }

  kill() {
    this._root?.removeEventListener("click", this._onClick);
    this.logger.trace("destroyed");
  }
}
