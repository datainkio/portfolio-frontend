/** @format */

/**
 * Test Logger Custom Styles
 *
 * Demonstrates how to create and use custom styles with Logger
 */

import logger, { LoggerStyle } from '../../js/utils/logger/index.js';

console.log('\n=== Testing Logger Custom Styles ===\n');

// Test 1: Custom purple style with art palette icon
console.log('Test 1: Custom purple style');
const purpleStyle = new LoggerStyle('#9333EA', '🎨');
logger.trace('Custom purple message:', { theme: 'creative' }, 'brief', purpleStyle);

// Test 2: Custom blue style with rocket icon
console.log('\nTest 2: Custom blue style with rocket');
const blueStyle = new LoggerStyle('#3B82F6', '🚀');
logger.trace('Launch sequence:', { status: 'ready' }, 'brief', blueStyle);

// Test 3: Custom orange style with fire icon
console.log('\nTest 3: Custom orange style');
const orangeStyle = new LoggerStyle('#F97316', '🔥');
logger.trace('Hot topic:', { temperature: 'blazing' }, 'verbose', orangeStyle);

// Test 4: Custom pink style with sparkles (no icon color mismatch)
console.log('\nTest 4: Custom pink style');
const pinkStyle = new LoggerStyle('#EC4899', '✨');
logger.trace('Special announcement:', undefined, 'brief', pinkStyle);

// Test 5: Custom cyan style without icon
console.log('\nTest 5: Custom cyan style (no icon)');
const cyanStyle = new LoggerStyle('#06B6D4');
logger.trace('Info message:', { type: 'notification' }, 'brief', cyanStyle);

// Test 6: Custom styles in group context
console.log('\nTest 6: Custom styles in hierarchical logging');
const infoStyle = new LoggerStyle('#8B5CF6', 'ℹ️');
const warnStyle = new LoggerStyle('#EAB308', '⚠️');

await logger.group(async () => {
  logger.trace('Starting custom process:', undefined, 'brief', infoStyle);

  logger.indent();
  logger.trace('Step 1 complete', { result: 'ok' }, 'brief', blueStyle);
  logger.trace('Warning detected', { level: 'minor' }, 'brief', warnStyle);
  logger.trace('Final step', undefined, 'brief', purpleStyle);
  logger.outdent();

  logger.trace('Process complete', undefined, 'brief', 'success');
});

// Test 7: Mix custom and built-in styles
console.log('\nTest 7: Mixing custom and built-in styles');
const customSuccess = new LoggerStyle('#10B981', '🎉');
logger.trace('Built-in headsup:', { msg: 'standard' }, 'brief', 'headsup');
logger.trace('Custom success:', { msg: 'custom' }, 'brief', customSuccess);
logger.trace('Built-in error:', new Error('test'), 'brief', 'error');

// Test 8: Custom style with verbose mode
console.log('\nTest 8: Custom style with verbose mode');
const debugStyle = new LoggerStyle('#6366F1', '🐛');
const debugData = {
  userId: 123,
  action: 'login',
  timestamp: new Date().toISOString(),
  metadata: { ip: '192.168.1.1', browser: 'Chrome' },
};
logger.trace('Debug info:', debugData, 'verbose', debugStyle);

console.log('\n=== Custom Style Tests Complete ===\n');
