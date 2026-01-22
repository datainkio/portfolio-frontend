/**
 * ---
 * aix:
 *   id: frontend.eleventy.shortcodes.shortcodes
 *   role: Eleventy module: eleventy/shortcodes/shortcodes.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - shortcodes
 * ---
 */
/** @format */

import { loremChars, loremPars } from "./loremipsatron.js";
import { picture, lightbox } from "./image.js";

export default function (eleventyConfig) {
  eleventyConfig.addShortcode("loremChars", loremChars);
  eleventyConfig.addShortcode("loremPars", loremPars);
  eleventyConfig.addShortcode("picture", picture);
  eleventyConfig.addShortcode("lightbox", lightbox);
}
