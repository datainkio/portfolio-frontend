/** @format */

import { loremChars, loremPars } from "./loremipsatron.js";
import { picture, lightbox } from "./image.js";

export default function (eleventyConfig) {
  eleventyConfig.addShortcode("loremChars", loremChars);
  eleventyConfig.addShortcode("loremPars", loremPars);
  eleventyConfig.addShortcode("picture", picture);
  eleventyConfig.addShortcode("lightbox", lightbox);
}
