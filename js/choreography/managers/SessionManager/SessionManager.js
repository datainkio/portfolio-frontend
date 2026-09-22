import lumberjack from "/assets/js/utils/lumberjack/index.js";

/** @format */

/**
 * Session gating switch. When false, every visit is treated as a first visit:
 * the preloader splash replays, every section replays its intro, and the
 * `visited` / `played` flags are neither read nor written. The pre-paint
 * return-visit script (session-management-script.njk) needs no mirror of this
 * flag — it keys off `visited`, which is never persisted while gating is off,
 * and any stale `visited` from a gated session is cleared on construction.
 */
export const SESSION_GATING_ENABLED = false;

/**
 * SessionManager
 * Manages session state and user interaction history
 */
class SessionManager {
  constructor() {
    // Mirrored by hand in views/templates/partials/session-management-script/session-management-script.njk
    // (pre-paint, can't import). Rename both together.
    this.sessionKey = "dataink_session";
    this.state = this.loadState();

    if (
      !SESSION_GATING_ENABLED &&
      (this.state.visited || Object.keys(this.state.played ?? {}).length)
    ) {
      // Gating was on earlier this session; drop the flags so the pre-paint
      // script stops short-circuiting the splash.
      this.state = { ...this.state, visited: false, played: {} };
      this.saveState();
    }

    lumberjack.trace(
      "SessionManager",
      `Initialized (gating ${SESSION_GATING_ENABLED ? "on" : "off"})`,
      "brief",
      "standard",
    );
  }

  /**
   * Load state from sessionStorage
   * @returns {Object} Session state
   */
  loadState() {
    try {
      const stored = sessionStorage.getItem(this.sessionKey);
      return stored ? JSON.parse(stored) : this.getDefaultState();
    } catch (error) {
      lumberjack.trace(
        "SessionManager",
        `Error loading state: ${error.message}`,
        "verbose",
        "error",
      );
      return this.getDefaultState();
    }
  }

  /**
   * Get default session state
   * @returns {Object} Default state
   */
  getDefaultState() {
    return {
      visited: false,
      played: {},
      lastVisit: Date.now(),
      interactions: {},
    };
  }

  /**
   * Save state to sessionStorage
   */
  saveState() {
    try {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.state));
    } catch (error) {
      lumberjack.trace(
        "SessionManager",
        `Error saving state: ${error.message}`,
        "verbose",
        "error",
      );
    }
  }

  /**
   * Whether a section's entrance animation has already played this session.
   * @param {string} sectionKey
   * @returns {boolean}
   */
  hasPlayed(sectionKey) {
    if (!SESSION_GATING_ENABLED) return false;
    return this.state.played?.[sectionKey] === true;
  }

  /**
   * Mark a section's entrance animation as played this session.
   *
   * Re-reads sessionStorage before merging so a stale in-memory snapshot never
   * clobbers another section's already-recorded played state.
   * @param {string} sectionKey
   */
  markPlayed(sectionKey) {
    if (!SESSION_GATING_ENABLED) return;
    const fresh = this.loadState();
    this.state = {
      ...fresh,
      played: { ...fresh.played, [sectionKey]: true },
    };
    this.saveState();

    lumberjack.trace(
      "SessionManager",
      `${sectionKey} marked as played`,
      "brief",
      "success",
    );
  }

  /**
   * Whether the preloader has already run once this session — i.e. this is a
   * repeat visit to the site within the same tab session, distinct from any
   * single section's played state (a visitor can leave before anything
   * finishes animating and still have "visited").
   * @returns {boolean}
   */
  hasVisited() {
    if (!SESSION_GATING_ENABLED) return false;
    return this.state.visited === true;
  }

  /**
   * Mark that the preloader has run once this session. Re-reads sessionStorage
   * first for the same reason markPlayed() does.
   */
  markVisited() {
    if (!SESSION_GATING_ENABLED) return;
    const fresh = this.loadState();
    this.state = { ...fresh, visited: true };
    this.saveState();

    lumberjack.trace(
      "SessionManager",
      "Session marked as visited",
      "brief",
      "success",
    );
  }

  /**
   * Reset session state
   */
  reset() {
    this.state = this.getDefaultState();
    this.saveState();

    lumberjack.trace("SessionManager", "Session reset", "brief", "standard");
  }
}

export default SessionManager;

let singleton = null;

/**
 * Get the shared SessionManager instance, creating it on first call.
 *
 * A single shared instance (mirrors the RulerIntroManager ad hoc singleton
 * pattern) means every section's hasPlayed()/markPlayed() call reads and
 * writes the same in-memory state, so no independent per-instance snapshot
 * can clobber another section's already-recorded played state on save.
 * @returns {SessionManager}
 */
export function getSessionManager() {
  if (!singleton) {
    singleton = new SessionManager();
  }
  return singleton;
}
