/** @format */
import { imageUrl } from "../../data/sanity/transforms/imageUrls.js";

export default function (eleventyConfig) {
  // Take advantage of Sanity's helper to set params per image (note: the filter keeps "auto=format" because it's required for proper image optimization)
  eleventyConfig.addFilter("imageUrl", imageUrl);
  // Data retrieval
  eleventyConfig.addFilter("findImage", findImageById);
}

export function findImageById(id, collection) {
  if (!collection || !id) return null;
  return collection.find((image) => image.id === id);
}
