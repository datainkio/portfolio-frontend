/**
 * ---
 * aix:
 *   id: frontend.eleventy.collections.navigation
 *   role: Eleventy module: eleventy/collections/navigation.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - collections
 * ---
 */
/**
 * 11ty Navigation Collection Registration
 *
 * This file registers navigation collections with 11ty but delegates all processing
 * logic to the NavigationBuilder service for better separation of concerns.
 *
 * ARCHITECTURE OVERVIEW:
 * - Registers three navigation collections: nav_dirs, nav_projects, nav_primary
 * - nav_dirs: Built from _pages directory structure and frontmatter titles
 * - nav_projects: Built from Sanity projects data
 * - nav_primary: Merges both collections into hierarchical navigation structure
 *
 * CRITICAL DEPENDENCIES:
 * - Requires site.directories.nav configuration in site.json
 * - Depends on NavigationBuilder service for all processing logic
 * - Integration with Sanity CMS collections via sanity.js
 * - Used by navigation templates in organisms/navigation/
 * - GSAP animations depend on specific DOM structure this generates
 *
 * DESIGN PATTERN:
 * - Follows Single Responsibility Principle
 * - Collection registration separated from business logic
 * - NavigationBuilder handles all data processing and transformation
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} site - Site configuration from site.json
 */
import logger, { LumberjackStyle } from "@datainkio/lumberjack";
import { NavigationBuilder } from "../services/NavigationBuilder.js";

logger.enabled = true;

/**
 * Custom Logger Styles for Navigation Operations
 */
const titleInitStyle = new LumberjackStyle("#EE9B00", "\n🧭");
const successInitStyle = new LumberjackStyle("#EE9B00", "\n👍");

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
  logger.trace(
    "Registering primary navigation callbacks",
    null,
    "brief",
    titleInitStyle,
  );
  logger.trace(
    "",
    "The navigation scheme merges three different sources to create a single, navigable structure. First, it gets the top-level nav items. These are manually defined and are found in site.json...\n",
    "brief",
    "standard",
  );

  // Initialize NavigationBuilder service
  const navigationBuilder = new NavigationBuilder(site);

  // CRITICAL: Register collections in dependency order
  // 1. nav_dirs (no dependencies)
  // 2. nav_projects (depends on 'projects' from Sanity)
  // 3. nav_primary (depends on nav_dirs and nav_projects)

  eleventyConfig.addCollection("nav_dirs", function (collectionApi) {
    return navigationBuilder.buildDirectoryNavigation(collectionApi);
  });

  eleventyConfig.addCollection("nav_projects", function (collectionApi) {
    return navigationBuilder.buildProjectNavigation(collectionApi);
  });

  // Register nav_primary LAST as it depends on the other two
  eleventyConfig.addCollection("nav_primary", function (collectionApi) {
    // Access other collections through the 11ty context
    const allCollections = this.ctx?.collections || {};
    const projects = allCollections.nav_projects || [];
    const directories = allCollections.nav_dirs || [];

    return navigationBuilder.buildPrimaryNavigationFromData(
      directories,
      projects,
    );
  });

  logger.trace(
    "Navigation collection callbacks registered (data builds during 11ty compilation)",
    null,
    "brief",
    successInitStyle,
  );
}

function addTopLevelNav(eleventyConfig, site) {
  logger.trace(
    "Registering top-level nav by determining which files become part of the navigation scheme.",
    null,
    "brief",
    msgInitStyle,
  );
  eleventyConfig.addCollection("nav_dirs", function (collectionApi) {
    // Get existing nav items
    const navTop = collectionApi
      .getAll()
      .filter((item) => {
        // Exclude drafts or unwanted files
        return (
          !item.data.draft && item.inputPath.includes(site.directories.nav)
        );
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
  logger.trace(
    "Formatting directory navigation data...",
    null,
    "brief",
    msgInitStyle,
  );
  const result = items
    .filter((item) => {
      // CRITICAL: Filter out items without titles to prevent null keys
      // Missing titles would break navigation template rendering
      if (!item.data.title) {
        logger.trace(
          "Filtering out navigation item without title:",
          item.inputPath,
          "brief",
          msgInitStyle,
        );
        return false;
      }
      return true;
    })
    .map((item) => ({
      key: item.data.title,
      url: item.url,
      // Optional extras:
      parent: getParentFromSlug(item.url),
    }));
  logger.trace(
    "Directory navigation data built (" + result.length + " items)",
    null,
    "brief",
    successInitStyle,
  );
  return result;
}

/**
 * Projects navigation collection builder
 *
 * Creates nav_projects collection from Sanity projects data.
 *
 * DEPENDENCIES:
 * - Requires 'projects' collection from Sanity (registered in sanity.js)
 *
 * HOW IT WORKS:
 * - Accesses 'projects' collection via this.ctx.collections
 * - Maps project data to navigation format with key, url, parent, order
 * - Filters out projects missing required fields (title, slug)
 * - Uses weight field for navigation ordering (defaults to 0)
 *
 * OUTPUT STRUCTURE:
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
  logger.trace(
    "Registering project navigation based on CMS data...",
    "",
    "brief",
    msgInitStyle,
  );

  eleventyConfig.addCollection("nav_projects", function (collectionApi) {
    logger.trace(
      "Building individual projects navigation from CMS data...",
      null,
      "brief",
      msgInitStyle,
    );

    // Use proper 11ty Collection API to access the projects collection
    const allCollections = this.ctx?.collections || {};
    const projects = allCollections.projects || [];

    if (!projects || projects.length === 0) {
      logger.trace(
        "No individual projects navigation items created (projects accessed via /projects/ page)",
        null,
        "brief",
        msgInitStyle,
      );
      return [];
    }

    const formattedProjects = formatProjectsForEleventyNav(projects);
    logger.trace(
      "Individual projects navigation built (" +
        formattedProjects.length +
        " items)",
      null,
      "brief",
      successInitStyle,
    );
    return formattedProjects;
  });
}

/**
 * Projects formatter for navigation
 *
 * Transforms CMS project records into navigation objects.
 * Used by addProjectsNav to create nav_projects collection.
 *
 * EXPECTED STRUCTURE:
 * ```javascript
 * {
 *   title: "Project Name",
 *   slug: "/projects/project-name/",
 *   weight: 10  // For ordering
 * }
 * ```
 *
 * DEFENSIVE CHECKS:
 * - Validates required fields (title, slug) exist
 * - Filters out items with missing or invalid data
 * - Provides default weight value if missing
 * - Logs warnings for skipped items
 *
 * @param {Array} items - Array of project records
 * @returns {Array} Array of navigation objects for projects
 */
function formatProjectsForEleventyNav(items) {
  logger.trace("Formatting projects nav data...", null, "brief", msgInitStyle);

  const formatted = items
    .filter((item) => {
      // CRITICAL: Filter out items without required fields
      if (!item || !item.title || !item.slug) {
        logger.trace(
          "Filtering out project without title or slug. ID: " +
            (item?.id || "unknown"),
          null,
          "brief",
          msgInitStyle,
        );
        return false;
      }
      return true;
    })
    .map((item) => ({
      key: item.title.toLowerCase(),
      url: item.slug,
      parent: getParentFromSlug(item.slug),
      order: item.weight || 0, // Default weight to 0 if not provided
    }));

  logger.trace(
    "Formatted " + formatted.length + " of " + items.length + " projects",
    null,
    "brief",
    msgInitStyle,
  );

  return formatted;
}

/**
 * Parent slug extractor for navigation hierarchy
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
 * @param {string} slug - URL slug like "/parent/child/" or "/top-level/"
 * @returns {string|null} Parent slug or null for top-level items
 */
function getParentFromSlug(slug) {
  // Trim any leading or ending slashes, then split into an array
  const parts = slug.replace(/^\/|\/$/g, "").split("/");
  return parts.length > 1 ? parts[parts.length - 2] : null;
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
  logger.trace(
    "Building nested navigation structure...",
    null,
    "brief",
    msgInitStyle,
  );
  const itemMap = new Map();
  const result = [];

  // Initialize the map with all items
  items.forEach((item) => {
    // CRITICAL WARNING: Defensive check for missing or empty key property
    // Some navigation items may have null/null/empty key values
    if (!item || !item.key || item.key === "" || typeof item.key !== "string") {
      logger.trace(
        'Skipping navigation item with invalid key. Key value: "' +
          item?.key +
          '", type: ' +
          typeof item?.key,
        null,
        "brief",
        msgInitStyle,
      );
      return;
    }
    itemMap.set(item.key.toLowerCase(), { ...item, children: [] });
  });

  // Attach children to their respective parents
  items.forEach((item) => {
    // CRITICAL WARNING: Skip items without valid key to prevent build failures
    if (!item || !item.key || item.key === "" || typeof item.key !== "string") {
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
  return Array.from(itemMap.values()).filter((item) => !item.parent);
}
