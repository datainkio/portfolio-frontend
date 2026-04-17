/**
 * ---
 * aix:
 *   id: frontend.test.lumberjack-dual-mode-test
 *   role: Test module: test/lumberjack-dual-mode.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/57
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - lumberjack-dual-mode.test.js
 * ---
 */
/**
 * Test Lumberjack dual-mode functionality
 * Tests both terminal (Node.js) and browser environments
 */

import lumberjack, { Lumberjack } from '@datainkio/lumberjack';

// Enable logging for tests
Lumberjack.configure({ enabled: true });

console.log('\n=== Testing Lumberjack Dual-Mode Support ===\n');

// Test 1: Basic trace with different styles
console.log('Test 1: Semantic Styles');
lumberjack.trace('Standard style', 'Default blue text', 'brief', 'standard');
lumberjack.trace('Heads up style', 'Important notice', 'brief', 'headsup');
lumberjack.trace('Success style', 'Operation completed', 'brief', 'success');
lumberjack.trace('Error style', 'Something went wrong', 'brief', 'error');

// Test 2: Error auto-detection
console.log('\nTest 2: Error Auto-Detection');
const testError = new Error('Test error message');
lumberjack.trace('Auto-detected error:', testError);

// Test 3: Brief vs verbose modes
console.log('\nTest 3: Display Modes');
const testObj = { name: 'John', age: 30, active: true };
lumberjack.trace('Brief mode:', testObj, 'brief', 'standard');
lumberjack.trace('Verbose mode:', testObj, 'verbose', 'standard');

// Test 4: Hierarchical logging
console.log('\nTest 4: Hierarchical Output');
await lumberjack.group(async () => {
  lumberjack.trace('Parent operation', 'Starting...', 'brief', 'headsup');
  lumberjack.indent();
  lumberjack.trace('Child operation 1', 'Processing...', 'brief', 'standard');
  lumberjack.trace('Child operation 2', 'Complete', 'brief', 'success');
  lumberjack.outdent();
});

// Test 5: Script outline
console.log('\nTest 5: Script Outline');
lumberjack.showScriptOutline('Build Process', [
  { name: 'Clean', description: 'Remove old files' },
  { name: 'Compile', description: 'Build assets' },
  { name: 'Deploy', description: 'Push to server' },
]);

console.log('\n=== All Tests Complete ===\n');
