<!-- @format -->

# Eleventy Configuration - Logger Integration

## Summary

Updated `.eleventy.js` to use the Logger utility for consistent, hierarchical debug output during the build process.

## Changes Made

### Replaced chalk with Logger

**Before:**

```javascript
import chalk from 'chalk';

console.log(chalk.gray('.'.repeat(50)));
console.log(chalk.magenta('\n11ty is running\n'));
```

**After:**

```javascript
import logger from './js/utils/logger/index.js';

await logger.group(async () => {
  logger.trace('11ty Configuration:', 'Initializing Eleventy...', 'brief', 'headsup');
  // ... configuration steps ...
  logger.trace('11ty configuration complete:', 'Ready to build site', 'brief', 'success');
});
```

### Enhanced Configuration Logging

The updated `.eleventy.js` now provides detailed logging for each configuration step:

1. **Initialization** - Headsup style for visibility

   ```javascript
   logger.trace('11ty Configuration:', 'Initializing Eleventy static site generator...', 'brief', 'headsup');
   ```

2. **Passthrough Copy** - Standard style for informational

   ```javascript
   logger.trace('Configuring passthrough copy:', 'Setting up static asset routing...', 'brief', 'standard');
   ```

3. **Plugins** - Standard style

   ```javascript
   logger.trace('Loading plugins:', 'Registering 11ty plugins...', 'brief', 'standard');
   ```

4. **Filters** - Standard style

   ```javascript
   logger.trace('Loading filters:', 'Registering template filters...', 'brief', 'standard');
   ```

5. **Shortcodes** - Standard style

   ```javascript
   logger.trace('Loading shortcodes:', 'Registering template shortcodes...', 'brief', 'standard');
   ```

6. **Collections** - Standard style

   ```javascript
   logger.trace('Loading collections:', 'Registering data collections...', 'brief', 'standard');
   ```

7. **Completion** - Success style for confirmation
   ```javascript
   logger.trace('11ty configuration complete:', 'Ready to build site', 'brief', 'success');
   ```

### Visual Grouping

Wrapped all configuration logging in `logger.group()` for visual separation with decorative separators when DEBUG mode is enabled.

## Output Examples

### Without DEBUG mode (normal build)

```
Logger initialized: disabled
[11ty] Copied 185 Wrote 22 files in 0.55 seconds (v3.0.0)
```

### With DEBUG mode enabled

```
Logger initialized: enabled

::::::::::::::::::

  ⚡ 11ty Configuration: [string] "Initializing Eleventy static site generator..."
  Configuring passthrough copy: [string] "Setting up static asset routing..."
  Loading plugins: [string] "Registering 11ty plugins..."
  Loading filters: [string] "Registering template filters..."
  Loading shortcodes: [string] "Registering template shortcodes..."
  Loading collections: [string] "Registering data collections..."
  ✅ 11ty configuration complete: [string] "Ready to build site"

::::::::::::::::::
```

## Benefits

1. ✅ **Consistent Logging** - Same logger used across all build scripts
2. ✅ **Hierarchical Output** - Group separators show configuration as a distinct phase
3. ✅ **Debug Control** - Controlled by DEBUG environment variable
4. ✅ **Semantic Styling** - Different styles for different message types
5. ✅ **Better Visibility** - Easy to spot configuration issues during development

## Usage

### Normal Build (silent Logger)

```bash
npm run build:11ty
```

### Debug Build (verbose Logger)

```bash
DEBUG=true npm run build:11ty
```

### Development with Debug

```bash
DEBUG=true npm run dev:11ty
```

## Integration Pattern

This pattern can be applied to other configuration files:

- Eleventy plugin configurations
- Custom data processing scripts
- Template filters and shortcodes
- Any 11ty extension that needs debug output

## Notes

- The export function is now `async` to support `logger.group()`
- Logger state persists across 11ty rebuilds (singleton pattern)
- No performance impact when DEBUG is not enabled
- Visual separators only appear for top-level groups (when DEBUG=true)
