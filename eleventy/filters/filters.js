/**
 * ---
 * aix:
 *   id: frontend.eleventy.filters.filters
 *   role: Eleventy module: eleventy/filters/filters.js
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

import arrayConfig from "./array.js";
import dateConfig from "./date.js";
import domConfig from "./dom.js";
import fileConfig from "./file.js";
import stringConfig from "./string.js";
import imageConfig from "./image.js";
import colorConfig from "./color.js";

export default function (eleventyConfig) {
  arrayConfig(eleventyConfig);
  dateConfig(eleventyConfig);
  domConfig(eleventyConfig);
  stringConfig(eleventyConfig);
  fileConfig(eleventyConfig);
  imageConfig(eleventyConfig);
  colorConfig(eleventyConfig);

  eleventyConfig.addFilter("datatype", function (value) {
    if (Array.isArray(value)) {
      return "array";
    } else if (value === null) {
      return "null";
    } else if (value instanceof Date) {
      return "date";
    } else if (typeof value === "object") {
      return "object";
    }
    return typeof value;
  });

  eleventyConfig.addFilter("findFigmaPage", function (designSystem, pageName) {
    if (!designSystem || !pageName) return null;

    return designSystem.document.children.find(
      (page) => page.name.toLowerCase() === pageName.toLowerCase(),
    );
  });

  eleventyConfig.addFilter("findRecord", function (collection, ids) {
    if (!collection || !ids) return null;

    // Convert comma-delimited string to array
    if (typeof ids === "string" && ids.includes(",")) {
      ids = ids.split(",").map((id) => id.trim());
    }

    // Handle array of IDs
    if (Array.isArray(ids)) {
      return ids
        .filter((id) => id !== null && id !== undefined) // Filter out null/undefined IDs
        .map((id) =>
          collection.find((org) => org.id.toLowerCase() === id.toLowerCase()),
        )
        .filter((org) => org !== undefined);
    }

    // Handle single ID - check for null/undefined
    if (!ids) return null;
    return collection.find((org) => org.id.toLowerCase() === ids.toLowerCase());
  });

  eleventyConfig.addFilter("filterByKey", (collection, key, value) => {
    if (!Array.isArray(collection)) {
      throw new Error(
        "Expected an array as the collection when filtering by key.",
      );
    }
    return collection.filter((record) => record[key] === value);
  });

  eleventyConfig.addFilter("featured", (collection, bool = true) => {
    if (!Array.isArray(collection)) {
      throw new Error(
        "Expected an array as the collection when filtering on the featured field.",
      );
    }
    return collection.filter((record) => record.featured === bool);
  });
}
