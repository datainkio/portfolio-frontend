/**
 * Navigation Builder Service
 *
 * Handles all navigation processing logic separated from 11ty collection registration.
 * This service follows the Single Responsibility Principle by focusing only on
 * transforming data into navigation structures.
 *
 * ARCHITECTURE OVERVIEW:
 * - Processes directory-based navigation from _pages files
 * - Handles Airtable projects data transformation
 * - Builds hierarchical navigation structures
 * - Provides clean API for 11ty collection registration
 *
 * CRITICAL DEPENDENCIES:
 * - Requires site.directories.nav configuration from site.json
 * - Depends on proper frontmatter titles in _pages/*.njk files
 * - Integration with Airtable collections system
 * - Used by eleventy/collections/navigation.js for collection registration
 *
 * BUG PREVENTION:
 * - Defensive null checks prevent toLowerCase() TypeError crashes
 * - Missing frontmatter titles filtered out to prevent null keys
 * - Proper validation of required fields before processing
 *
 * PERFORMANCE NOTES:
 * - Hierarchy building is O(n²) - optimize if navigation exceeds 100+ items
 * - Map operations for parent-child relationships are O(1) lookups
 * - Logging can be controlled via DEBUG environment variable
 *
 * @class NavigationBuilder
 */
import logger, { LumberjackStyle } from '../../js/utils/lumberjack/index.js';

logger.enabled = true;

/**
 * Custom Logger Styles for Navigation Operations
 */
const msgInitStyle = new LumberjackStyle('#CA6702', '•');
const successInitStyle = new LumberjackStyle('#EE9B00', '\n👍');

export class NavigationBuilder {
  /**
   * Initialize NavigationBuilder with site configuration
   *
   * @param {Object} site - Site configuration from site.json
   */
  constructor(site) {
    this.site = site;
  }

  /**
   * Build directory-based navigation from _pages files
   *
   * Processes files from site.directories.nav directory and creates navigation items.
   * Filters out drafts and files without proper frontmatter.
   *
   * REQUIREMENTS:
   * - Every _pages/*.njk file MUST have a title in frontmatter
   * - Files without titles are filtered out with warnings
   * - site.directories.nav MUST be properly configured in site.json
   *
   * @param {Object} collectionApi - 11ty Collection API for accessing all files
   * @returns {Array} Array of formatted navigation objects with key, url, parent
   */
  buildDirectoryNavigation(collectionApi) {
    logger.trace('Building directory navigation from _pages files...', null, 'brief', msgInitStyle);

    // Get all files and filter for navigation directory and non-drafts
    const navItems = collectionApi
      .getAll()
      .filter(item => {
        // Exclude drafts or unwanted files
        return !item.data.draft && item.inputPath.includes(this.site.directories.nav);
      })
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath));

    const formatted = this.formatDirectoryItems(navItems);

    logger.trace(
      'Directory navigation data built (' + formatted.length + ' items)',
      null,
      'brief',
      successInitStyle
    );

    return formatted;
  }

  /**
   * Build projects navigation from Airtable data
   *
   * Processes Airtable projects collection and creates navigation items.
   * Handles missing projects gracefully.
   *
   * @param {Object} collectionApi - 11ty Collection API for accessing collections
   * @returns {Array} Array of formatted project navigation objects
   */
  buildProjectNavigation(collectionApi) {
    logger.trace(
      'Building individual projects navigation from Airtable data...',
      null,
      'brief',
      msgInitStyle
    );

    // Use proper 11ty Collection API to access the projects collection
    const allCollections = collectionApi.ctx?.collections || {};
    const projects = allCollections.projects || [];

    if (!projects || projects.length === 0) {
      logger.trace(
        'No individual projects navigation items created (projects accessed via /projects/ page)',
        null,
        'brief',
        msgInitStyle
      );
      return [];
    }

    const formattedProjects = this.formatProjectItems(projects);

    logger.trace(
      'Individual projects navigation built (' + formattedProjects.length + ' items)',
      null,
      'brief',
      successInitStyle
    );

    return formattedProjects;
  }

  /**
   * Build primary navigation by merging directory and project navigation
   *
   * Creates the final hierarchical navigation structure used by templates.
   * This is the main navigation collection used throughout the site.
   *
   * @param {Object} collectionApi - 11ty Collection API for accessing other collections
   * @returns {Array} Hierarchical navigation structure with nested children
   */
  buildPrimaryNavigation(collectionApi) {
    logger.trace('Building primary navigation structure...', null, 'brief', msgInitStyle);

    // Get the collections using the proper 11ty Collection API
    const projects = collectionApi.getFilteredByTag('nav_projects') || [];
    const directories = collectionApi.getFilteredByTag('nav_dirs') || [];

    if (projects.length === 0 && directories.length === 0) {
      logger.trace(
        'No navigation items found in nav_projects or nav_dirs collections',
        null,
        'brief',
        msgInitStyle
      );
      return [];
    }

    const merged = [...projects, ...directories];
    const nested = this.buildNestedStructure(merged);

    logger.trace(
      'Primary navigation structure built (' + nested.length + ' top-level items)',
      null,
      'brief',
      successInitStyle
    );

    return nested;
  }

  /**
   * Build primary navigation from provided data collections
   *
   * Creates the final hierarchical navigation structure from already-built collections.
   * Used when collections are accessed through 11ty context.
   *
   * @param {Array} directories - Navigation items from nav_dirs collection
   * @param {Array} projects - Navigation items from nav_projects collection
   * @returns {Array} Hierarchical navigation structure with nested children
   */
  buildPrimaryNavigationFromData(directories, projects) {
    logger.trace('Building primary navigation structure...', null, 'brief', msgInitStyle);

    if (projects.length === 0 && directories.length === 0) {
      logger.trace(
        'No navigation items found in nav_projects or nav_dirs collections',
        null,
        'brief',
        msgInitStyle
      );
      return [];
    }

    const merged = [...projects, ...directories];
    const nested = this.buildNestedStructure(merged);

    logger.trace(
      'Primary navigation structure built (' + nested.length + ' top-level items)',
      null,
      'brief',
      successInitStyle
    );

    return nested;
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
   * @param {Array} items - Array of 11ty collection items from _pages directory
   * @returns {Array} Array of formatted navigation objects with key, url, parent
   */
  formatDirectoryItems(items) {
    logger.trace('Formatting directory navigation data...', null, 'brief', msgInitStyle);

    const result = items
      .filter(item => {
        // CRITICAL: Filter out items without titles to prevent null keys
        // Missing titles would break navigation template rendering
        if (!item.data.title) {
          logger.trace(
            'Filtering out navigation item without title:',
            item.inputPath,
            'brief',
            msgInitStyle
          );
          return false;
        }
        return true;
      })
      .map(item => ({
        key: item.data.title,
        url: item.url,
        // Optional extras:
        parent: this.getParentFromSlug(item.url),
      }));

    return result;
  }

  /**
   * Airtable projects formatter for navigation
   *
   * Transforms Airtable project records into navigation objects.
   * Used by buildProjectNavigation to create nav_projects collection.
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
   * DEFENSIVE CHECKS:
   * - Validates required fields (title, slug) exist
   * - Filters out items with missing or invalid data
   * - Provides default weight value if missing
   * - Logs warnings for skipped items
   *
   * @param {Array} items - Array of Airtable project records
   * @returns {Array} Array of navigation objects for projects
   */
  formatProjectItems(items) {
    logger.trace('Formatting projects nav data...', null, 'brief', msgInitStyle);

    const formatted = items
      .filter(item => {
        // CRITICAL: Filter out items without required fields
        if (!item || !item.title || !item.slug) {
          logger.trace(
            'Filtering out project without title or slug. ID: ' + (item?.id || 'unknown'),
            null,
            'brief',
            msgInitStyle
          );
          return false;
        }
        return true;
      })
      .map(item => ({
        key: item.title.toLowerCase(),
        url: item.slug,
        parent: this.getParentFromSlug(item.slug),
        order: item.weight || 0, // Default weight to 0 if not provided
      }));

    logger.trace(
      'Formatted ' + formatted.length + ' of ' + items.length + ' projects',
      null,
      'brief',
      msgInitStyle
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
  getParentFromSlug(slug) {
    // Trim any leading or ending slashes, then split into an array
    const parts = slug.replace(/^\/|\/$/g, '').split('/');
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
  buildNestedStructure(items) {
    logger.trace('Building nested navigation structure...', null, 'brief', msgInitStyle);
    const itemMap = new Map();

    // Initialize the map with all items
    items.forEach(item => {
      // CRITICAL WARNING: Defensive check for missing or empty key property
      // Some navigation items may have null/undefined/empty key values
      if (!item || !item.key || item.key === '' || typeof item.key !== 'string') {
        logger.trace(
          'Skipping navigation item with invalid key. Key value: "' +
            item?.key +
            '", type: ' +
            typeof item?.key,
          null,
          'brief',
          msgInitStyle
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
    });

    // Return only top-level items (items without parents)
    return Array.from(itemMap.values()).filter(item => !item.parent);
  }
}
