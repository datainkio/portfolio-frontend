/** @format */

/**
 * Test Logger's automatic Error detection
 *
 * This script verifies that Error objects are automatically styled as 'error'
 * even when the style parameter is not explicitly provided.
 */

import logger from '../../js/utils/logger/index.js';

console.log('\n=== Testing Logger Error Auto-Detection ===\n'); // Test 1: Error with default style (should auto-detect and use error style)
console.log('Test 1: Error with default parameters');
const error1 = new Error('Something went wrong');
logger.trace('Default style test:', error1);

console.log('\nTest 2: Error with explicit brief mode but no style');
const error2 = new Error('Another error occurred');
logger.trace('Brief mode test:', error2, 'brief');

console.log('\nTest 3: Error with verbose mode but no style');
const error3 = new Error('Verbose error details');
logger.trace('Verbose mode test:', error3, 'verbose');

console.log('\nTest 4: Error with explicitly overridden style (should use success)');
const error4 = new Error('Error styled as success');
logger.trace('Explicit style override:', error4, 'brief', 'success');

console.log('\nTest 5: Non-error object with default style (should use standard)');
const obj = { name: 'test', value: 123 };
logger.trace('Regular object:', obj);

console.log('\nTest 6: Mixed - error then regular object');
const error5 = new Error('First error');
logger.trace('Error detected:', error5);
logger.trace('Regular data:', { status: 'ok' });

console.log('\nTest 7: Error in verbose mode (should show stack trace)');
try {
  throw new Error('Stack trace test');
} catch (err) {
  logger.trace('Caught error:', err, 'verbose');
}

console.log('\n=== All Error Auto-Detection Tests Complete ===\n');
