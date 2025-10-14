<!-- @format -->

# Logger Indentation System Updates

## Summary

Updated all build scripts with hierarchical indentation for improved debug output readability. The Logger now uses visual hierarchy to show nested operations, making complex build processes easier to understand and debug.

## Files Updated

### 1. Logger Core (`js/utils/logger/`)

- **Logger.js** - Added indentation system with private `#indentLevel` field
- **index.js** - Exported new indentation methods
- **README.md** - Comprehensive documentation with examples

### 2. Build Scripts

All build scripts now use the Logger indentation system for better visual hierarchy:

#### `scripts/clearSiteFolder.js`

- Uses `logger.indent()` after starting site folder analysis
- Double indent for deletion operations
- Uses `logger.outdent()` to return to parent context
- Uses `logger.resetIndent()` in finally block for clean state

**Example Output:**

```
⚡ Starting site cleanup: [string] "Analyzing folder structure..."
  ● Site folder entries found: [array]
    ● Successfully deleted: [array]
```

#### `scripts/syncContent.js`

- Uses `logger.group()` for automatic indentation management
- Nested groups for file processing loop
- Smart error handling with appropriate styles
- Conditional success/error style based on results

**Example Output:**

```
⚡ Starting content sync: [string] "Analyzing cache directory..."
  ● Buffer files found: [number] 3347
    ● File type detected: [object]
      Structure: Object
      Properties:
        file: (string) "example.buffer"
        type: (string) "image/png"
  ✅ Sync complete: [object] { copied: 0, skipped: 3347, errors: 0 }
```

#### `scripts/fetchFigma.js`

- Uses `logger.group()` for main design sync operation
- Nested group for style updates (palette, fonts)
- Individual success messages for each service
- Comprehensive error logging with full context

**Example Output:**

```
⚡ Starting Figma design sync: [string] "Fetching design file..."
  ● Design file loaded: [object]
    ● Styles retrieved: [object]
      ✅ Palette written: [string] "Color styles synced"
      ✅ Font imports updated: [string] "Typography imports synced"
      ✅ Font families updated: [string] "Typography families synced"
  ✅ Design sync complete: [string] "All styles updated"
```

## Indentation API

The Logger now provides four methods for managing indentation:

### Manual Control

- `logger.indent()` - Increase indentation level by one
- `logger.outdent()` - Decrease indentation level by one
- `logger.resetIndent()` - Reset to zero indentation

### Automatic Control

- `logger.group(async fn)` - Execute function with automatic indent/outdent using try/finally

## Benefits

1. **Visual Hierarchy** - Nested operations are clearly visible
2. **Context Awareness** - Easy to see which operation is currently executing
3. **Error Tracking** - Indentation preserved in error messages shows exact context
4. **Automatic Cleanup** - `group()` method ensures proper outdent even on errors
5. **Debug Efficiency** - Faster to identify issues in complex build processes

## Testing

All scripts tested with `DEBUG=true` environment variable:

```bash
DEBUG=true node scripts/clearSiteFolder.js
DEBUG=true node scripts/syncContent.js
DEBUG=true node scripts/fetchFigma.js
```

Or use the convenience NPM scripts:

```bash
npm run clean:debug
npm run sync:content:debug
npm run build:design:debug
```

## Next Steps

Consider applying indentation pattern to other scripts:

- `scripts/init.js`
- `scripts/init11ty.js`
- `scripts/initTailwind.js`
- Figma service files (PaletteService, TypographyService, etc.)
