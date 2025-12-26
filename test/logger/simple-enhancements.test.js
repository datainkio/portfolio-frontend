#!/usr/bin/env node
/** @format */

/**
 * Simple Logger Enhancement Test
 *
 * Tests Logger enhancements without triggering console clearing issues
 */

import lumberjack from '@datainkio/lumberjack';

// Force Logger to be enabled
const instance = Logger;
instance.enabled = true;

console.log('\n🧪 LOGGER ENHANCEMENT TESTS');
console.log('─'.repeat(50));

// Test 1: Configuration
console.log('\n1. Testing Logger.configure():');
Logger.configure({ prefix: '[TEST]' });
Logger.trace('Configuration test successful');

// Test 2: Scoped logger
console.log('\n2. Testing scoped loggers:');
const scopedLogger = Logger.createScoped('MyService');
scopedLogger.trace('Scoped logging test');

// Test 3: Scoped logger with custom prefix
console.log('\n3. Testing scoped logger with custom prefix:');
const customLogger = Logger.createScoped('CustomService', { prefix: '🚀' });
customLogger.trace('Custom scoped logging test');

// Test 4: Script outline with scope
console.log('\n4. Testing scoped script outline:');
const buildLogger = Logger.createScoped('Build');
buildLogger.showScriptOutline('Test Process', [
  { name: 'step1', description: 'First step' },
  { name: 'step2', description: 'Second step' },
]);

console.log('\n✅ Logger enhancement tests completed!');
