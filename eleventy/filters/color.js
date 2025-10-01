/** @format */

export default function (eleventyConfig) {
  eleventyConfig.addFilter("multiplyBlend", multiplyBlend);
  eleventyConfig.addFilter("hexToRgb", hexToRgb);
  eleventyConfig.addFilter("rgbToHex", rgbToHex);
}

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

export function rgbToHex({ r, g, b }) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}
