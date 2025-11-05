<!-- @format --><!-- @format -->

# Lumberjack Logger# Lumberjack Package

**Dual-mode logging utility with semantic styling for Node.js terminal and browser console**Robust runtime console logging utility with singleton pattern, semantic color styling, and dual-mode output for both Node.js terminal and browser environments.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)## Overview

[![License](https://img.shields.io/badge/license-MIT-green.svg)](package.json)

The Lumberjack package provides consistent, configurable debug output for build scripts, development workflows, and runtime debugging. It features:

## Overview

- **Dual-Mode Support**: Automatically detects environment and uses appropriate styling (chalk for Node.js, CSS for browser)

Lumberjack provides consistent, beautiful debug output that works seamlessly in both build scripts (Node.js) and browser runtime. It automatically detects the environment and applies appropriate styling using chalk (terminal) or CSS (browser).- **Singleton Pattern**: Easy integration with zero configuration

- **Semantic Styling**: Color-coded output with emoji prefixes

**Key Features:**- **Auto-Detection**: Automatically applies error styling for Error objects

- **Hierarchical Output**: Indent/outdent for nested operations

- ✨ **Zero Configuration** - Works out of the box in Node.js and browser

- 🎨 **Semantic Styling** - Color-coded output with emoji prefixes## Environment Detection

- 🔄 **Dual-Mode** - Automatic environment detection

- 🏗️ **Singleton Pattern** - Easy global accessLumberjack automatically detects its runtime environment and adjusts output accordingly:

- 🎯 **Scoped Loggers** - Create module-specific loggers with custom colors

- 🔍 **Auto Error Detection** - Automatically styles Error objects- **Node.js Terminal**: Uses `chalk` package for colored terminal output (build scripts, CLI tools)

- 📊 **Hierarchical Output** - Indent/outdent for nested operations- **Browser Console**: Uses CSS `%c` directive for styled console output (runtime debugging)

- 🎭 **TypeScript Support** - Full type definitions included

No configuration needed - it just works in both environments!

## Installation

## Package Structure

This package is designed for internal use in the dataink.io portfolio project. It requires chalk as a peer dependency for Node.js environments:

````plaintext

```bashjs/utils/lumberjack/

npm install chalk@^5.0.0├── index.js                # Package entry point - exports singleton and classes

```├── Lumberjack.class.js     # Main Lumberjack singleton class

├── LumberjackStyle.js      # Individual style class (color + prefix)

## Quick Start├── LumberjackStyles.js     # Semantic style constants

└── README.md               # Documentation

### Basic Usage```



```javascript## Quick Start

import lumberjack from './js/utils/lumberjack/index.js';

```javascript

// Simple messageimport lumberjack from './js/utils/lumberjack/index.js';

lumberjack.trace('Build started');

// Basic logging

// Message with datalumberjack.trace('Processing files:', fileArray, 'brief', 'standard');

lumberjack.trace('Processing files:', fileArray, 'brief', 'standard');

// With error auto-detection

// Auto error stylingtry {

try {  riskyOperation();

  riskyOperation();} catch (err) {

} catch (err) {  lumberjack.trace('Operation failed:', err, 'verbose'); // Auto-applies error style

  lumberjack.trace('Operation failed:', err, 'verbose');}

}

```// Hierarchical logging

await lumberjack.group(async () => {

### Scoped Loggers  lumberjack.trace('Step 1', data1, 'brief', 'success');

  lumberjack.indent();

Create module-specific loggers with custom colors and prefixes:  lumberjack.trace('Sub-step 1.1', data2);

  lumberjack.outdent();

```javascript});

import { Lumberjack } from './js/utils/lumberjack/index.js';```



// Create scoped logger with custom prefix and color## API Reference

const logger = Lumberjack.createScoped('Director', {

  prefix: '🎬',### Import Patterns

  color: '#10B981'

});**Recommended - Default singleton:**



// Use like regular logger - prefix is automatically applied```javascript

logger.trace('Animation initialized', animData, 'brief', 'success');import lumberjack from './js/utils/lumberjack/index.js';

// Output: 🎬 [Director] Animation initialized { frames: 60 }

```// Use directly - no instantiation needed

lumberjack.trace(message, obj, mode, style);

### Hierarchical Logging```



```javascript**Advanced - Named exports:**

await lumberjack.group(async () => {

  lumberjack.trace('Parent operation', data1, 'brief', 'headsup');```javascript

  lumberjack.indent();import { Lumberjack, LumberjackStyle, LumberjackStyles } from '../js/utils/lumberjack/index.js';

  lumberjack.trace('Child step 1', data2);

  lumberjack.trace('Child step 2', data3);// Access singleton instance

  lumberjack.outdent();const instance = Lumberjack.getInstance();

});

```// Access style objects (color + prefix)

console.log(LumberjackStyles.SUCCESS.color); // '#10B981'

## API Referenceconsole.log(LumberjackStyles.SUCCESS.prefix); // '✅'



### Import Patterns// Create custom style

const customStyle = new LumberjackStyle('#FF00FF', '🔮');

**Default Singleton (Recommended):**```



```javascript### trace() Method

import lumberjack from './js/utils/lumberjack/index.js';

lumberjack.trace('Message');```javascript

```lumberjack.trace(message, obj, mode, style);

````

**Named Exports (Advanced):**

**Parameters:**

```javascript

import { - `message` (string) - User-defined message prefix

  Lumberjack,      // Main class- `obj` (any, **optional**) - Object(s) to trace (any datatype or array). Can be omitted for message-only logging

  LumberjackStyle, // Style class- `mode` (string, optional) - Display mode: 'brief', 'verbose', or 'silent' (default: 'brief')

  LumberjackStyles // Style constants- `style` (string|LumberjackStyle, optional) - Color style: 'standard', 'headsup', 'error', 'success', or a custom LumberjackStyle instance (default: 'standard')

} from './js/utils/lumberjack/index.js';

**Custom Styles:**

const instance = Lumberjack.getInstance();

const customStyle = new LumberjackStyle('#FF00FF', '🔮');Create your own styles with custom colors and prefixes:

```

````javascript

### Main Methodsimport lumberjack, { LumberjackStyle } from '../js/utils/lumberjack/index.js';



#### `trace(message, obj?, mode?, style?)`// Create custom style with color and prefix

const purpleStyle = new LumberjackStyle('#9333EA', '🎨');

Log a message with optional data, mode, and styling.lumberjack.trace('Creative mode:', data, 'brief', purpleStyle);



**Parameters:**// Custom style without prefix

const cyanStyle = new LumberjackStyle('#06B6D4');

| Parameter | Type | Default | Description |lumberjack.trace('Info:', data, 'brief', cyanStyle);

|-----------|------|---------|-------------|

| `message` | `string` | required | Primary message text |// Multiple custom styles for different purposes

| `obj` | `any` | `null` | Optional data to display (any type) |const debugStyle = new LumberjackStyle('#6366F1', '🐛');

| `mode` | `'brief' \| 'verbose' \| 'silent'` | `'brief'` | Display mode |const warningStyle = new LumberjackStyle('#EAB308', '⚠️');

| `style` | `string \| LumberjackStyle` | `'standard'` | Color style |const celebrateStyle = new LumberjackStyle('#10B981', '🎉');



**Display Modes:**lumberjack.trace('Debug info:', debugData, 'verbose', debugStyle);

lumberjack.trace('Warning:', warningMsg, 'brief', warningStyle);

- `'brief'` - Compact single-line outputlumberjack.trace('Success!:', result, 'brief', celebrateStyle);

- `'verbose'` - Multi-line formatted output with full details```

- `'silent'` - No output (useful for conditional logging)

**Error Auto-Detection:**

**Built-in Styles:**

When the `obj` parameter is an Error object and no explicit style is provided (defaults to 'standard'), Lumberjack automatically applies the 'error' style with red ❌ prefix:

- `'standard'` - White text (no prefix)

- `'headsup'` - Blue 🔵 prefix```javascript

- `'error'` - Red ❌ prefix (auto-applied for Error objects)// Auto-detection - no style parameter needed

- `'success'` - Green prefix (no icon)try {

  somethingRisky();

**Examples:**} catch (err) {

  lumberjack.trace('Operation failed:', err); // Automatically uses 'error' style

```javascript  lumberjack.trace('Details:', err, 'verbose'); // Shows full stack trace with error styling

// Basic message}

lumberjack.trace('Starting process');

// Explicit override - bypasses auto-detection

// With datalumberjack.trace('Custom:', err, 'brief', 'success'); // Uses success style even for Error

lumberjack.trace('Config loaded:', config, 'verbose');```



// Custom style**Dual-Mode Output:**

lumberjack.trace('Debug info:', data, 'brief', 'headsup');

Lumberjack automatically adapts its output styling based on the runtime environment:

// Silent mode

lumberjack.trace('Hidden', secret, 'silent');```javascript

```// Same code works in both environments!

lumberjack.trace('Build started:', config, 'brief', 'headsup');

#### `createScoped(scope, options?)`

// Node.js terminal output:

Create a scoped logger with custom prefix and color.// 📢 Build started: { env: 'production', minify: true }

// (with colored terminal text via chalk)

**Parameters:**

// Browser console output:

| Parameter | Type | Description |// 📢 Build started: { env: 'production', minify: true }

|-----------|------|-------------|// (with colored text via CSS %c directive)

| `scope` | `string` | Scope name (appears in brackets) |```

| `options.prefix` | `string` | Optional emoji/text prefix |

| `options.color` | `string` | Optional hex color (e.g., '#FF00FF') |**Environment-Specific Behavior:**



**Returns:** Scoped logger with same API as main logger- **Terminal (Node.js)**: Uses `chalk` package for ANSI color codes

- **Browser**: Uses `console.log('%c...', 'color: #hex')` CSS styling

**Example:**- **Detection**: Checks for `window` and `document` objects to determine environment

- **Graceful Degradation**: If chalk fails to import, falls back to plain text

```javascript

const logger = Lumberjack.createScoped('Animation', {**Examples:**

  prefix: '🎬',

  color: '#8B5CF6'```javascript

});// With object

lumberjack.trace('User data:', { name: 'John' }, 'verbose', 'standard');

logger.trace('Init complete');

// Output: 🎬 [Animation] Init complete// Message only (no object)

```lumberjack.trace('Processing started...', undefined, 'brief', 'headsup');

lumberjack.trace('Step completed', null, 'brief', 'success');

#### `indent()` / `outdent()` / `resetIndent()`

// Error auto-detection

Control indentation level for hierarchical output.lumberjack.trace('Failed to load:', error); // Auto-applies error style

lumberjack.trace('Stack trace:', error, 'verbose'); // Verbose error with auto-styling

```javascript```

lumberjack.trace('Parent');

lumberjack.indent();### Indentation Methods

  lumberjack.trace('Child 1');

  lumberjack.trace('Child 2');Control contextual indentation for hierarchical logging:

lumberjack.outdent();

lumberjack.trace('Back to parent level');```javascript

// Manual indentation control

// Or reset completelylumberjack.indent(); // Increase indent level

lumberjack.resetIndent();lumberjack.outdent(); // Decrease indent level

```lumberjack.resetIndent(); // Reset to zero



#### `group(fn)`// Automatic indentation with groups

await lumberjack.group(async () => {

Execute an async function with automatic indentation.  lumberjack.trace('Indented automatically', data);

  await lumberjack.group(async () => {

```javascript    lumberjack.trace('Nested even deeper', moreData);

await lumberjack.group(async () => {  });

  lumberjack.trace('Step 1');});

  lumberjack.trace('Step 2');```

  // Auto-outdents after completion

});### Scoped Loggers

````

Create module-specific loggers with custom scope prefixes and colors:

#### `configure(options)`

````javascript

Update logger configuration.import { Lumberjack } from './js/utils/lumberjack/index.js';



**Options:**// Basic scoped logger

const directorLogger = Lumberjack.createScoped('Director');

| Property | Type | Description |directorLogger.trace('Initializing...'); // Output: [Director] Initializing...

|----------|------|-------------|

| `enabled` | `boolean` | Enable/disable all logging |// With custom emoji prefix

| `prefix` | `string` | Global prefix for all messages |const figmaLogger = Lumberjack.createScoped('Figma', { prefix: '🎨' });

| `scope` | `string` | Scope name |figmaLogger.trace('Syncing tokens'); // Output: 🎨 [Figma] Syncing tokens



**Example:**// With custom scope color (applied to scope only)

const stageLogger = Lumberjack.createScoped('StageManager', {

```javascript  prefix: '🎬',

lumberjack.configure({   color: '#10B981', // Green scope

  enabled: process.env.DEBUG === 'true',});

  prefix: '[APP]'stageLogger.trace('ScrollSmoother initialized');

});// Output: 🎬 [StageManager] ScrollSmoother initialized

```//         (scope in green, message in white)



### Custom Styles// Scoped loggers inherit all methods

stageLogger.indent();

Create reusable custom styles:stageLogger.trace('Nested operation', data, 'verbose', 'success');

stageLogger.outdent();

```javascript```

import { LumberjackStyle } from './js/utils/lumberjack/index.js';

**Scoped Logger Benefits:**

// With prefix

const purpleStyle = new LumberjackStyle('#9333EA', '🎨');- Automatic prefix on all messages

lumberjack.trace('Creative mode:', data, 'brief', purpleStyle);- Custom color for easy visual identification

- Same API as main logger (trace, indent, group, etc.)

// Without prefix- Shared singleton state (indentation, enabled status)

const cyanStyle = new LumberjackStyle('#06B6D4');

lumberjack.trace('Info:', data, 'brief', cyanStyle);**Indentation API:**



// Multiple styles for different purposes- `indent()` - Increase indentation by one level (2 spaces)

const styles = {- `outdent()` - Decrease indentation by one level

  debug: new LumberjackStyle('#6366F1', '🐛'),- `resetIndent()` - Reset indentation to zero

  warning: new LumberjackStyle('#EAB308', '⚠️'),- `group(fn)` - Execute function with auto-indent/outdent

  celebrate: new LumberjackStyle('#10B981', '🎉')

};**Display Modes:**



lumberjack.trace('Debug:', debugData, 'verbose', styles.debug);- **brief**: Shows datatype and value

lumberjack.trace('Warning:', msg, 'brief', styles.warning);

lumberjack.trace('Success!:', result, 'brief', styles.celebrate);  ```plaintext

```  File count: [number] 42

````

## Environment Detection

- **verbose**: Shows datatype, structure, and all properties

Lumberjack automatically detects the runtime environment:

```````plaintext

**Node.js Terminal:**  Config object: [object]

- Uses chalk package for colored output    Structure: Object

- ANSI escape codes for styling    Properties:

- Optimized for terminal display      enabled: (boolean) true

    timeout: (number) 5000

**Browser Console:**  ```

- Uses CSS `%c` directive

- Styled with inline CSS- **silent**: No output (useful for conditional debugging)

- Full color support in modern browsers

**Semantic Styles:**

**Example (works in both):**

Each style includes a color (hex value) and emoji icon for visual clarity:

```javascript

// Same code produces styled output in terminal AND browser- **standard** (● #6B7280) - Gray for informational messages (default)

lumberjack.trace('Processing:', data, 'verbose', 'headsup');- **headsup** (⚡ #F59E0B) - Amber for important/attention messages

```- **error** (❌ #EF4444) - Red for errors and failures

- **success** (✅ #10B981) - Green for successful operations

**Terminal Output:**

```**Output Format:**

🔵 Processing: { files: 10, status: 'ready' }

``````plaintext

● Message text: [datatype] value

**Browser Console:**⚡ Important notice: [object] { ... }

<span style="color: #3B82F6">🔵</span> Processing: { files: 10, status: 'ready' }❌ Error occurred: [string] "error message"

✅ Operation complete: [number] 42

## Advanced Usage```



### Error Auto-Detection## Usage Examples



When `obj` is an Error and style is `'standard'`, automatically applies error styling:### Basic Implementation



```javascript```javascript

try {import lumberjack from '../js/utils/lumberjack/index.js';

riskyOperation();

} catch (err) {async function processFiles() {

// Automatic error styling (red ❌)  // Start operation - attention grabbing (outputs: ⚡ Starting...)

lumberjack.trace('Failed:', err);  lumberjack.trace('Starting file processing:', 'Analyzing directory...', 'brief', 'headsup');



// Verbose shows stack trace  lumberjack.indent();

lumberjack.trace('Details:', err, 'verbose');  try {

    const files = await getFiles();

// Override with explicit style

lumberjack.trace('Custom:', err, 'brief', 'success');    // Informational - standard reporting (outputs:   ● Files found...)

}    lumberjack.trace('Files found:', files, 'verbose', 'standard');

```````

    // Process files

### Script Execution Outline lumberjack.indent();

    const result = await process(files);

Display a formatted execution plan: lumberjack.outdent();

````javascript // Success confirmation - positive feedback (outputs:   ✅ Processing complete...)

lumberjack.showScriptOutline('Build Process', [    lumberjack.trace('Processing complete:', result, 'brief', 'success');

  { name: 'Clean', description: 'Remove old files' },  } catch (err) {

  { name: 'Compile', description: 'Build sources' },    // Error reporting - critical attention (outputs:   ❌ Processing failed...)

  { name: 'Deploy', description: 'Upload to server' }    lumberjack.trace('Processing failed:', err, 'verbose', 'error');

], 'verbose', 'headsup');  } finally {

```    lumberjack.outdent();

  }

### Conditional Logging}

````

````javascript

const logger = Lumberjack.getInstance();### Using Groups for Automatic Indentation



// Disable in production```javascript

logger.enabled = process.env.NODE_ENV !== 'production';import lumberjack from '../js/utils/lumberjack/index.js';



// Or configure globallyasync function processFiles() {

lumberjack.configure({   lumberjack.trace('Starting file processing:', 'Analyzing directory...', 'brief', 'headsup');

  enabled: process.env.DEBUG === 'true'

});  await lumberjack.group(async () => {

```    const files = await getFiles();

    lumberjack.trace('Files found:', files, 'verbose', 'standard');

### Multiple Scoped Loggers

    await lumberjack.group(async () => {

```javascript      const result = await process(files);

const animation = Lumberjack.createScoped('Animation', {      lumberjack.trace('Processing complete:', result, 'brief', 'success');

  prefix: '🎬',    });

  color: '#8B5CF6'  });

});}

````

const stage = Lumberjack.createScoped('Stage', {

prefix: '🎭', // Success confirmation - positive feedback (outputs: ✅ Processing complete...)

color: '#10B981' lumberjack.trace('Processing complete:', result, 'brief', 'success');

});

} catch (err) {

const sequence = Lumberjack.createScoped('Sequence', {// Error reporting - critical attention (outputs: ❌ Processing failed...)

prefix: '🎞️',lumberjack.trace('Processing failed:', err, 'verbose', 'error');

color: '#F59E0B'}

});}

// Each logger maintains its own identity````

animation.trace('Init complete'); // 🎬 [Animation] Init complete

stage.trace('Scene rendered'); // 🎭 [Stage] Scene rendered### Build Script Integration

sequence.trace('Frame 1 ready'); // 🎞️ [Sequence] Frame 1 ready

````javascript

import lumberjack from '../js/utils/lumberjack/index.js';

## TypeScript Supportimport { readdir } from 'fs/promises';



Full TypeScript definitions are included in `types.d.ts`:async function clearSiteFolder() {

  lumberjack.trace('Starting cleanup:', 'Analyzing folder...', 'brief', 'headsup');

```typescript

import lumberjack, {   try {

  Lumberjack,     const entries = await readdir(siteFolder);

  LumberjackStyle,     lumberjack.trace('Folder entries:', entries, 'verbose'); // Uses default 'standard' style

  LogMode,

  LogStyleName     // ... cleanup operations ...

} from './js/utils/lumberjack/index.js';

    lumberjack.trace('Cleanup complete:', deletedCount, 'brief', 'success');

const mode: LogMode = 'verbose';  } catch (err) {

const style: LogStyleName = 'success';    lumberjack.trace('Cleanup failed:', err, 'verbose', 'error');

  }

lumberjack.trace('Message', data, mode, style);}

````

## Package Structure## Build Integration

````### Integrated Scripts

js/utils/lumberjack/

├── index.js                # Package entry - singleton exportLumberjack is integrated into key build scripts:

├── Lumberjack.class.js     # Main logger class (~590 lines)

├── LumberjackStyle.js      # Style definition class- `scripts/clearSiteFolder.js` - Site cleanup logging

├── LumberjackStyles.js     # Semantic style constants- `scripts/syncContent.js` - Content sync tracing

├── constants.js            # Package constants- `scripts/fetchFigma.js` - Design system fetch debugging

├── package.json            # Package metadata

├── types.d.ts              # TypeScript definitions### Environment Control

└── README.md               # This file

```Lumberjack is controlled via the `DEBUG` environment variable:



## Configuration Constants```bash

# Normal build (Lumberjack disabled)

Package constants are centralized in `constants.js`:npm run build



```javascript# Debug build (Lumberjack enabled)

export const INDENT_SIZE = 2;           // Spaces per indent levelnpm run build:debug

export const MAX_ARRAY_PREVIEW = 3;     // Array items in brief mode

export const MAX_OBJECT_PREVIEW = 3;    // Object keys in brief mode# Individual scripts with debug

export const BASE_STYLE = 'color: white; font-weight: normal';npm run clean:debug

export const DEFAULT_MODE = 'brief';npm run sync:content:debug

export const DEFAULT_STYLE = 'standard';npm run build:design:debug

````

## Best Practices### Best Practices

### 1. Use Scoped Loggers for Modules1. Import singleton lumberjack: `import lumberjack from '../js/utils/lumberjack/index.js'`

2. **Default style is 'standard'** - omit fourth parameter for routine logging

```javascript3. Use 'headsup' style for attention-grabbing start messages (⚡)

// Director.js4. Use 'standard' style for informational traces (●)

const logger = Lumberjack.createScoped('Director', {5. Use 'success' style for successful operations (✅)

  prefix: '🎬',6. Use 'error' style for failures and exceptions (❌)

  color: '#10B981'7. Use 'verbose' mode for complex data structures

});8. Use 'brief' mode for simple values and counts



export class Director {Lumberjack automatically initializes based on `DEBUG` environment variable - no setup required.

  init() {

    logger.trace('Initializing', this.config, 'verbose', 'headsup');## Supported Data Types

  }

}Lumberjack automatically handles:

```

- **Primitives**: string, number, boolean, null, undefined

### 2. Consistent Naming- **Objects**: with property inspection

- **Arrays**: with element inspection

````javascript- **Dates**: ISO format output

// Use consistent scope names matching file/class names- **Functions**: name and type display

const heroLogger = Lumberjack.createScoped('Hero', { color: '#F59E0B' });- **Complex nested structures**: recursive formatting

const workLogger = Lumberjack.createScoped('Work', { color: '#06B6D4' });

```## Output Styling



### 3. Mode SelectionLumberjack uses Chalk with semantic hex colors:



- Use `'brief'` for simple status updates- **Message text** - Styled based on style parameter (standard/headsup/error/success)

- Use `'verbose'` for debugging complex objects- **Emoji icons** - Visual indicators at start of each message

- Use `'silent'` for conditional logging- **Cyan** - Data types

- **White** - Values

### 4. Style Selection- **Gray** - Structure details



- `'standard'` - Default for general messages## Performance Considerations

- `'headsup'` - Important events, warnings

- `'error'` - Failures, exceptions (auto-applied)- Lumberjack checks `enabled` flag before any processing

- `'success'` - Successful operations- Silent mode has near-zero overhead

- Custom styles - Domain-specific semantic meaning- Verbose mode may impact performance with large objects

- Use brief mode for production-like performance testing

### 5. Hierarchical Organization- Singleton pattern ensures single instance across all imports



```javascript## Debugging Tips

lumberjack.trace('Starting batch operation', null, 'brief', 'headsup');

await lumberjack.group(async () => {### Enable for specific scripts

  for (const item of items) {

    lumberjack.trace(`Processing: ${item.name}`, item, 'brief');```bash

  }DEBUG=true npm run sync:content

});DEBUG=true node scripts/clearSiteFolder.js

lumberjack.trace('Batch complete', result, 'brief', 'success');```

````

### Check lumberjack initialization

## Troubleshooting

Look for "Lumberjack initialized: enabled/disabled" message at start

### Chalk Not Found (Node.js)

### Use mode progression

If you see "Cannot find module 'chalk'" in Node.js:

1. Start with 'brief' to identify issues

```bash2. Switch to 'verbose' for detailed inspection

npm install chalk@^5.0.03. Use 'silent' to hide sensitive data

```

### Use semantic styles for clarity

### No Colors in Terminal

1. **headsup** (⚡) - Important milestones, start of operations

Check that your terminal supports ANSI colors. Most modern terminals do.2. **standard** (●) - Routine information, default logging

3. **success** (✅) - Confirmations, successful completions

### Silent in Production4. **error** (❌) - Failures, exceptions, critical issues

By default, logging is enabled. Disable in production:## LumberjackStyle & LumberjackStyles Reference

```````javascript### LumberjackStyle Class

lumberjack.configure({

  enabled: process.env.NODE_ENV !== 'production' Each style is a `LumberjackStyle` instance with two properties:

});

``````javascript

import { LumberjackStyle } from '../js/utils/lumberjack/index.js';

## Migration from v1.x

// Create custom style

**Breaking Changes:**const customStyle = new LumberjackStyle('#FF00FF', '🔮');

console.log(customStyle.color); // '#FF00FF'

- Removed static constants `#INDENT_SIZE`, `#MAX_ARRAY_PREVIEW`, `#MAX_OBJECT_PREVIEW` (now in `constants.js`)console.log(customStyle.icon); // '🔮'

- SUCCESS style no longer includes ✅ emoji prefix```

- All text uses normal font weight (bold styling removed)

### Built-in Styles

**Migration Steps:**

```javascript

1. Import constants if needed:import { LumberjackStyles } from '../js/utils/lumberjack/index.js';

   ```javascript

   import { INDENT_SIZE } from './constants.js';// Access color and icon properties

   ```console.log(LumberjackStyles.STANDARD.color); // '#6B7280' (Gray-500)

console.log(LumberjackStyles.STANDARD.icon); // '●'

2. Update custom SUCCESS style usage:

   ```javascriptconsole.log(LumberjackStyles.HEADSUP.color); // '#F59E0B' (Amber-500)

   // Old: SUCCESS had ✅ prefixconsole.log(LumberjackStyles.HEADSUP.icon); // '⚡'

   // New: SUCCESS has no prefix (green color only)

   const customSuccess = new LumberjackStyle('#10B981', '🎉');console.log(LumberjackStyles.ERROR.color); // '#EF4444' (Red-500)

   ```console.log(LumberjackStyles.ERROR.icon); // '❌'



3. No action needed for font weight (automatic)console.log(LumberjackStyles.SUCCESS.color); // '#10B981' (Green-500)

console.log(LumberjackStyles.SUCCESS.icon); // '✅'

## Contributing```



This package follows the dataink.io development conventions:### Using with External Tools



- ES Modules (import/export)```javascript

- Async/await patternsimport chalk from 'chalk';

- Consistent chalk-colored console outputimport { LumberjackStyles } from '../js/utils/lumberjack/index.js';

- Comprehensive JSDoc documentation

// Apply consistent colors outside Lumberjack

## Licenseconst successStyle = LumberjackStyles.SUCCESS;

console.log(successStyle.icon + ' ' + chalk.hex(successStyle.color)('Operation complete!'));

MIT - Part of the dataink.io portfolio project

const errorStyle = LumberjackStyles.ERROR;

## Version Historyconsole.log(errorStyle.icon + ' ' + chalk.hex(errorStyle.color)('Failed to load file'));

```````

- **2.0.0** - Constants extraction, TypeScript support, package.json

- **1.x** - Initial implementation with singleton pattern## Integration with Other Tools

Lumberjack works alongside:

- **Chalk** - Hex color output styling via LumberjackStyles
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
