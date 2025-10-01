/** @format */

export default function (eleventyConfig) {
  eleventyConfig.addFilter("sum", sum);
  eleventyConfig.addFilter("groupBy", groupByFilter);
  eleventyConfig.addFilter("getByIndex", getByIndex);
  eleventyConfig.addFilter("unique", getUniqueItems);
  eleventyConfig.addFilter("findIndexOf", findIndexOf);
  eleventyConfig.addFilter("sortByKey", sortByKey);
  eleventyConfig.addFilter("getByIndexRange", getByIndexRange);
}

export function sortByKey(array, key) {
  if (!Array.isArray(array)) return [];
  // Use a succinct comparison trick: (a > b) - (a < b) => 1 - 0 = 1 for a > b, etc.
  return [...array].sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]));
}

export function findIndexOf(array, element) {
  if (Array.isArray(array)) {
    return array.indexOf(element);
  }
  return -1; // Return -1 if the first argument isn't an array
}

export function getByIndexRange(array, startIndex, endIndex) {
  if (!Array.isArray(array)) return [];

  // Default startIndex to 0 if undefined
  const start =
    startIndex !== undefined ? Math.max(0, parseInt(startIndex, 10)) : 0;

  // Default endIndex to the last element if undefined
  const end =
    endIndex !== undefined
      ? Math.min(array.length - 1, parseInt(endIndex, 10))
      : array.length - 1;

  if (start > end) return [];
  return array.slice(start, end + 1);
}

export function getByIndex(input, index) {
  if (!input) return "";

  // Check if input is an array or a string
  let items = Array.isArray(input) ? input : input.split(",");

  // Parse the index to ensure it's an integer
  const idx = parseInt(index, 10);

  // Return the item at the given index, trimmed, or a fallback if out of range
  return items.length > idx && idx >= 0 ? items[idx].trim() : "Not found";
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

export function groupByFilter(array, key) {
  try {
    return array.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  } catch (error) {
    console.error("Error in groupBy filter", key, array);
    return {};
  }
}

export function getUniqueItems(array, field) {
  if (!array || !Array.isArray(array) || !field) return [];

  const seen = new Set();

  return array.filter((item) => {
    const value = Array.isArray(item[field]) ? item[field][0] : item[field];

    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
