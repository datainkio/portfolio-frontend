/**
 * ---
 * aix:
 *   id: frontend.test.logger.real-world-test
 *   role: Test module: test/logger/real-world.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/52
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - logger
 * ---
 */
/** @format */

/**
 * Test Error Auto-Detection in Real Scenarios
 *
 * Simulates common error patterns to verify auto-detection works correctly
 */

import logger from '@datainkio/lumberjack';

logger.enabled = true;

console.log('\n=== Real-World Error Auto-Detection Tests ===\n'); // Scenario 1: Try-catch without explicit style
console.log('Scenario 1: File operation error (no explicit style)\n');
try {
  throw new Error('ENOENT: File not found');
} catch (err) {
  logger.trace('File read failed:', err); // Should auto-detect and use error style
}

// Scenario 2: API error in verbose mode
console.log('\nScenario 2: API error with verbose mode\n');
try {
  const apiError = new Error('Failed to fetch from API');
  apiError.statusCode = 404;
  apiError.endpoint = '/api/users';
  throw apiError;
} catch (err) {
  logger.trace('API request failed:', err, 'verbose'); // Should auto-detect error style
}

// Scenario 3: Multiple errors in sequence
console.log('\nScenario 3: Multiple errors in sequence\n');
await logger.group(async () => {
  logger.trace('Processing batch:', { count: 3 }, 'brief', 'headsup');

  logger.indent();
  for (let i = 1; i <= 3; i++) {
    try {
      throw new Error(`Item ${i} processing failed`);
    } catch (err) {
      logger.trace(`Item ${i} error:`, err); // Auto-detect for each error
    }
  }
  logger.outdent();

  logger.trace('Batch complete with errors', undefined, 'brief', 'success');
});

// Scenario 4: Mixed success and error logging
console.log('\nScenario 4: Mixed success and error logging\n');
await logger.group(async () => {
  logger.trace('Starting operation:', 'Fetching data...', 'brief', 'headsup');

  logger.indent();

  // Success case
  logger.trace('Step 1 completed:', { status: 'ok' }, 'brief', 'success');

  // Error case - auto-detection
  try {
    throw new Error('Step 2 failed: Network timeout');
  } catch (err) {
    logger.trace('Step 2 failed:', err); // Auto-detect
  }

  // Recovery success
  logger.trace('Recovery completed:', { retries: 3 }, 'brief', 'success');

  logger.outdent();
});

// Scenario 5: Error with custom properties
console.log('\nScenario 5: Error with custom properties (verbose)\n');
class CustomError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
  }
}

try {
  throw new CustomError('Database connection failed', 'DB_CONN_ERR', {
    host: 'localhost',
    port: 5432,
    timeout: 5000,
  });
} catch (err) {
  logger.trace('Database error:', err, 'verbose'); // Auto-detect with full details
}

console.log('\n=== All Real-World Tests Complete ===\n');
