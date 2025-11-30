# Lumberjack Migration Guide

## Breaking Change: Default State Now Disabled

**Date:** November 29, 2025

### Summary

Lumberjack logging is now **disabled by default**. All instances must explicitly enable logging to produce output.

### Before

```javascript
import lumberjack from './js/utils/lumberjack/index.js';

// Logging was enabled by default
lumberjack.trace('This would appear'); // ✅ Output
```

### After

```javascript
import lumberjack from './js/utils/lumberjack/index.js';

// Logging is disabled by default
lumberjack.trace('This will NOT appear'); // ❌ No output

// Must explicitly enable
lumberjack.enabled = true;
lumberjack.trace('This will appear'); // ✅ Output
```

### Rationale

- **Cleaner Default Behavior**: No unexpected console output in production
- **Explicit Intent**: Developers must consciously enable debugging
- **Browser Console**: Prevents cluttering browser console by default
- **Performance**: Reduces unnecessary logging operations

### Migration Steps

All build scripts and services that use lumberjack have been updated to explicitly enable logging:

**Updated Files:**

- `.eleventy.js`
- `scripts/fetchFigma.js`
- `scripts/syncContent.js`
- `scripts/clearSiteFolder.js`
- `scripts/generateAirtableSchema.js`
- `scripts/buildCSS.js`
- `scripts/buildPreview.js`
- `airtable/fetchAirtableData.js`
- `eleventy/collections/content.js`
- `eleventy/collections/navigation.js`
- `eleventy/services/NavigationBuilder.js`
- `eleventy/services/TailwindLogger.js`
- All test files in `test/logger/`

### For New Scripts

When creating new scripts that should output logging:

```javascript
import logger from '../js/utils/lumberjack/index.js';

// Enable logging at the top of your script
logger.enabled = true;

// Now use normally
logger.trace('Script started', null, 'brief', 'headsup');
```

### Configuration Options

You can also use environment variables:

```javascript
// Enable based on DEBUG flag
logger.enabled = process.env.DEBUG === 'true';

// Or use configure method
logger.configure({
  enabled: process.env.NODE_ENV === 'development',
});
```

### Browser Runtime

For browser-side code (e.g., `js/choreography/`), lumberjack remains disabled by default. Enable it in browser console for debugging:

```javascript
// In browser console
lumberjack.enabled = true;
```

### Testing

Verify the change:

```bash
# Should show "disabled" and no unwanted output
node -e "import lumberjack from './js/utils/lumberjack/index.js';"
```

### Questions?

See the main README.md for full documentation (note: README currently has formatting issues and needs repair).
