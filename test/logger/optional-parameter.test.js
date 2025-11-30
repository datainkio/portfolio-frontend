/** @format */

import logger from '../../js/utils/lumberjack/index.js';

logger.enabled = true;

console.log('🧪 Testing Logger with Optional obj Parameter\n');

// Test 1: Message only (no object)
logger.trace('Simple message without object', undefined, 'brief', 'headsup');

// Test 2: Message with explicit null
logger.trace('Message with null object', null, 'brief', 'standard');

// Test 3: Message with object
logger.trace('Message with object:', { name: 'Test', value: 123 }, 'brief', 'success');

// Test 4: Different styles without objects
logger.trace('Standard style message only', undefined, 'brief', 'standard');
logger.trace('Headsup style message only', undefined, 'brief', 'headsup');
logger.trace('Error style message only', undefined, 'brief', 'error');
logger.trace('Success style message only', undefined, 'brief', 'success');

// Test 5: In a group
console.log('\n🧪 Testing in group context\n');

await logger.group(async () => {
  logger.trace('Group started', undefined, 'brief', 'headsup');
  logger.indent();
  logger.trace('Processing step 1...', undefined, 'brief', 'standard');
  logger.trace('Processing step 2...', undefined, 'brief', 'standard');
  logger.trace('Step 2 result:', { status: 'complete', items: 5 }, 'brief', 'standard');
  logger.outdent();
  logger.trace('Group completed', undefined, 'brief', 'success');
});

// Test 6: Verbose mode without object (should work)
console.log('\n🧪 Testing verbose mode without object\n');
logger.trace('Verbose message without object', undefined, 'verbose', 'headsup');

console.log('\n✅ Optional parameter tests complete');
