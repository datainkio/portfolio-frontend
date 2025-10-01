import chalk from "chalk";

export async function init(eleventyConfig, site) {
  console.log(chalk.magenta.bold("\n🗺️  Building primary navigation "));
  console.log(chalk.magenta("\t  top-level: " + site.directories.nav));

  addTopLevelNav(eleventyConfig, site);
  addProjectsNav(eleventyConfig);

  eleventyConfig.addCollection("nav_primary", function (collectionApi) {
    const projects = collectionApi.items[0].data.collections.nav_projects;
    const directories = collectionApi.items[0].data.collections.nav_dirs;
    const merged = [...projects, ...directories];
    // console.log(buildNestedStructure(merged));
    return buildNestedStructure(merged);
  });
}

/**
 * Build the top-level navigation items using the directories in _pages
 */
function addTopLevelNav(eleventyConfig, site) {
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

function formatDirectoriesForEleventyNav(items) {
  console.log(chalk.magenta("\t  formatting directories nav data..."));
  return items.map((item) => ({
    key: item.data.title,
    url: item.url,
    // Optional extras:
    parent: getParentFromSlug(item.url),
  }));
}

function addProjectsNav(eleventyConfig) {
  const projects = formatAirtableForEleventyNav(
    eleventyConfig.collections.projects()
  );
  eleventyConfig.addCollection("nav_projects", function (collectionApi) {
    return projects;
  });
}

function formatAirtableForEleventyNav(items) {
  console.log(chalk.magenta("\t  formatting projects nav data..."));
  return items.map((item) => ({
    key: item.title.toLowerCase(),
    url: item.slug,
    // Optional extras:
    parent: getParentFromSlug(item.slug),
    order: item.weight,
  }));
}

function getParentFromSlug(slug) {
  try {
    // Trim any leading or ending slashes, then split into an array
    const parts = slug.replace(/^\/|\/$/g, "").split("/");
    return parts.length > 1 ? parts[parts.length - 2] : null;
  } catch (error) {
    console.log("oops");
    return null;
  }
}

function buildNestedStructure(items) {
  const itemMap = new Map();
  const result = [];

  // Initialize the map with all items
  items.forEach((item) => {
    itemMap.set(item.key.toLowerCase(), { ...item, children: [] });
  });

  // Attach children to their respective parents
  items.forEach((item) => {
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
