/** @format */

/**
 * Test Console Clearing Functionality
 *
 * This test demonstrates the Logger's console clearing capability
 * which provides a clean output environment for all logging operations.
 */

import logger from '../../js/utils/logger/index.js';

// Simulate console clutter before logger initialization
console.log('This message should disappear...');
console.log('So should this one...');
console.log('And this one too...');
console.log('All of these messages will be cleared when Logger initializes.');

// Enable logger - this will clear the console first
logger.enabled = true;

console.log('\n=== Console Clearing Test ===\n');

// Test manual console clearing
console.log('Before manual clear...');
console.log('This content will be cleared manually...');

logger.clearConsole();

// This should be the only visible output
logger.trace(
  'Console cleared successfully!',
  'All previous output should be gone',
  'brief',
  'success'
);

logger.trace('Clean logging environment:', 'Perfect for focused debugging', 'brief', 'headsup');

console.log('\n=== Console Clearing Test Complete ===\n');
