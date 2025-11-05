/** @format */

/**
 * Test Logger Custom Styles
 *
 * Demonstrates how to create and use custom styles with Logger
 */

import logger, { LumberjackStyle } from '../../js/utils/lumberjack/index.js';

console.log('\n=== Testing Logger Custom Styles ===\n');

// Test 1: Custom purple style with art palette prefix
console.log('Test 1: Custom purple style');
const purpleStyle = new LumberjackStyle('#9333EA', '🎨');
logger.trace('Custom purple message:', { theme: 'creative' }, 'brief', purpleStyle);

// Test 2: Custom blue style with rocket prefix
console.log('\nTest 2: Custom blue style with rocket');
const blueStyle = new LumberjackStyle('#3B82F6', '🚀');
logger.trace('Launch sequence:', { status: 'ready' }, 'brief', blueStyle);

// Test 3: Custom orange style with fire prefix
console.log('\nTest 3: Custom orange style');
const orangeStyle = new LumberjackStyle('#F97316', '🔥');
logger.trace('Hot topic:', { temperature: 'blazing' }, 'verbose', orangeStyle);

// Test 4: Custom pink style with sparkles
console.log('\nTest 4: Custom pink style');
const pinkStyle = new LumberjackStyle('#EC4899', '✨');
logger.trace('Special announcement:', undefined, 'brief', pinkStyle);

// Test 5: Custom cyan style without prefix
console.log('\nTest 5: Custom cyan style (no prefix)');
const cyanStyle = new LumberjackStyle('#06B6D4');
logger.trace('Info message:', { type: 'notification' }, 'brief', cyanStyle);

// Test 6: Custom styles in group context
console.log('\nTest 6: Custom styles in hierarchical logging');
const infoStyle = new LumberjackStyle('#8B5CF6', 'ℹ️');
const warnStyle = new LumberjackStyle('#EAB308', '⚠️');

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
const customSuccess = new LumberjackStyle('#10B981', '🎉');
logger.trace('Built-in headsup:', { msg: 'standard' }, 'brief', 'headsup');
logger.trace('Custom success:', { msg: 'custom' }, 'brief', customSuccess);
logger.trace('Built-in error:', new Error('test'), 'brief', 'error');

// Test 8: Custom style with verbose mode
console.log('\nTest 8: Custom style with verbose mode');
const debugStyle = new LumberjackStyle('#6366F1', '🐛');
const debugData = {
  userId: 123,
  action: 'login',
  timestamp: new Date().toISOString(),
  metadata: { ip: '192.168.1.1', browser: 'Chrome' },
};
logger.trace('Debug info:', debugData, 'verbose', debugStyle);

console.log('\n=== Custom Style Tests Complete ===\n');
