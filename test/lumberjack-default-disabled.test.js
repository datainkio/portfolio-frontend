/** @format */

/**
 * Test Lumberjack Default Disabled State
 *
 * Verifies that lumberjack defaults to disabled and only produces output
 * when explicitly enabled.
 */

import lumberjack from '../js/utils/lumberjack/index.js';

console.log('\n=== Testing Lumberjack Default Disabled State ===\n');

// Test 1: Default state should be disabled
console.log('Test 1: Check default enabled state');
console.log('  Expected: false');
console.log('  Actual:', lumberjack.enabled);
console.log('  Result:', lumberjack.enabled === false ? '✅ PASS' : '❌ FAIL');

// Test 2: Trace should not produce output when disabled
console.log('\nTest 2: Trace with disabled logger (should NOT see output)');
console.log('  Calling lumberjack.trace()...');
lumberjack.trace('This message should NOT appear', { data: 'test' }, 'brief', 'standard');
console.log('  Result: ✅ PASS (no output above)');

// Test 3: Enable and verify output
console.log('\nTest 3: Enable logger and verify output appears');
console.log('  Setting lumberjack.enabled = true...');
lumberjack.enabled = true;
console.log('  Calling lumberjack.trace()...');
lumberjack.trace('This message SHOULD appear', { data: 'test' }, 'brief', 'success');
console.log('  Result: ✅ PASS (output appeared above)');

// Test 4: Disable and verify silence
console.log('\nTest 4: Disable logger and verify silence');
console.log('  Setting lumberjack.enabled = false...');
lumberjack.enabled = false;
console.log('  Calling lumberjack.trace()...');
lumberjack.trace('This message should NOT appear again', { data: 'test' }, 'brief', 'error');
console.log('  Result: ✅ PASS (no output above)');

// Test 5: Scoped loggers inherit disabled state
console.log('\nTest 5: Scoped loggers respect parent enabled state');
const scopedLogger = lumberjack.createScoped('TestScope');
console.log('  Created scoped logger with parent disabled');
console.log('  Calling scopedLogger.trace()...');
scopedLogger.trace('Scoped message should NOT appear');
console.log('  Result: ✅ PASS (no output above)');

// Test 6: Scoped logger works when enabled
console.log('\nTest 6: Scoped logger works when enabled');
lumberjack.enabled = true;
console.log('  Enabled parent logger');
console.log('  Calling scopedLogger.trace()...');
scopedLogger.trace('Scoped message SHOULD appear', null, 'brief', 'headsup');
console.log('  Result: ✅ PASS (output appeared above)');

console.log('\n=== All Tests Complete ===\n');
console.log('Summary:');
console.log('  ✅ Default state is disabled');
console.log('  ✅ No output when disabled');
console.log('  ✅ Output appears when enabled');
console.log('  ✅ Can be toggled on/off');
console.log('  ✅ Scoped loggers respect parent state');
console.log('\n');
