<!-- @format -->

# Test Suite

Automated tests for the Portfolio project components.

## Directory Structure

```
test/
├── README.md           # This file
└── logger/            # Logger utility tests
    ├── README.md                   # Logger test documentation
    ├── index.js                    # Logger test runner
    ├── styles.test.js              # Style rendering tests
    ├── errors.test.js              # Error handling tests
    ├── optional-parameter.test.js  # Optional parameter tests
    ├── error-detection.test.js     # Auto-detection tests
    └── real-world.test.js          # Real-world scenarios
```

## Running Tests

### All Logger Tests

```bash
npm run test:logger
```

### Individual Test Suites

```bash
# Logger styles and prefixes
DEBUG=true node test/logger/styles.test.js

# Logger error handling
DEBUG=true node test/logger/errors.test.js

# More tests available - see test/logger/README.md
```

## Test Organization Principles

### File Naming

- `*.test.js` suffix for all test files
- Descriptive, kebab-case names
- Grouped by feature/component in subdirectories

### Directory Structure

- `/test` - Root test directory
- `/test/[component]` - Component-specific tests
- Each component has its own README and test runner

### Test File Structure

```javascript
/** @format */

/**
 * Test Description
 */

import moduleUnderTest from "../../path/to/module";

console.log("\n=== Test Suite Name ===\n");

// Test cases with descriptive comments
// Visual separators for readability
// Grouped related tests

console.log("\n=== Tests Complete ===\n");
```

## Adding New Test Suites

1. **Create Component Directory**

   ```bash
   mkdir test/component-name
   ```

2. **Add Test Files**

   ```bash
   touch test/component-name/feature.test.js
   ```

3. **Create Test Runner**

   ```bash
   touch test/component-name/index.js
   ```

4. **Add Documentation**

   ```bash
   touch test/component-name/README.md
   ```

5. **Update package.json**
   ```json
   {
     "scripts": {
       "test:component-name": "node test/component-name/index.js"
     }
   }
   ```

## Test Suites

### Logger (`/test/logger`)

Comprehensive tests for the Logger utility:

- **Styles**: Prefix and color rendering
- **Errors**: Error object handling and formatting
- **Optional Parameters**: API flexibility tests
- **Auto-Detection**: Error detection without explicit styling
- **Real-World**: Practical usage scenarios

See [test/logger/README.md](./logger/README.md) for details.

## Best Practices

### Test Independence

- Each test file runs independently
- No shared state between tests
- Clean environment for each run

### Visual Output

- Clear test descriptions with emojis (🧪, ✅, ❌)
- Visual separators for readability
- Grouped related assertions

### Error Handling

- Test both success and failure cases
- Verify error messages and types
- Include edge cases

### Documentation

- Each test suite has comprehensive README
- Inline comments explain test intent
- Examples of expected behavior

### Import Paths

- Use relative imports from test location
- Consistent path patterns across tests
- Document any special import requirements

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Logger Tests
  run: npm run test:logger
```

## Debugging Tests

### Enable Verbose Output

```bash
DEBUG=true node test/logger/index.js
```

### Run Single Test

```bash
DEBUG=true node test/logger/specific-test.test.js
```

### Inspect Logger State

Logger tests use `DEBUG=true` to enable full output for verification.

## Future Test Suites

Planned test coverage for:

- **Figma Integration** (`/test/figma`)
- **Sanity Data** (`/test/sanity`)
- **11ty Collections** (`/test/eleventy`)
- **Build Scripts** (`/test/scripts`)

## Contributing

When adding tests:

1. Follow naming conventions (`*.test.js`)
2. Add comprehensive README for new suites
3. Update this main README
4. Include test runner script
5. Add npm script to package.json
6. Document expected behavior
7. Test both success and failure cases
