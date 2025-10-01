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