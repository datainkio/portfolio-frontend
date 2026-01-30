<!-- @format -->

# Eleventy Collections Manager

Central orchestration for all 11ty collections. This directory manages the registration and initialization of content collections from the CMS and navigation collections from file structure.

## Architecture Overview

**Purpose**: Coordinate collection initialization in correct dependency order
**Entry Point**: `index.js` - Imported by `.eleventy.js` as a plugin
**Pattern**: Async initialization with error isolation per collection type

```javascript
// In .eleventy.js
import collections from './eleventy/collections/index.js';

export default async function (eleventyConfig) {
  await collections(eleventyConfig);
}
```

## Collection Types

### 1. CMS Collections (`sanity.js`)

**Source**: CMS queries via `frontend/cms/queries/`
**Dependencies**: None (initialized first)
**Configuration**: `njk/_data/site.json` → `site.cms`

Each query id becomes an 11ty collection:

- Query id becomes collection name (e.g., `projects`)
- Smart caching via `@11ty/eleventy-fetch` (configurable duration)

**Generated Collections**:

- `projects` - Portfolio projects
- `activities` - Project activities
- `awards` - Awards and recognitions
- `organizations` - Organizations with metadata

**Usage in Templates**:

```njk
{% for project in collections.projects %}
  <h2>{{ project.title }}</h2>
{% endfor %}
```

### 2. Navigation Collections (`navigation.js`)

**Source**: File system (`njk/_pages/`) + CMS projects
**Dependencies**: Requires `projects` collection from CMS
**Configuration**: `site.directories.nav` path + `site.navigation` structure

**Generated Collections**:

- `nav_dirs` - Directory-based navigation from file structure
- `nav_projects` - Project navigation from CMS data
- `nav_primary` - Merged hierarchical navigation (depends on both above)

**Processing**: Delegated to `NavigationBuilder` service (`eleventy/services/NavigationBuilder.js`)

**Usage in Templates**:

```njk
{% import "organisms/navigation/primary-nav.njk" as primaryNav %}
{{ primaryNav.render({ items: collections.nav_primary }) }}
```

### 3. Documentation Collection (`documentation.js`)

**Source**: README.md files (future implementation)
**Dependencies**: None
**Status**: Placeholder - currently returns empty collection

## Execution Order (Critical)

Collections MUST be registered in dependency order:

1. **CMS Collections** (no dependencies)
  - Fetches external data from CMS
   - Creates base collections (`projects`, `work`, etc.)

2. **Navigation Collections** (depends on CMS)
   - `nav_dirs` - No dependencies
   - `nav_projects` - Depends on `projects` collection
   - `nav_primary` - Depends on `nav_dirs` and `nav_projects`

3. **Documentation Collection** (no dependencies)
   - Auto-discovers README files
   - Independent of other collections

**Why Order Matters**: 11ty processes collections synchronously during build. Later collections can access earlier collections via `this.ctx.collections`, but not vice versa.

## File Responsibilities

### `index.js`

- Loads `site.json` configuration synchronously
- Calls initializers in correct dependency order
- Catches and logs errors without breaking build
- Uses chalk for colored terminal output

### `sanity.js`

- Fetches data via CMS client
- Registers one collection per query
- Smart caching with configurable expiration
- Uses lumberjack logger for build output

### `navigation.js`

- Registers navigation collection callbacks
- Delegates processing to `NavigationBuilder` service
- Builds hierarchical navigation structure
- Merges directory and project navigation
- Uses lumberjack logger for build output

### `documentation.js`

- Placeholder for future README integration
- Currently returns empty collection
- Will auto-discover README.md files when implemented

## Configuration

### Required Config (site.json)

```json
{
  "cms": {
    "projectId": "<project-id>",
    "dataset": "production",
    "apiVersion": "2025-12-26",
    "useCdn": true,
    "cache": "5m"
  },
  "directories": {
    "nav": "njk/_pages"
  },
  "navigation": {
    "items": [
      {
        "title": "Home",
        "url": "/",
        "children": []
      }
    ]
  }
}
```

### Environment Variables

**CMS Integration**:

- `SANITY_PROJECT_ID` - CMS project ID
- `SANITY_DATASET` - CMS dataset
- `SANITY_API_TOKEN` - Optional token for drafts/preview
- `SANITY_PARALLEL` - `true` (default) for parallel fetching, `false` for sequential

**Parallel vs Sequential Fetching**:

- **Parallel** (default): Faster, all tables fetch simultaneously
- **Sequential**: Easier debugging, fetches one table at a time

## Collection Access Patterns

### In Nunjucks Templates

```njk
{# Loop through collection items #}
{% for item in collections.projects %}
  {{ item.title }}
{% endfor %}

{# Filter collection #}
{% set featured = collections.projects | selectattr("featured", "true") %}

{# Access navigation #}
{{ collections.nav_primary | dump }}
```

### In Collection Callbacks

```javascript
eleventyConfig.addCollection('custom', function (collectionApi) {
  // Access other collections via context
  const projects = this.ctx?.collections?.projects || [];

  // Process and return custom collection
  return projects.filter(p => p.status === 'live');
});
```

## CMS Query Registry

The CMS query registry is the source of truth for collection shapes:

- **Queries**: `cms/queries/`
- **Aggregator**: `cms/queries.js`
- **Template access**: `collections.<id>`

## Logging System

Collections use the **Lumberjack** dual-mode logger:

- **Terminal Mode (Build)**: Chalk-based ANSI colors with emoji prefixes
- **Browser Mode (Runtime)**: CSS-styled console output
- **Auto-Detection**: Checks environment and uses appropriate styling

**Custom Logger Styles**:

```javascript
import logger, { LumberjackStyle } from '@datainkio/lumberjack';

const titleStyle = new LumberjackStyle('#EE9B00', '\n☎️  ');
const msgStyle = new LumberjackStyle('#CA6702', '•');

logger.trace('Message', data, 'brief', titleStyle);
```

## Error Handling

Collections use isolated error handling to prevent cascading failures:

1. **Content Collections**: Each table fetch wrapped in try/catch
   - Failed fetches return empty array
   - Build continues with available data

2. **Navigation Collections**: Service-level error handling
   - NavigationBuilder catches processing errors
   - Returns empty navigation structure on failure

3. **Top-Level**: Index.js catches all initialization errors
   - Logs error without breaking 11ty build
   - Allows partial builds with available collections

## Common Gotchas

- **Collection Names**: Query ids define collection names
- **Dependency Order**: Navigation collections MUST initialize after CMS
- **Context Access**: `this.ctx.collections` only works in collection callbacks, not async functions
- **Cache Duration**: Short cache durations (5m) during development, longer (1h+) in production
- **Parallel Fetching**: Default mode is faster but makes debugging harder - use sequential for troubleshooting
- **API Rate Limits**: CMS APIs have rate limits - smart caching prevents excessive requests
- **Missing Config**: Collections silently fail if site.json configuration is incomplete

## Related Files

- **Services**: `eleventy/services/NavigationBuilder.js` - Navigation processing logic
- **Data Fetching**: `cms/fetchSanityData.js` - CMS fetch helper
- **Configuration**: `njk/_data/site.json` - Collection and navigation config
- **Schema**: `cms/queries/` - Query registry
- **Templates**: `njk/_includes/organisms/navigation/` - Navigation components
- **Logging**: `js/utils/lumberjack/` - Dual-mode logger system

## Debugging Tips

1. **Check Collection Registration**:

   ```bash
   npm run build -- --dryrun
   ```

2. **Enable Sequential Fetching**:

   ```bash
  SANITY_PARALLEL=false npm run build
   ```

3. **Clear Cache**:

   ```bash
   npm run cache:clear
   ```

4. **View Collections in Template**:

   ```njk
   {{ collections | dump }}
   ```

5. **Check Logger Output**: Look for emoji prefixes in terminal:
   - ☎️ - Collection initialization
   - 👍 - Success
   - 💥 - Error
