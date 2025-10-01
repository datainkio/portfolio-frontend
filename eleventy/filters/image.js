/** @format */
export default function (eleventyConfig) {
  eleventyConfig.addFilter("findImage", findImageById);
}

export function findImageById(id, collection) {
  if (!collection || !id) return null;
  return collection.find((image) => image.id === id);
}
