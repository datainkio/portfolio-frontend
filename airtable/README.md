# Airtable CMS Integration Services

**THERMONUCLEAR WARNING**: This directory contains the Airtable headless CMS integration that powers your content management system. These services fetch content via API and transform it into 11ty collections. Misconfigure this system and watch your content vanish into the digital void, leaving you with empty templates and broken builds.

## Architecture Overview (Ignore This And Weep)

The Airtable integration transforms your Airtable bases into 11ty collections through a carefully orchestrated data pipeline:

- **Configuration**: `njk/_data/site.json` defines which tables to sync and caching rules
- **Data Fetching**: `@11ty/eleventy-fetch` handles API calls with smart caching and rate limiting
- **Collection Generation**: `eleventy/collections/content.js` transforms Airtable records into 11ty collections
- **Template Access**: Collections become available in Nunjucks templates as `collections.tablename`

**CRITICAL DEPENDENCY CHAIN**: Airtable API → Caching Layer → Collection Transformation → Template Rendering. Break any link and your content management system becomes a very expensive digital paperweight.

## Cache Management (Developer Quick Reference)

### Force Refresh Cache

Sometimes you need fresh data from Airtable immediately, bypassing the cache:

**Option 1 - Refresh ALL tables:**

```bash
npm run build:force
# or manually:
FORCE_REFRESH=true npm run build
```

**Option 2 - Refresh SPECIFIC table:**

```bash
FORCE_REFRESH_TABLE=Projects npm run build
# Replace "Projects" with your table name (case-sensitive!)
```

**Option 3 - Normal cache behavior:**

```bash
npm run build
# Uses cache duration from site.json
```

**With Debug Logging:**

```bash
DEBUG=true FORCE_REFRESH=true npm run build
# See exactly what's being cached/refreshed
```

### Cache Duration Control

Edit `njk/_data/site.json` to set cache durations per table:

```json
{
  "airtables": [
    {
      "tableName": "Projects",
      "cache": "1d" // 1 day - for stable content
    },
    {
      "tableName": "News",
      "cache": "1h" // 1 hour - for frequently updated content
    }
  ]
}
```

**Valid cache durations:** `30m`, `1h`, `12h`, `1d`, `7d`

## Logger Styles (Visual Debugging)

The Airtable integration uses custom Logger styles for visual distinction of different operations:

**Custom Styles:**

- 🗄️ **Orange** (#F97316) - `airtableStyle` - Database operations, fetching, refreshing tables
- 💾 **Purple** (#8B5CF6) - `cachingStyle` - Cache operations (using/saving cached data)
- ⚙️ **Cyan** (#06B6D4) - `processingStyle` - Record processing operations
- ❌ **Red** (built-in) - Error messages (auto-detected from Error objects)

**Example Output:**

```bash
DEBUG=true npm run build

💾 Using cached data: { table: "Projects" }
🗄️ Cache expired, refreshing: { table: "BlogPosts" }
  ⚙️ Processing records: { table: "BlogPosts", count: 10 }
  ⚙️ Processing records: { table: "BlogPosts", count: 20 }
💾 Data cached successfully: { table: "BlogPosts", records: 20 }
```

**Visual Preview:**

Run the preview script to see all styles in action:

```bash
DEBUG=true node test/airtable-styles-preview.js
```

## Configuration Architecture (Get This Wrong = No Content)

### Site Configuration (`njk/_data/site.json`)

**The Heart of Content Configuration**:

```json
{
  "airtables": [
    {
      "tableName": "Projects",
      "tableView": "Published",
      "cache": "1d"
    },
    {
      "tableName": "Blog Posts",
      "tableView": "Live",
      "cache": "12h"
    }
  ]
}
```

**Configuration Rules (Violate These At Your Digital Peril)**:

- **`tableName`**: MUST match your Airtable table name exactly (case-sensitive, spaces matter)
- **`tableView`**: MUST be a valid view name in that table (also case-sensitive)
- **`cache`**: Duration string (`1d`, `12h`, `30m`) - too short hits rate limits, too long serves stale content

**LETHAL GOTCHA**: Airtable table names are case-sensitive and space-sensitive. "Projects" ≠ "projects" ≠ "Projects ". Copy/paste table names from Airtable interface to avoid spelling disasters.

### Environment Variables (Required Or Everything Dies)

```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_TOKEN=your_specific_base_id_here
```

**Token Requirements**:

- **Personal Access Token**: Generated from Airtable Developer Hub with base access
- **Base Token**: The specific base ID (starts with "app") from your Airtable base URL
- **Scopes Required**: `data.records:read` at minimum for the target base

**SECURITY APOCALYPSE WARNING**: These tokens provide full read access to your Airtable base. Treat them like the nuclear launch codes they essentially are.

## Data Pipeline Architecture (The Fragile Digital Ecosystem)

### Caching Layer (`@11ty/eleventy-fetch`)

The caching system prevents API rate limiting and improves build performance:

```javascript
// Smart caching with configurable duration
const cachedData = await EleventyFetch(airtableUrl, {
  duration: config.cache || '1h',
  type: 'json',
  directory: '.cache',
});
```

**Caching Behavior**:

- **Fresh Data**: First request fetches from Airtable API
- **Cached Data**: Subsequent requests serve from `.cache/` directory
- **Cache Expiration**: Based on duration string in configuration
- **Force Refresh**: Delete `.cache/` directory to bypass cache

**CACHE GOTCHA**: During development, you might be looking at stale content. The cache is doing its job, but you might think your Airtable changes aren't syncing.

### Collection Transformation (`eleventy/collections/content.js`)

Raw Airtable records get transformed into 11ty-compatible collections:

```javascript
// Transform Airtable record structure
eleventyConfig.addCollection('projects', async function () {
  return airtableData.map(record => ({
    data: record.fields, // Airtable fields become data object
    slug: slugify(record.fields.Name), // Auto-generate URL slug
    id: record.id, // Preserve Airtable record ID
  }));
});
```

**Transformation Rules**:

- **Field Access**: Airtable fields become `record.data.FieldName`
- **Collection Names**: Always lowercase regardless of table casing ("Projects" → "projects")
- **Slug Generation**: Auto-generated from Name field using `slugify`
- **ID Preservation**: Original Airtable record IDs maintained for updates

### Template Integration (Where Content Meets Code)

Collections become accessible in Nunjucks templates:

```html
<!-- Access Airtable "Projects" table as "projects" collection -->
{% for project in collections.projects %}
<article>
  <h2>{{ project.data.Name }}</h2>
  <p>{{ project.data.Description }}</p>
  <img src="{{ project.data.Featured_Image[0].url }}" alt="{{ project.data.Name }}" />
</article>
{% endfor %}
```

**Field Access Patterns**:

- **Text Fields**: `{{ record.data.FieldName }}`
- **Rich Text**: `{{ record.data.RichTextField | safe }}` (renders HTML)
- **Attachments**: `{{ record.data.AttachmentField[0].url }}` (first attachment URL)
- **Linked Records**: `{{ record.data.LinkedField[0] }}` (first linked record)

## Troubleshooting Guide (Digital Emergency Response)

### API Authentication Failures

1. **Check token validity**: Test with Airtable API directly
2. **Verify base access**: Ensure token has permissions for target base
3. **Check environment variables**: Confirm `.env` file is loaded correctly
4. **Update token scopes**: Ensure `data.records:read` permission

### Content Not Appearing

1. **Verify table configuration**: Check exact spelling in `site.json`
2. **Check view filters**: Ensure records appear in specified view
3. **Clear cache**: Delete `.cache` directory and rebuild
4. **Test API directly**: Use curl or Postman to verify API response

### Template Rendering Issues

1. **Check field names**: Match Airtable field names exactly (with underscores)
2. **Handle empty fields**: Use conditional rendering for optional fields
3. **Debug collection data**: Use `{{ collections.table | log }}` to inspect structure
4. **Verify collection names**: Collections are lowercase table names

### Performance Problems

1. **Optimize cache duration**: Balance freshness vs. performance
2. **Limit record sets**: Use Airtable views to reduce data volume
3. **Check API rate limits**: Monitor for throttling errors
4. **Profile build times**: Identify slow collection generation

## Final Warning (The Last Stand Against Digital Chaos)

The Airtable integration is your content lifeline. It's the bridge between your content creators and your website. Break this integration and you break the entire content workflow.

This system is designed to be robust and fault-tolerant, but it depends on external APIs, proper configuration, and structured content. Airtable can change their API, your content structure can evolve, and network issues can cause intermittent failures.

The caching system is your friend and your enemy. It provides performance and reliability, but it can also hide problems by serving stale content. The configuration is powerful but unforgiving - one typo in a table name and your content disappears.

Respect the system's dependencies, understand the caching behavior, and always test your content changes. The integration will serve you well if you serve it well.

Remember: Content management is like a garden - it requires constant attention, careful cultivation, and the occasional pruning of digital weeds.

May your content always be fresh, your cache always be smart, and your API tokens never expire at 3 AM during a production deploy.
