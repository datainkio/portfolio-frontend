/** @format */

export default function (eleventyConfig) {
  eleventyConfig.addFilter("filesize", fileSizeFilter);
  eleventyConfig.addFilter("uniqueTypes", uniqueTypesFilter);
  eleventyConfig.addFilter("countByType", countByTypeFilter);
  eleventyConfig.addFilter("totalSize", totalSizeFilter);
  eleventyConfig.addFilter("lastCacheUpdate", lastCacheUpdateFilter);
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
