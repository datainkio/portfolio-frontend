<!-- @format -->

# Airtable CMS Integration & Content Pipeline

This directory contains the **headless CMS integration layer** that transforms
your Airtable content into website-ready data. It handles content fetching,
image optimization, caching, and relationship mapping automatically.

## What This System Enables for UX

The Airtable integration serves as the **content operations engine**:

- **Non-technical content editing** - Content creators work in familiar
  spreadsheet interface
- **Automatic optimization** - Images are processed and optimized without manual
  intervention
- **Smart caching** - Content updates only when changed, improving build
  performance
- **Relationship management** - Content connections (projects → images →
  organizations) handled automatically
- **Progressive enhancement** - Content flows through optimized pipeline to
  final user experience

## Content-to-Website Pipeline

```
Airtable Spreadsheet → Fetch & Cache → Process Media → Generate Slugs → 11ty Collections → Website
```

This automated pipeline ensures content creators can focus on storytelling while
the system handles technical optimization.

## How Content Flows from Airtable

### 1. **Content Structure in Airtable**

Content editors create and manage content in Airtable bases with tables for:

- **Projects** - Portfolio work with titles, descriptions, images, roles
- **Organizations** - Clients and partners with logos and info
- **Images** - Media library with attachments and metadata
- **Awards** - Recognition and achievements
- **Activities** - Timeline events and milestones
- _(and more as configured in `njk/_data/site.json`)_

### 2. **Automatic Fetching**

During build, the system:

- Reads table configuration from `site.json`
- Fetches only published content using configured views
- Respects cache duration to minimize API calls
- Processes records in batches with progress tracking

### 3. **Smart Processing**

Each record goes through enhancement:

- **Field normalization** - Keys converted to lowercase for consistency
- **Image optimization** - Attachments processed into responsive formats
- **Slug generation** - URLs created from titles automatically
- **Relationship linking** - IDs converted to actual content references

### 4. **Collection Creation**

Processed data becomes 11ty collections accessible in templates:

```nunjucks
{% for project in collections.projects %}
  {{ project.title }}
{% endfor %}
```

## Core System Components

### `fetchAirtableData.js` - Content Retrieval Engine

**What it does**: Fetches and caches content from Airtable tables **UX Impact**:
Ensures fresh content while maintaining fast build times

**Key Features:**

- **Smart caching** - Configurable duration per table (e.g., "4w" = 4 weeks)
- **Progress tracking** - Visual feedback during content sync
- **Batch processing** - Handles large content libraries efficiently
- **Error recovery** - Continues processing if individual records fail

**Configuration Example** (in `njk/_data/site.json`):

```json
{
  "airtables": [
    {
      "tableName": "Projects",
      "tableView": "Published",
      "cache": "4w"
    }
  ]
}
```

### `processFile.js` - Media Optimization Pipeline

**What it does**: Transforms uploaded images into optimized, responsive formats
**UX Impact**: Fast-loading images that look great on all devices

**Automatic Processing:**

- **Multiple formats** - Generates WebP and JPEG versions
- **Responsive sizes** - Creates multiple widths for different viewports
- **SVG preservation** - Vector graphics maintain quality
- **Smart caching** - Processes images once, reuses across builds
- **Progress visualization** - Real-time progress bar during processing

**Output Structure:**

```
_site/content/images/
  ├── svg/        → Vector graphics
  ├── webp/       → Modern optimized format
  └── jpeg/       → Universal fallback format
```

### `ImageProcessingStatus.js` - Build Visibility

**What it does**: Provides visual feedback during image processing **UX
Impact**: Build transparency helps understand processing time

Shows real-time progress:

```
🖼️  Processing Images |████████░░| 80% | 80/100 Images | image/jpeg
```

### `/scripts/` - Content Management Utilities

#### `validateProjects.js` - Content Quality Assurance

**What it does**: Validates content structure and completeness **UX Impact**:
Catches content issues before they reach users

#### `updateImageMeta.js` - Batch Metadata Updates

**What it does**: Updates image metadata across multiple records **UX Impact**:
Enables efficient content management at scale

## Content Creator Workflow

### Adding New Content

#### 1. **Create Record in Airtable**

- Open your Airtable base
- Add new row to appropriate table
- Fill in required fields (title, description, etc.)
- Upload images to attachment fields
- Set status to "Published" in view

#### 2. **Automatic Processing**

Next build automatically:

- Fetches your new content
- Processes attached images
- Generates URL slugs
- Creates relationships to other content

#### 3. **Live on Website**

Content appears in appropriate templates:

- Project cards show on portfolio page
- Detail pages generate automatically
- Images load in optimized formats
- Navigation updates to include new content

### Updating Existing Content

#### 1. **Edit in Airtable**

- Change text, swap images, update relationships
- No technical knowledge needed

#### 2. **Cache Management**

- Recent edits: Rebuild immediately to see changes
- Older content: Wait for cache expiration or clear cache manually

#### 3. **Relationship Updates**

- Change project organizations, add gallery images
- System automatically resolves new connections

## Content Relationships & Data Modeling

### How Content Connects

Airtable uses record IDs to link content:

**In Airtable:**

```
Projects table:
  - Title: "Museum App"
  - Organizations: [rec123, rec456]  ← IDs
  - Gallery: [rec789, rec012]        ← IDs
```

**After Processing:**

```nunjucks
{# In templates, IDs become full records #}
{% set orgs = collections.organizations | findRecord(project.organizations) %}
{% for org in orgs %}
  {{ org.name }}  {# Actual organization data #}
{% endfor %}
```

### Common Content Patterns

#### Projects with Related Content

```nunjucks
{% set project = collections.projects | findRecord("project-id") %}
{% set client = collections.organizations | findRecord(project.organizations) %}
{% set images = collections.images | findRecord(project.gallery) %}
```

#### Featured Content Collections

```nunjucks
{# site.json defines featured project IDs #}
{% set featured = collections.projects | findRecord(site.featured_projects.museums) %}
```

## Performance & Optimization

### Smart Caching Strategy

**Goal**: Balance fresh content with fast builds

- **Frequently updated**: Short cache (1 day - 1 week)
- **Stable content**: Long cache (2-4 weeks)
- **Reference data**: Very long cache (4+ weeks)

**Configure in `site.json`:**

```json
{
  "tableName": "Projects",
  "cache": "1w" // 1 day (1d), 1 week (1w), 4 weeks (4w)
}
```

### Image Optimization Benefits

**Automatic User Experience Improvements:**

- **70-80% smaller file sizes** - WebP format reduces bandwidth
- **Responsive images** - Right size for each device
- **Progressive loading** - Images appear gradually
- **Format fallbacks** - Universal browser support

## Content Quality & Validation

### Required Fields

Ensure content completeness by including:

- **Title** - For headlines and navigation
- **Description/Teaser** - For summaries and SEO
- **Status** - Use views to control published vs. draft
- **Images** - At least one for visual interest

### Best Practices for Content Creators

#### Image Guidelines

- **Resolution**: Upload high-quality originals (system will optimize)
- **Aspect ratio**: Consistent ratios within content types
- **Alt text**: Descriptive names aid accessibility
- **File names**: Use descriptive names for better organization

#### Text Content

- **Titles**: Clear, concise, unique
- **Descriptions**: Complete sentences with proper grammar
- **Relationships**: Always link to related content when relevant

#### Publishing Workflow

1. Create content in "Draft" status
2. Review and refine
3. Change view to "Published"
4. Rebuild site to make live

## Troubleshooting Content Issues

### Content Not Appearing?

- Check record is in "Published" view in Airtable
- Verify table name matches `site.json` configuration
- Clear cache: Delete `.cache/` folder and rebuild

### Images Not Loading?

- Ensure attachment field is named "File"
- Check image uploaded successfully in Airtable
- Verify build logs for processing errors

### Relationships Not Working?

- Confirm linked records are published
- Check field contains valid Airtable record IDs
- Use `findRecord` filter in templates

This content pipeline enables content creators to work in a familiar spreadsheet
interface while automatically delivering optimized, connected content that
creates seamless user experiences across the website.
