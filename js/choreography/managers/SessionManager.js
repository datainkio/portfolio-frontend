/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.sessionmanager
 *   role: Frontend runtime module: js/choreography/managers/SessionManager.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - managers
 * ---
 */
import lumberjack from '../../utils/lumberjack/lumberjack.js';

/** @format */

/**
 * SessionManager
 * Manages session state and user interaction history
 */
class SessionManager {
  constructor() {
    this.sessionKey = 'dataink_session';
    this.state = this.loadState();

    lumberjack.trace('SessionManager', 'Initialized', 'brief', 'standard');
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
        'SessionManager',
        `Error loading state: ${error.message}`,
        'verbose',
        'error'
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
      heroIntroPlayed: false,
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
        'SessionManager',
        `Error saving state: ${error.message}`,
        'verbose',
        'error'
      );
    }
  }

  /**
   * Check if hero intro has been played this session
   * @returns {boolean}
   */
  get hasHeroIntroPlayed() {
    return this.state.heroIntroPlayed === true;
  }

  /**
   * Mark hero intro as played
   */
  markHeroIntroPlayed() {
    this.state.heroIntroPlayed = true;
    this.saveState();

    lumberjack.trace('SessionManager', 'Hero intro marked as played', 'brief', 'success');
  }

  /**
   * Reset session state
   */
  reset() {
    this.state = this.getDefaultState();
    this.saveState();

    lumberjack.trace('SessionManager', 'Session reset', 'brief', 'standard');
  }
}

export default SessionManager;
