# Eleventy Services Directory

This directory contains **service classes** that encapsulate complex business logic for the 11ty static site generator. Services follow the Single Responsibility Principle and provide clean, testable APIs for data processing operations.

## What is a "Service" in This Context?

A **service** in this architecture is a specialized class that:

1. **Encapsulates Business Logic**: Contains complex data transformation, processing, and manipulation logic that would otherwise clutter collection registration files
2. **Provides Clean APIs**: Offers well-defined methods with clear inputs/outputs for specific domain operations
3. **Separates Concerns**: Isolates processing logic from 11ty configuration and template concerns
4. **Enables Testability**: Can be unit tested independently without requiring 11ty runtime environment
5. **Promotes Reusability**: Logic can be used across multiple contexts (collections, APIs, build scripts, etc.)

### Service vs. Other Patterns

**Services are NOT:**

- 11ty plugins (those extend functionality globally)
- Filters or shortcodes (those transform template content)
- Collections (those register data with 11ty)
- Utilities (those provide general-purpose helper functions)

**Services ARE:**

- Domain-specific processors that handle complex operations
- Stateful classes that can be configured and reused
- Business logic containers that abstract away implementation details
- Clean interfaces between data sources and 11ty collections

## Current Services

### TailwindLogger.js

**CRITICAL WARNING**: This service provides comprehensive transparency into the Tailwind CSS build process, matching the same level of detail used throughout the project for 11ty collections and Figma services. **DO NOT bypass this service** - the detailed logging is essential for debugging CSS generation issues and performance optimization.

**Purpose**: Provides detailed build transparency for Tailwind CSS compilation with comprehensive analysis and logging.

**Responsibilities**:

- Tracks build performance metrics (timing, file sizes, memory usage)
- Analyzes Tailwind configuration for optimization opportunities
- Parses input CSS structure (imports, layers, custom properties)
- Examines generated CSS output for performance insights
- Provides actionable optimization recommendations
- Integrates with existing Logger utility for consistent output styling
- Captures and formats build errors with resolution guidance

**Used By**: `scripts/buildCSS.js` for wrapping Tailwind CLI execution

**Key Methods**:

- `startBuild(buildId, mode, inputFile, outputFile)` - Initializes build logging
- `logConfigAnalysis(config)` - Analyzes Tailwind configuration
- `logFileAnalysis(filePath)` - Examines input CSS structure
- `logOutputAnalysis(outputPath, buildOutput)` - Analyzes generated CSS
- `completeBuild(startTime)` - Finalizes build with performance metrics
- `logError(error, context)` - Handles build failures with debugging info

**Architecture Integration**:

```javascript
// Example usage in build script
const logger = new TailwindLogger();
const buildId = logger.startBuild('production', 'styles/main.css', '_site/assets/styles.css');

await logger.group(async () => {
  await logger.logConfigAnalysis(tailwindConfig);
  await logger.logFileAnalysis('styles/main.css');

  // Execute Tailwind CLI
  const result = await execTailwindCLI();

  await logger.logOutputAnalysis('_site/assets/styles.css', result);
  logger.completeBuild(startTime);
});
```

**Logging Output Standards**:

- **Build Transparency**: Same detail level as 11ty collections
- **Performance Metrics**: Build timing, file sizes, optimization flags
- **Visual Consistency**: Uses project's Logger utility and LoggerStyle classes
- **Error Context**: Actionable debugging information for build failures
- **Integration Points**: Automatic triggering via Figma design token sync

**Critical Dependencies**:

- Logger utility for consistent output styling
- LoggerStyle classes for visual formatting
- Node.js fs/promises for file analysis
- Tailwind CLI output parsing for metrics

### NavigationBuilder.js

**Purpose**: Handles all navigation processing logic for the site's complex navigation system.

**Responsibilities**:

- Processes directory-based navigation from `_pages` files
- Transforms Airtable projects data into navigation items
- Builds hierarchical parent-child navigation structures
- Provides defensive error handling and validation
- Manages navigation item formatting and standardization

**Used By**: `eleventy/collections/navigation.js` for 11ty collection registration

**Key Methods**:

- `buildDirectoryNavigation(collectionApi)` - Processes file system navigation
- `buildProjectNavigation(collectionApi)` - Handles CMS project data
- `buildPrimaryNavigationFromData(directories, projects)` - Merges and hierarchizes
- `formatDirectoryItems(items)` - Standardizes directory data
- `formatProjectItems(items)` - Standardizes project data
- `buildNestedStructure(items)` - Creates parent-child relationships

## Architecture Patterns

### Dependency Injection

Services receive configuration through constructor injection:

```javascript
const navigationBuilder = new NavigationBuilder(site);
```

### Separation of Concerns

- **Collections**: Register with 11ty and handle collection lifecycle
- **Services**: Process data and implement business logic
- **Templates**: Render processed data into HTML

### Error Handling

All services implement defensive programming:

- Null/undefined checks before processing
- Graceful degradation with logging
- Input validation with meaningful error messages
- Filtering of invalid data rather than crashing

## Development Guidelines

### Creating New Services

1. **Identify Complex Logic**: Look for functions >50 lines or with multiple responsibilities
2. **Define Clear Interface**: Design methods with single purposes and clear contracts
3. **Implement Defensive Coding**: Validate inputs, handle edge cases, provide logging
4. **Document Dependencies**: Clearly specify what configuration/data the service requires
5. **Add Comprehensive JSDoc**: Include purpose, parameters, return values, and usage examples

### Service Class Template

```javascript
/**
 * [ServiceName] Service
 *
 * [Brief description of purpose and responsibilities]
 *
 * ARCHITECTURE OVERVIEW:
 * - [Key responsibility 1]
 * - [Key responsibility 2]
 * - [Key responsibility 3]
 *
 * CRITICAL DEPENDENCIES:
 * - [Required configuration]
 * - [External dependencies]
 * - [Integration points]
 *
 * @class [ServiceName]
 */
import logger, { LoggerStyle } from '../../js/utils/logger/index.js';

export class [ServiceName] {
  constructor(config) {
    this.config = config;
  }

  // Methods with comprehensive JSDoc
}
```

### Naming Conventions

- **Class Names**: PascalCase with descriptive nouns (e.g., `NavigationBuilder`, `ContentProcessor`)
- **Method Names**: camelCase with action verbs (e.g., `buildNavigation`, `processContent`)
- **File Names**: PascalCase matching class name (e.g., `NavigationBuilder.js`)

## Integration with 11ty

### Collection Registration Pattern

Services should be used in collection registration files:

```javascript
// eleventy/collections/[domain].js
import { SomeService } from '../services/SomeService.js';

export async function init(eleventyConfig, site) {
  const service = new SomeService(site);

  eleventyConfig.addCollection('collection_name', function (collectionApi) {
    return service.processData(collectionApi);
  });
}
```

### Data Flow

```
Raw Data → Service Processing → 11ty Collection → Template Rendering → HTML Output
```

1. **Raw Data**: Files, CMS data, APIs
2. **Service Processing**: Transformation, validation, structuring
3. **11ty Collection**: Registered data accessible in templates
4. **Template Rendering**: Nunjucks/Liquid template processing
5. **HTML Output**: Final static site files

## Testing Services

Services can be unit tested independently:

```javascript
// test/services/NavigationBuilder.test.js
import { NavigationBuilder } from '../../eleventy/services/NavigationBuilder.js';

describe('NavigationBuilder', () => {
  it('should build directory navigation', () => {
    const builder = new NavigationBuilder(mockSiteConfig);
    const result = builder.buildDirectoryNavigation(mockCollectionApi);
    expect(result).toHaveLength(expectedLength);
  });
});
```

## Performance Considerations

- **Caching**: Services may implement internal caching for expensive operations
- **Lazy Loading**: Heavy processing should only occur when collections are actually used
- **Memory Usage**: Large data transformations should be streamed or batched when possible
- **Build Time**: Services directly impact 11ty build performance

## Common Service Patterns

### Data Transformation Services

Process raw data into template-ready formats:

- Content formatting and validation
- Image processing and optimization
- Data enrichment and cross-referencing

### Integration Services

Handle external system interactions:

- CMS data fetching and caching
- API integrations with rate limiting
- Design token synchronization

### Build Services

Perform complex build-time operations:

- Asset pipeline management
- Directory structure analysis
- Dependency graph construction

## Migration Guide

When extracting logic into services:

1. **Identify**: Find complex functions in collection files
2. **Extract**: Move logic to new service class
3. **Interface**: Design clean method signatures
4. **Test**: Verify functionality with existing templates
5. **Document**: Add comprehensive documentation
6. **Refactor**: Update collection files to use service

## Future Expansion

The services directory may grow to include:

- `ContentProcessor` - For markdown and rich text processing
- `AssetManager` - For image and media file handling
- `SearchIndexer` - For search functionality
- `SitemapBuilder` - For SEO and site structure
- `CacheManager` - For intelligent build caching

---

**CRITICAL WARNING**: Services are core infrastructure. Changes to service APIs may require updates to:

- Collection registration files
- Template logic that depends on data structure
- Build scripts and automation
- Performance optimization strategies

Always test thoroughly and maintain backward compatibility when modifying existing services.
