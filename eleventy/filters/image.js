/**
 * ---
 * aix:
 *   id: frontend.eleventy.filters.image
 *   role: Eleventy module: eleventy/filters/image.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - filters
 * ---
 */
/** @format */
export default function (eleventyConfig) {
  eleventyConfig.addFilter("findImage", findImageById);
}

export function findImageById(id, collection) {
  if (!collection || !id) return null;
  return collection.find((image) => image.id === id);
}
