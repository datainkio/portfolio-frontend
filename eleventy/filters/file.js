/**
 * ---
 * aix:
 *   id: frontend.eleventy.filters.file
 *   role: Eleventy module: eleventy/filters/file.js
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

const svgMarkupCache = new Map();

export default function (eleventyConfig) {
  eleventyConfig.addFilter("filesize", fileSizeFilter);
  eleventyConfig.addFilter("uniqueTypes", uniqueTypesFilter);
  eleventyConfig.addFilter("countByType", countByTypeFilter);
  eleventyConfig.addFilter("totalSize", totalSizeFilter);
  eleventyConfig.addFilter("lastCacheUpdate", lastCacheUpdateFilter);
  eleventyConfig.addAsyncFilter(
    "inlineSvgFromUrl",
    async function (url, className = "") {
      try {
        if (!url || typeof url !== "string") {
          return "";
        }

        let svgMarkup = svgMarkupCache.get(url);
        if (!svgMarkup) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch SVG: ${response.status} ${response.statusText}`,
            );
          }

          svgMarkup = await response.text();
          svgMarkupCache.set(url, svgMarkup);
        }

        return injectSvgClass(svgMarkup, className);
      } catch (error) {
        console.warn(`inlineSvgFromUrl failed for ${url}: ${error.message}`);
        return "";
      }
    },
  );
}

function mergeClasses(existing = "", additional = "") {
  const tokens = `${existing} ${additional}`
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  return [...new Set(tokens)].join(" ");
}

function injectSvgClass(svgMarkup, className) {
  if (!svgMarkup || typeof svgMarkup !== "string") {
    return "";
  }

  return svgMarkup.replace(/<svg\b([^>]*)>/i, (match, attributes) => {
    const classMatch = attributes.match(/\sclass=(['"])(.*?)\1/i);

    if (classMatch) {
      const mergedClassName = mergeClasses(classMatch[2], className);
      return match.replace(classMatch[0], ` class="${mergedClassName}"`);
    }

    return `<svg${attributes} class="${className}">`;
  });
}

export function fileSizeFilter(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export function uniqueTypesFilter(array) {
  // Guard clause to handle undefined/null arrays
  if (!array || !Array.isArray(array)) {
    return [];
  }

  // Now safely use reduce
  return array.reduce((unique, item) => {
    if (!unique.includes(item.type)) {
      unique.push(item.type);
    }
    return unique;
  }, []);
}

export function countByTypeFilter(files, type) {
  return files.filter((file) => file.type === type).length;
}

export function totalSizeFilter(files) {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}

export function lastCacheUpdateFilter(files) {
  const timestamps = files.map((file) => file.cacheDate).filter(Boolean);
  return timestamps.length
    ? new Date(Math.max(...timestamps)).toLocaleString()
    : "Not cached";
}
