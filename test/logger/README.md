<!-- @format -->

# Logger Test Suite

Comprehensive test suite for the Logger utility package.

## Test Organization

```
test/logger/
├── index.js                    # Test suite runner
├── styles.test.js              # Style and prefix rendering tests
├── errors.test.js              # Error object handling tests
├── optional-parameter.test.js  # Optional parameter functionality
├── error-detection.test.js     # Automatic error detection tests
└── real-world.test.js          # Real-world usage scenarios
```

## Running Tests

### Run All Tests

```bash
npm test:logger
```

Or directly:

```bash
DEBUG=true node test/logger/index.js
```

### Run Individual Tests

```bash
# Styles and prefixes
DEBUG=true node test/logger/styles.test.js

# Error handling
DEBUG=true node test/logger/errors.test.js

# Optional parameters
DEBUG=true node test/logger/optional-parameter.test.js

# Error auto-detection
DEBUG=true node test/logger/error-detection.test.js

# Real-world scenarios
DEBUG=true node test/logger/real-world.test.js
```

## Test Coverage

### 1. Styles & Prefixes (`styles.test.js`)

Tests all semantic styles with their corresponding prefixes:

- ● Standard style (gray) - informational messages
- ⚡ Headsup style (amber) - attention-grabbing messages
- ❌ Error style (red) - error and failure messages
- ✅ Success style (green) - success and completion messages

Verifies both brief and verbose modes for each style.

### 2. Error Handling (`errors.test.js`)

Tests Error object formatting:

- Brief mode: Shows error message only
- Verbose mode: Shows name, message, and full stack trace
- Custom error types (TypeError, etc.)
- Error handling within group contexts

### 3. Optional Parameters (`optional-parameter.test.js`)

Tests optional `obj` parameter functionality:

- Message-only logging (no object)
- With undefined/null object values
- All style combinations without objects
- Group contexts with optional parameters
- Verbose mode without objects

### 4. Error Auto-Detection (`error-detection.test.js`)

Tests automatic error style application:

- Error with default parameters (auto-detects)
- Error in brief mode (auto-detects)
- Error in verbose mode (auto-detects)
- Explicit style override (respects user choice)
- Non-error objects (uses standard style)
- Mixed error and regular logging

### 5. Real-World Scenarios (`real-world.test.js`)

Tests practical usage patterns:

- Try-catch error logging without explicit style
- API errors with verbose mode
- Multiple errors in sequence
- Mixed success and error logging
- Custom error classes with properties
- Grouped operations with errors

### 6. Custom Styles (`custom-styles.test.js`)

Tests custom style functionality:

- Creating custom LoggerStyle instances with colors and prefixes
- Using custom styles with brief and verbose modes
- Custom styles without prefixes
- Mixing custom and built-in styles
- Custom styles in hierarchical logging contexts
- Custom styles with complex data objects

## Best Practices Demonstrated

### Test File Naming

- `*.test.js` suffix for all test files
- Descriptive names matching functionality tested
- Kebab-case for multi-word names

### Test Structure

- Clear test descriptions with comments
- Grouped related tests with `logger.group()`
- Visual separators for test sections
- Console output for manual verification

### Import Paths

- Relative imports from test directory: `../../js/utils/logger/index.js`
- Consistent import patterns across all tests

### Error Testing

- Tests both expected behavior and edge cases
- Verifies auto-detection and manual overrides
- Includes real-world error scenarios

## Adding New Tests

1. Create new test file: `test/logger/feature-name.test.js`
2. Use consistent structure:

```javascript
/** @format */

/**
 * Test Description
 */

import logger from '../../js/utils/logger/index.js';

console.log('\n=== Test Suite Name ===\n');

// Test cases here

console.log('\n=== Tests Complete ===\n');
```

3. Add to test runner in `index.js`:

```javascript
const tests = [
  // ... existing tests
  { name: 'Feature Name', file: 'feature-name.test.js' },
];
```

4. Update this README with test description

## Maintenance

- Keep tests focused on single functionality
- Update tests when Logger API changes
- Add regression tests for bug fixes
- Document expected behavior in comments
