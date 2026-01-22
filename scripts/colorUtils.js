/**
 * ---
 * aix:
 *   id: frontend.scripts.colorutils
 *   role: Build/utility script: scripts/colorUtils.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - colorUtils.js
 * ---
 */
/** @format */

export function multiplyBlend(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const blendedRgb = {
    r: Math.floor((rgb1.r * rgb2.r) / 255),
    g: Math.floor((rgb1.g * rgb2.g) / 255),
    b: Math.floor((rgb1.b * rgb2.b) / 255)
  };
  return rgbToHex(blendedRgb);
}

export function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export function rgbToHex({ r, g, b, a }) {
  const toHex = (n) => {
    const int = Math.round(n * 255);
    const hex = int.toString(16);
    return hex.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
