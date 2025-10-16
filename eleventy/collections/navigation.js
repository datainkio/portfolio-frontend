/**
 * CRITICAL WARNING: 11ty Navigation Collection Builder
 *
 * This file manages the complex navigation system for the 11ty static site.
 * DO NOT MODIFY without understanding the complete dependency chain.
 *
 * ARCHITECTURE OVERVIEW:
 * - Creates three navigation collections: nav_dirs, nav_projects, nav_primary
 * - nav_dirs: Built from _pages directory structure and frontmatter titles
 * - nav_projects: Built from Airtable projects data (currently disabled)
 * - nav_primary: Merges both collections into hierarchical navigation structure
 *
 * CRITICAL DEPENDENCIES:
 * - Requires site.directories.nav configuration in site.json
 * - Depends on proper frontmatter titles in all _pages/*.njk files
 * - Integration with Airtable collections system via content.js
 * - Used by navigation templates in organisms/navigation/
 * - GSAP animations depend on specific DOM structure this generates
 *
 * BUG PREVENTION:
 * - Defensive null checks prevent toLowerCase() TypeError crashes
 * - Collection access timing issues handled with try-catch blocks
 * - Missing frontmatter titles filtered out to prevent null keys
 * - Empty fallback arrays prevent template rendering failures
 *
 * PERFORMANCE NOTES:
 * - Collections rebuild on every 11ty change during development
 * - Nested structure algorithm is O(n²) - optimize if nav grows large
 * - Console logging controlled by DEBUG environment variable
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} site - Site configuration from site.json
 */
import logger, { LoggerStyle } from '../../js/utils/logger/index.js';

/**
 * Custom Logger Styles for Navigation Operations
 */
const titleStyle = new LoggerStyle('#EE9B00', '\n🧭');
const msgStyle = new LoggerStyle('#CA6702', '•');
const successStyle = new LoggerStyle('#EE9B00', '\n👍');

/**
 * CRITICAL WARNING: Main navigation initialization function
 *
 * This initializes all navigation collections in the correct order.
 * DO NOT change the order of operations - collections have dependencies.
 *
 * INTEGRATION POINTS:
 * - Called from eleventy/collections/index.js during 11ty startup
 * - Requires site.directories.nav to be properly configured
 * - Creates collections used by header.njk and primary-nav.njk templates
 *
 * @param {Object} eleventyConfig - 11ty configuration object with addCollection method
 * @param {Object} site - Site configuration containing directories.nav path
 */
export async function init(eleventyConfig, site) {
  logger.trace('Building primary navigation', null, 'brief', titleStyle);
  // logger.trace('top-level: ' + site.directories.nav, null, 'brief', msgStyle);
  logger.trace(
    '',
    'The navigation scheme merges three different sources to build a single, navigable structure. First, it gets the top-level nav items. These are manually defined and are found in site.json...\n',
    'brief',
    'standard'
  );
  addTopLevelNav(eleventyConfig, site);
  logger.trace(
    '',
    'Next, it uses CMS content to build the project navigation...',
    'brief',
    'standard'
  );
  addProjectsNav(eleventyConfig);
  logger.trace(
    '',
    'And finally, it merges them together and adds them as a collection called nav_primary.',
    'brief',
    'standard'
  );
  eleventyConfig.addCollection('nav_primary', function (collectionApi) {
    try {
      // CRITICAL WARNING: Defensive access to navigation collections
      // These collections may not exist during initial build phases
      const allItems = collectionApi.getAll();
      const firstItem = allItems[0];

      if (!firstItem || !firstItem.data || !firstItem.data.collections) {
        logger.trace(
          'Navigation collections not ready yet, returning empty nav_primary',
          null,
          'brief',
          warnStyle
        );
        return [];
      }

      const projects = firstItem.data.collections.nav_projects || [];
      const directories = firstItem.data.collections.nav_dirs || [];
      const merged = [...projects, ...directories];

      return buildNestedStructure(merged);
    } catch (error) {
      logger.trace('Error building nav_primary:', error, 'verbose'); // Auto-detects error style
      return [];
    }
  });

  logger.trace('Navigation collection definitions registered', null, 'brief', successStyle);
}

/**
 * CRITICAL WARNING: Top-level navigation collection builder
 *
 * Creates nav_dirs collection from _pages directory structure.
 * DO NOT MODIFY without understanding template dependencies.
 *
 * HOW IT WORKS:
 * 1. Scans all files in site.directories.nav (typically /njk/_pages/)
 * 2. Filters out drafts and files outside nav directory
 * 3. Extracts frontmatter titles to create navigation keys
 * 4. Builds parent-child relationships from URL slug structure
 *
 * CRITICAL REQUIREMENTS:
 * - Every _pages/*.njk file MUST have a title in frontmatter
 * - Files without titles are filtered out with console warnings
 * - site.directories.nav MUST be properly configured in site.json
 *
 * BREAKING CHANGES TO AVOID:
 * - Changing filter logic will break navigation display
 * - Missing frontmatter titles cause null key errors
 * - URL structure changes affect parent-child relationships
 *
 * TEMPLATE INTEGRATION:
 * - Results used by organisms/navigation/primary-nav.njk
 * - Keys become navigation item text in rendered HTML
 * - URLs become href attributes in navigation links
 *
 * @param {Object} eleventyConfig - 11ty config for addCollection
 * @param {Object} site - Site config with directories.nav path
 */
function addTopLevelNav(eleventyConfig, site) {
  logger.trace(
    'Building top-level nav by determining which files become part of the navigation scheme.',
    null,
    'brief',
    msgStyle
  );
  eleventyConfig.addCollection('nav_dirs', function (collectionApi) {
    // Get existing nav items
    const navTop = collectionApi
      .getAll()
      .filter(item => {
        // Exclude drafts or unwanted files
        return !item.data.draft && item.inputPath.includes(site.directories.nav);
      })
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath));

    return formatDirectoriesForEleventyNav(navTop);
  });
}

/**
 * CRITICAL WARNING: Navigation item formatter for directory-based navigation
 *
 * Transforms 11ty collection items into standardized navigation objects.
 * DO NOT MODIFY the returned object structure - templates depend on it.
 *
 * BUG PREVENTION (FIXED 2025-10-03):
 * - Filters out items without frontmatter titles to prevent null keys
 * - Prevents TypeError: Cannot read properties of null (reading 'toLowerCase')
 * - Logs filtered items for debugging missing titles
 *
 * REQUIRED FRONTMATTER STRUCTURE:
 * ```yaml
 * ---
 * title: "Page Title"  # REQUIRED - becomes navigation key
 * draft: false         # Optional - true excludes from nav
 * ---
 * ```
 *
 * RETURNED OBJECT STRUCTURE (DO NOT CHANGE):
 * ```javascript
 * {
 *   key: "page title",        # From frontmatter title
 *   url: "/path/to/page/",    # From 11ty generated URL
 *   parent: "parent-slug"     # Extracted from URL hierarchy
 * }
 * ```
 *
 * TEMPLATE DEPENDENCIES:
 * - organisms/navigation/primary-nav.njk expects this exact structure
 * - buildNestedStructure() requires key, url, and parent properties
 * - GSAP animations target elements created from this data
 *
 * @param {Array} items - Array of 11ty collection items from _pages directory
 * @returns {Array} Array of formatted navigation objects with key, url, parent
 */
function formatDirectoriesForEleventyNav(items) {
  logger.trace('Formatting directory navigation data...', null, 'brief', msgStyle);
  const result = items
    .filter(item => {
      // CRITICAL: Filter out items without titles to prevent null keys
      // Missing titles would break navigation template rendering
      if (!item.data.title) {
        logger.trace(
          'Filtering out navigation item without title. Path: ' + item.inputPath,
          null,
          'brief',
          msgStyle
        );
        return false;
      }
      return true;
    })
    .map(item => ({
      key: item.data.title,
      url: item.url,
      // Optional extras:
      parent: getParentFromSlug(item.url),
    }));

  logger.trace('Directory navigation formatting complete', null, 'brief', successStyle);
  return result;
}

/**
 * CRITICAL WARNING: Projects navigation collection (CURRENTLY DISABLED)
 *
 * Creates nav_projects collection from Airtable projects data.
 * TEMPORARILY DISABLED to prevent build failures during navigation refactoring.
 *
 * CURRENT STATUS: Returns empty array to prevent crashes
 * FUTURE IMPLEMENTATION: Will integrate with Airtable projects collection
 *
 * INTEGRATION CHALLENGES:
 * - Collection timing: Airtable collections may not be ready when this runs
 * - Data structure: Need to map Airtable fields to navigation object format
 * - Performance: Large project datasets could slow navigation builds
 *
 * REQUIRED FOR RE-ENABLING:
 * 1. Ensure Airtable collections are fully initialized before navigation
 * 2. Implement proper error handling for missing project data
 * 3. Map project title/slug fields to navigation key/url structure
 * 4. Add filtering for published/draft project status
 * 5. Test with large project datasets for performance
 *
 * WHEN WORKING, WILL CREATE:
 * ```javascript
 * {
 *   key: "project-title",
 *   url: "/projects/project-slug/",
 *   parent: "projects",
 *   order: 10  // From project weight field
 * }
 * ```
 *
 * @param {Object} eleventyConfig - 11ty config for addCollection
 */
function addProjectsNav(eleventyConfig) {
  logger.trace('', 'Building project navigation...', 'brief', msgStyle);
  eleventyConfig.addCollection('nav_projects', function (collectionApi) {
    // CRITICAL WARNING: Return empty array for now to prevent build failures
    // TODO: Implement proper projects navigation after Airtable collections are stable
    logger.trace(null, 'nav_projects collection returning empty array', 'brief', msgStyle);
    return [];
  });
}

/**
 * CRITICAL WARNING: Airtable projects formatter (CURRENTLY UNUSED)
 *
 * Transforms Airtable project records into navigation objects.
 * NOT CURRENTLY CALLED - reserved for future projects navigation implementation.
 *
 * EXPECTED AIRTABLE STRUCTURE:
 * ```javascript
 * {
 *   title: "Project Name",
 *   slug: "/projects/project-name/",
 *   weight: 10  // For ordering
 * }
 * ```
 *
 * BUG RISKS:
 * - item.title could be null - needs defensive checks
 * - item.slug might not follow expected URL format
 * - item.weight could be non-numeric
 *
 * TODO: Add validation when re-implementing:
 * - Check for required fields before processing
 * - Validate slug format and URL structure
 * - Handle missing weight values with defaults
 * - Filter out unpublished projects
 *
 * @param {Array} items - Array of Airtable project records
 * @returns {Array} Array of navigation objects for projects
 */
function formatAirtableForEleventyNav(items) {
  logger.trace('formatting projects nav data...', null, 'brief', msgStyle);
  return items.map(item => ({
    key: item.title.toLowerCase(),
    url: item.slug,
    // Optional extras:
    parent: getParentFromSlug(item.slug),
    order: item.weight,
  }));
}

/**
 * CRITICAL WARNING: Parent slug extractor for navigation hierarchy
 *
 * Extracts parent navigation key from URL slug for building nested navigation.
 * ESSENTIAL for multi-level navigation structure in primary-nav.njk.
 *
 * HOW IT WORKS:
 * - /about/design/ → parent: "about"
 * - /projects/web-app/ → parent: "projects"
 * - /contact/ → parent: null (top-level)
 *
 * URL STRUCTURE REQUIREMENTS:
 * - URLs must follow /parent/child/ format for proper nesting
 * - Single-level URLs (/about/) have no parent
 * - Must handle trailing slashes consistently
 *
 * NAVIGATION HIERARCHY IMPACT:
 * - Return value becomes parent property in navigation objects
 * - buildNestedStructure() uses this to create parent-child relationships
 * - Wrong parent extraction breaks navigation tree structure
 *
 * ERROR HANDLING:
 * - Try-catch prevents crashes on malformed URLs
 * - Returns null for single-level paths or errors
 * - Logs "oops" on catch (should be improved for debugging)
 *
 * @param {string} slug - URL slug like "/parent/child/" or "/top-level/"
 * @returns {string|null} Parent slug or null for top-level items
 */
function getParentFromSlug(slug) {
  try {
    // Trim any leading or ending slashes, then split into an array
    const parts = slug.replace(/^\/|\/$/g, '').split('/');
    return parts.length > 1 ? parts[parts.length - 2] : null;
  } catch (error) {
    logger.trace('Error parsing parent from slug:', error, 'verbose');
    return null;
  }
}

/**
 * CRITICAL WARNING: Navigation hierarchy builder - MOST COMPLEX FUNCTION
 *
 * Transforms flat navigation items into nested parent-child structure.
 * ESSENTIAL for multi-level navigation menus in templates.
 * DO NOT MODIFY without thorough testing of navigation display.
 *
 * ALGORITHM OVERVIEW:
 * 1. Create Map with all items keyed by item.key.toLowerCase()
 * 2. Add empty children[] array to each item
 * 3. Iterate again to attach children to parents based on parent property
 * 4. Return only top-level items (items without parents)
 *
 * INPUT STRUCTURE:
 * ```javascript
 * [
 *   { key: "about", url: "/about/", parent: null },
 *   { key: "design", url: "/about/design/", parent: "about" }
 * ]
 * ```
 *
 * OUTPUT STRUCTURE:
 * ```javascript
 * [
 *   {
 *     key: "about",
 *     url: "/about/",
 *     parent: null,
 *     children: [
 *       { key: "design", url: "/about/design/", parent: "about", children: [] }
 *     ]
 *   }
 * ]
 * ```
 *
 * BUG PREVENTION (FIXED 2025-10-03):
 * - Defensive key validation prevents TypeError on null.toLowerCase()
 * - Skips items with invalid keys rather than crashing build
 * - Double validation in both forEach loops for safety
 *
 * PERFORMANCE CONSIDERATIONS:
 * - O(n²) complexity - could be slow with large navigation sets
 * - Map lookups are O(1) but we iterate twice over all items
 * - Consider optimization if navigation exceeds 100+ items
 *
 * TEMPLATE INTEGRATION:
 * - organisms/navigation/primary-nav.njk expects this exact structure
 * - children[] arrays are recursively rendered in navigation templates
 * - GSAP animations depend on nested DOM structure this creates
 *
 * @param {Array} items - Flat array of navigation objects with key, url, parent
 * @returns {Array} Hierarchical navigation structure with nested children
 */
function buildNestedStructure(items) {
  logger.trace('Building nested navigation structure...', null, 'brief', msgStyle);
  const itemMap = new Map();
  const result = [];

  // Initialize the map with all items
  items.forEach(item => {
    // CRITICAL WARNING: Defensive check for missing or empty key property
    // Some navigation items may have null/null/empty key values
    if (!item || !item.key || item.key === '' || typeof item.key !== 'string') {
      logger.trace(
        'Skipping navigation item with invalid key. Key value: "' +
          item?.key +
          '", type: ' +
          typeof item?.key,
        null,
        'brief',
        warnStyle
      );
      return;
    }
    itemMap.set(item.key.toLowerCase(), { ...item, children: [] });
  });

  // Attach children to their respective parents
  items.forEach(item => {
    // CRITICAL WARNING: Skip items without valid key to prevent build failures
    if (!item || !item.key || item.key === '' || typeof item.key !== 'string') {
      return;
    }

    // If the item has a parent, add it to the parent's children array
    if (item.parent) {
      // Get the parent
      const parent = itemMap.get(item.parent.toLowerCase());
      if (parent) {
        parent.children.push(itemMap.get(item.key.toLowerCase()));
      }
    }
    // If the item doesn't have a parent (i.e. it's a top-level item), add it to the result array
    else {
      result.push(item);
    }
  });
  return Array.from(itemMap.values()).filter(item => !item.parent);
}
