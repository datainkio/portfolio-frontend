/**
 * ---
 * aix:
 *   id: frontend.js.utils.tailwind.themecolors
 *   role: Frontend runtime module: js/utils/tailwind/ThemeColors.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - utils
 *     - tailwind
 * ---
 */
// src/ThemeColors.js
import { themeColors } from './theme-colors.js';

class ThemeColors {
  constructor() {
    this.colors = themeColors;
  }

  getColor(colorName) {
    return this.colors[colorName] || null;
  }

  getColorNames() {
    return Object.keys(this.colors);
  }
}

export default ThemeColors;