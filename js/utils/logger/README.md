<!-- @format -->

# Logger Package

Debug logging system with singleton pattern, semantic color styling, and emoji prefixes.

## Overview

The Logger package provides consistent, configurable debug output for build scripts and development workflows. It features a singleton pattern for easy integration, semantic styling with color-coded output, and emoji prefixes for quick visual scanning.

## Package Structure

```plaintext
js/utils/logger/
├── index.js          # Package entry point with exports
├── Logger.js         # Main Logger singleton class
├── LoggerStyle.js    # Individual style class (color + prefix)
└── LoggerStyles.js   # Semantic style constants
```

## Quick Start

```javascript
import logger from '../js/utils/logger/index.js';

// Controlled by DEBUG environment variable
logger.trace('Processing files:', fileArray, 'brief', 'standard');
```

```bash
# Enable debug output
DEBUG=true npm run build:debug
```

## API Reference

### Import Patterns

**Recommended - Default singleton:**

```javascript
import logger from '../js/utils/logger/index.js';

// Use directly - no instantiation needed
logger.trace(message, obj, mode, style);
```

**Advanced - Named exports:**

```javascript
import { Logger, LoggerStyle, LoggerStyles } from '../js/utils/logger/index.js';

// Access singleton instance
const instance = Logger.getInstance();

// Access style objects (color + prefix)
console.log(LoggerStyles.SUCCESS.color); // '#10B981'
console.log(LoggerStyles.SUCCESS.prefix); // '✅'

// Create custom style
const customStyle = new LoggerStyle('#FF00FF', '🔮');
```

### trace() Method

```javascript
logger.trace(message, obj, mode, style);
```

**Parameters:**

- `message` (string) - User-defined message prefix
- `obj` (any, **optional**) - Object(s) to trace (any datatype or array). Can be omitted for message-only logging
- `mode` (string, optional) - Display mode: 'brief', 'verbose', or 'silent' (default: 'brief')
- `style` (string|LoggerStyle, optional) - Color style: 'standard', 'headsup', 'error', 'success', or a custom LoggerStyle instance (default: 'standard')

**Custom Styles:**

Create your own styles with custom colors and prefixes:

```javascript
import logger, { LoggerStyle } from '../js/utils/logger/index.js';

// Create custom style with color and prefix
const purpleStyle = new LoggerStyle('#9333EA', '🎨');
logger.trace('Creative mode:', data, 'brief', purpleStyle);

// Custom style without prefix
const cyanStyle = new LoggerStyle('#06B6D4');
logger.trace('Info:', data, 'brief', cyanStyle);

// Multiple custom styles for different purposes
const debugStyle = new LoggerStyle('#6366F1', '🐛');
const warningStyle = new LoggerStyle('#EAB308', '⚠️');
const celebrateStyle = new LoggerStyle('#10B981', '🎉');

logger.trace('Debug info:', debugData, 'verbose', debugStyle);
logger.trace('Warning:', warningMsg, 'brief', warningStyle);
logger.trace('Success!:', result, 'brief', celebrateStyle);
```

**Error Auto-Detection:**

When the `obj` parameter is an Error object and no explicit style is provided (defaults to 'standard'), Logger automatically applies the 'error' style with red ❌ prefix:

```javascript
// Auto-detection - no style parameter needed
try {
  somethingRisky();
} catch (err) {
  logger.trace('Operation failed:', err); // Automatically uses 'error' style
  logger.trace('Details:', err, 'verbose'); // Shows full stack trace with error styling
}

// Explicit override - bypasses auto-detection
logger.trace('Custom:', err, 'brief', 'success'); // Uses success style even for Error
```

**Examples:**

```javascript
// With object
logger.trace('User data:', { name: 'John' }, 'verbose', 'standard');

// Message only (no object)
logger.trace('Processing started...', undefined, 'brief', 'headsup');
logger.trace('Step completed', null, 'brief', 'success');

// Error auto-detection
logger.trace('Failed to load:', error); // Auto-applies error style
logger.trace('Stack trace:', error, 'verbose'); // Verbose error with auto-styling
```

### Indentation Methods

Control contextual indentation for hierarchical logging:

```javascript
// Manual indentation control
logger.indent(); // Increase indent level
logger.outdent(); // Decrease indent level
logger.resetIndent(); // Reset to zero

// Automatic indentation with groups
await logger.group(async () => {
  logger.trace('Indented automatically', data);
  await logger.group(async () => {
    logger.trace('Nested even deeper', moreData);
  });
});
```

**Indentation API:**

- `indent()` - Increase indentation by one level (2 spaces)
- `outdent()` - Decrease indentation by one level
- `resetIndent()` - Reset indentation to zero
- `group(fn)` - Execute function with auto-indent/outdent

**Display Modes:**

- **brief**: Shows datatype and value

  ```plaintext
  File count: [number] 42
  ```

- **verbose**: Shows datatype, structure, and all properties

  ```plaintext
  Config object: [object]
    Structure: Object
    Properties:
      enabled: (boolean) true
      timeout: (number) 5000
  ```

- **silent**: No output (useful for conditional debugging)

**Semantic Styles:**

Each style includes a color (hex value) and emoji icon for visual clarity:

- **standard** (● #6B7280) - Gray for informational messages (default)
- **headsup** (⚡ #F59E0B) - Amber for important/attention messages
- **error** (❌ #EF4444) - Red for errors and failures
- **success** (✅ #10B981) - Green for successful operations

**Output Format:**

```plaintext
● Message text: [datatype] value
⚡ Important notice: [object] { ... }
❌ Error occurred: [string] "error message"
✅ Operation complete: [number] 42
```

## Usage Examples

### Basic Implementation

```javascript
import logger from '../js/utils/logger/index.js';

async function processFiles() {
  // Start operation - attention grabbing (outputs: ⚡ Starting...)
  logger.trace('Starting file processing:', 'Analyzing directory...', 'brief', 'headsup');

  logger.indent();
  try {
    const files = await getFiles();

    // Informational - standard reporting (outputs:   ● Files found...)
    logger.trace('Files found:', files, 'verbose', 'standard');

    // Process files
    logger.indent();
    const result = await process(files);
    logger.outdent();

    // Success confirmation - positive feedback (outputs:   ✅ Processing complete...)
    logger.trace('Processing complete:', result, 'brief', 'success');
  } catch (err) {
    // Error reporting - critical attention (outputs:   ❌ Processing failed...)
    logger.trace('Processing failed:', err, 'verbose', 'error');
  } finally {
    logger.outdent();
  }
}
```

### Using Groups for Automatic Indentation

```javascript
import logger from '../js/utils/logger/index.js';

async function processFiles() {
  logger.trace('Starting file processing:', 'Analyzing directory...', 'brief', 'headsup');

  await logger.group(async () => {
    const files = await getFiles();
    logger.trace('Files found:', files, 'verbose', 'standard');

    await logger.group(async () => {
      const result = await process(files);
      logger.trace('Processing complete:', result, 'brief', 'success');
    });
  });
}
```

    // Success confirmation - positive feedback (outputs: ✅ Processing complete...)
    logger.trace('Processing complete:', result, 'brief', 'success');

} catch (err) {
// Error reporting - critical attention (outputs: ❌ Processing failed...)
logger.trace('Processing failed:', err, 'verbose', 'error');
}
}

````

### Build Script Integration

```javascript
import logger from '../js/utils/logger/index.js';
import { readdir } from 'fs/promises';

async function clearSiteFolder() {
  logger.trace('Starting cleanup:', 'Analyzing folder...', 'brief', 'headsup');

  try {
    const entries = await readdir(siteFolder);
    logger.trace('Folder entries:', entries, 'verbose'); // Uses default 'standard' style

    // ... cleanup operations ...

    logger.trace('Cleanup complete:', deletedCount, 'brief', 'success');
  } catch (err) {
    logger.trace('Cleanup failed:', err, 'verbose', 'error');
  }
}
````

## Build Integration

### Integrated Scripts

Logger is integrated into key build scripts:

- `scripts/clearSiteFolder.js` - Site cleanup logging
- `scripts/syncContent.js` - Content sync tracing
- `scripts/fetchFigma.js` - Design system fetch debugging

### Environment Control

Logger is controlled via the `DEBUG` environment variable:

```bash
# Normal build (Logger disabled)
npm run build

# Debug build (Logger enabled)
npm run build:debug

# Individual scripts with debug
npm run clean:debug
npm run sync:content:debug
npm run build:design:debug
```

### Best Practices

1. Import singleton logger: `import logger from '../js/utils/logger/index.js'`
2. **Default style is 'standard'** - omit fourth parameter for routine logging
3. Use 'headsup' style for attention-grabbing start messages (⚡)
4. Use 'standard' style for informational traces (●)
5. Use 'success' style for successful operations (✅)
6. Use 'error' style for failures and exceptions (❌)
7. Use 'verbose' mode for complex data structures
8. Use 'brief' mode for simple values and counts

Logger automatically initializes based on `DEBUG` environment variable - no setup required.

## Supported Data Types

Logger automatically handles:

- **Primitives**: string, number, boolean, null, undefined
- **Objects**: with property inspection
- **Arrays**: with element inspection
- **Dates**: ISO format output
- **Functions**: name and type display
- **Complex nested structures**: recursive formatting

## Output Styling

Logger uses Chalk with semantic hex colors:

- **Message text** - Styled based on style parameter (standard/headsup/error/success)
- **Emoji icons** - Visual indicators at start of each message
- **Cyan** - Data types
- **White** - Values
- **Gray** - Structure details

## Performance Considerations

- Logger checks `enabled` flag before any processing
- Silent mode has near-zero overhead
- Verbose mode may impact performance with large objects
- Use brief mode for production-like performance testing
- Singleton pattern ensures single instance across all imports

## Debugging Tips

### Enable for specific scripts

```bash
DEBUG=true npm run sync:content
DEBUG=true node scripts/clearSiteFolder.js
```

### Check logger initialization

Look for "Logger initialized: enabled/disabled" message at start

### Use mode progression

1. Start with 'brief' to identify issues
2. Switch to 'verbose' for detailed inspection
3. Use 'silent' to hide sensitive data

### Use semantic styles for clarity

1. **headsup** (⚡) - Important milestones, start of operations
2. **standard** (●) - Routine information, default logging
3. **success** (✅) - Confirmations, successful completions
4. **error** (❌) - Failures, exceptions, critical issues

## LoggerStyle & LoggerStyles Reference

### LoggerStyle Class

Each style is a `LoggerStyle` instance with two properties:

```javascript
import { LoggerStyle } from '../js/utils/logger/index.js';

// Create custom style
const customStyle = new LoggerStyle('#FF00FF', '🔮');
console.log(customStyle.color); // '#FF00FF'
console.log(customStyle.icon); // '🔮'
```

### Built-in Styles

```javascript
import { LoggerStyles } from '../js/utils/logger/index.js';

// Access color and icon properties
console.log(LoggerStyles.STANDARD.color); // '#6B7280' (Gray-500)
console.log(LoggerStyles.STANDARD.icon); // '●'

console.log(LoggerStyles.HEADSUP.color); // '#F59E0B' (Amber-500)
console.log(LoggerStyles.HEADSUP.icon); // '⚡'

console.log(LoggerStyles.ERROR.color); // '#EF4444' (Red-500)
console.log(LoggerStyles.ERROR.icon); // '❌'

console.log(LoggerStyles.SUCCESS.color); // '#10B981' (Green-500)
console.log(LoggerStyles.SUCCESS.icon); // '✅'
```

### Using with External Tools

```javascript
import chalk from 'chalk';
import { LoggerStyles } from '../js/utils/logger/index.js';

// Apply consistent colors outside Logger
const successStyle = LoggerStyles.SUCCESS;
console.log(successStyle.icon + ' ' + chalk.hex(successStyle.color)('Operation complete!'));

const errorStyle = LoggerStyles.ERROR;
console.log(errorStyle.icon + ' ' + chalk.hex(errorStyle.color)('Failed to load file'));
```

## Integration with Other Tools

Logger works alongside:

- **Chalk** - Hex color output styling via LoggerStyles
- **Console** - Standard console methods still work
- **Process stdout** - Direct terminal writing for server logs
- **11ty Debug** - Complementary to 11ty's built-in debugging

## Future Enhancements

Potential improvements:

- File output option for persistent logs
- Timestamp prefixes for timeline tracking
- Log level filtering (info, warn, error, debug)
- JSON output mode for parsing and analysis
- Performance timing integration
- Additional semantic styles (info, warning, debug)
- Configurable output formatters
- Remote logging support
