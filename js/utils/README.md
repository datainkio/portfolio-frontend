<!-- @format -->

# Utils Directory - Utility Classes and Functions

Shared JavaScript utilities used across the portfolio site.

## Available Utilities

### Logger Package (`logger/`)

**Debug logging system with singleton pattern, semantic color styling, and emoji icons.**

- **Location**: `js/utils/logger/`
- **Documentation**: [logger/README.md](./logger/README.md)
- **Import**: `import logger from '../js/utils/logger/index.js'`

**Quick Example:**

```javascript
import logger from '../js/utils/logger/index.js';

// Controlled by DEBUG environment variable
logger.trace('Processing files:', fileArray, 'brief', 'standard');
```

**Key Features:**

- ● Standard (default) - Informational messages
- ⚡ Heads Up - Important attention-grabbing messages
- ❌ Error - Error and failure messages
- ✅ Success - Successful operation confirmations
- Three display modes: brief, verbose, silent
- Singleton pattern for consistent usage
- Environment-controlled via `DEBUG=true`

**Enable Debug Output:**

```bash
DEBUG=true npm run build:debug
```

See [full Logger documentation](./logger/README.md) for complete API reference.

### Theme Management (`theme.js`)

Handles light/dark theme switching with localStorage persistence:

```javascript
import { setTheme, getTheme, initTheme } from '/assets/js/utils/theme.js';

// Initialize theme on page load
initTheme();

// Get current theme
const currentTheme = getTheme(); // 'light' or 'dark'

// Set theme programmatically
setTheme('dark');
```

### Asset Path Resolution (`assetPath.js`)

Resolves asset paths for different environments:

```javascript
import { getAssetPath } from '/assets/js/utils/assetPath.js';

const imagePath = getAssetPath('images/logo.png');
// Returns: '/assets/images/logo.png'
```

## Directory Structure

```plaintext
js/utils/
├── README.md              # This file
├── logger/                # Logger package
│   ├── README.md         # Logger documentation
│   ├── index.js          # Package entry point
│   ├── Logger.js         # Singleton logger class
│   ├── LoggerStyle.js    # Style class (color + icon)
│   └── LoggerStyles.js   # Semantic style constants
├── theme.js              # Theme management
└── assetPath.js          # Asset path utilities
```
