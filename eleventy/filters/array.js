/** @format */

/**
 * Array Filters for Eleventy
 *
 * Provides array manipulation and querying utilities for templates:
 * - Grouping items by key (e.g., projects by category)
 * - Finding, sorting, and filtering arrays
 * - Extracting subsets and unique items
 * - Summing numeric values
 *
 * CRITICAL FILTER: findRecord (in filters.js)
 * This filter connects Airtable record IDs to actual content:
 * {{ collections.organizations | findRecord(project.organization_ids) }}
 *
 * USAGE PATTERNS:
 * {{ items | groupBy("category") }}        {# Group by property #}
 * {{ items | unique("id") }}               {# Remove duplicates #}
 * {{ items | sortByKey("date") }}          {# Sort by property #}
 * {{ items | getByIndexRange(0, 5) }}      {# Get subset #}
 * {{ numbers | sum }}                      {# Total numeric values #}
 */

export default function (eleventyConfig) {
  eleventyConfig.addFilter('sum', sum);
  eleventyConfig.addFilter('groupBy', groupByFilter);
  eleventyConfig.addFilter('getByIndex', getByIndex);
  eleventyConfig.addFilter('unique', getUniqueItems);
  eleventyConfig.addFilter('findIndexOf', findIndexOf);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('getByIndexRange', getByIndexRange);
}

/**
 * Sort an array by a specific property key.
 * Uses numeric comparison for consistent sorting.
 *
 * @param {Array} array - Array to sort
 * @param {string} key - Property name to sort by
 * @returns {Array} New sorted array (doesn't mutate original)
 *
 * EXAMPLE:
 * {{ projects | sortByKey("date") }}      {# Sort by date property #}
 * {{ items | sortByKey("priority") }}     {# Sort by priority #}
 */
export function sortByKey(array, key) {
  if (!Array.isArray(array)) return [];
  // Use a succinct comparison trick: (a > b) - (a < b) => 1 - 0 = 1 for a > b, etc.
  return [...array].sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]));
}

/**
 * Find the index position of an element in an array.
 *
 * @param {Array} array - Array to search
 * @param {*} element - Element to find
 * @returns {number} Index position or -1 if not found
 *
 * EXAMPLE:
 * {{ items | findIndexOf(targetItem) }}
 */
export function findIndexOf(array, element) {
  if (Array.isArray(array)) {
    return array.indexOf(element);
  }
  return -1; // Return -1 if the first argument isn't an array
}

/**
 * Get a slice of an array between two indices (inclusive).
 * Handles out-of-bounds indices gracefully.
 *
 * @param {Array} array - Array to slice
 * @param {number} startIndex - Start position (default: 0)
 * @param {number} endIndex - End position (default: last element)
 * @returns {Array} Subset of items
 *
 * EXAMPLE:
 * {{ allProjects | getByIndexRange(0, 5) }}     {# First 6 items #}
 * {{ items | getByIndexRange(10, 20) }}         {# Items 10-20 #}
 */
export function getByIndexRange(array, startIndex, endIndex) {
  if (!Array.isArray(array)) return [];

  // Default startIndex to 0 if undefined
  const start = startIndex !== undefined ? Math.max(0, parseInt(startIndex, 10)) : 0;

  // Default endIndex to the last element if undefined
  const end =
    endIndex !== undefined ? Math.min(array.length - 1, parseInt(endIndex, 10)) : array.length - 1;

  if (start > end) return [];
  return array.slice(start, end + 1);
}

/**
 * Get a single item from an array or comma-delimited string by index.
 *
 * @param {Array|string} input - Array or comma-separated string
 * @param {number} index - Position to retrieve
 * @returns {*} Item at index or "Not found" if out of range
 *
 * EXAMPLE:
 * {{ array | getByIndex(0) }}              {# First item #}
 * {{ "red, blue, green" | getByIndex(1) }} {# "blue" #}
 */
export function getByIndex(input, index) {
  if (!input) return '';

  // Check if input is an array or a string
  let items = Array.isArray(input) ? input : input.split(',');

  // Parse the index to ensure it's an integer
  const idx = parseInt(index, 10);

  // Return the item at the given index, trimmed, or a fallback if out of range
  return items.length > idx && idx >= 0 ? items[idx].trim() : 'Not found';
}

/**
 * Sum all numeric values in an array.
 *
 * @param {Array<number>} arr - Array of numbers to sum
 * @returns {number} Total sum
 *
 * EXAMPLE:
 * {{ scores | sum }}                      {# Total score #}
 * {{ prices | sum }}                      {# Total cost #}
 */
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Group array items by a property value into an object.
 * Creates an object where keys are property values and values are arrays of items.
 *
 * @param {Array} array - Array to group
 * @param {string} key - Property name to group by
 * @returns {Object} Grouped object structure
 *
 * EXAMPLE:
 * {{ projects | groupBy("category") }}
 * => { "web": [{...}, {...}], "print": [{...}] }
 *
 * TEMPLATE USAGE:
 * {% for category, projects in grouped %}
 *   <h3>{{ category }}</h3>
 *   {% for project in projects %}
 *     <div>{{ project.title }}</div>
 *   {% endfor %}
 * {% endfor %}
 */
export function groupByFilter(array, key) {
  try {
    return array.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  } catch (error) {
    console.error('Error in groupBy filter', key, array);
    return {};
  }
}

/**
 * Remove duplicate items from an array based on a field value.
 * Keeps only the first occurrence of each unique value.
 *
 * @param {Array} array - Array to deduplicate
 * @param {string} field - Property to check for uniqueness
 * @returns {Array} Array with duplicates removed
 *
 * EXAMPLE:
 * {{ projects | unique("category") }}     {# One per category #}
 * {{ users | unique("email") }}           {# No duplicate emails #}
 *
 * NOTE: Works with both single values and array values (uses first item)
 */
export function getUniqueItems(array, field) {
  if (!array || !Array.isArray(array) || !field) return [];

  const seen = new Set();

  return array.filter(item => {
    const value = Array.isArray(item[field]) ? item[field][0] : item[field];

    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
