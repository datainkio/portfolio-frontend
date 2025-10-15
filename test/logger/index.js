/** @format */

/**
 * Logger Test Suite Runner
 *
 * Runs all Logger tests in sequence to verify functionality.
 * Each test is run independently to ensure clean state.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tests = [
  { name: 'Styles & Icons', file: 'styles.test.js' },
  { name: 'Error Handling', file: 'errors.test.js' },
  { name: 'Optional Parameters', file: 'optional-parameter.test.js' },
  { name: 'Error Auto-Detection', file: 'error-detection.test.js' },
  { name: 'Real-World Scenarios', file: 'real-world.test.js' },
  { name: 'Custom Styles', file: 'custom-styles.test.js' },
];

console.log('\n╔════════════════════════════════════════╗');
console.log('║     Logger Test Suite Runner          ║');
console.log('╚════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

for (const test of tests) {
  const testPath = join(__dirname, test.file);

  console.log(`\n▶ Running: ${test.name}`);
  console.log('─'.repeat(50));

  try {
    execSync(`DEBUG=true node ${testPath}`, {
      stdio: 'inherit',
      cwd: join(__dirname, '../../'),
    });
    console.log(`\n✅ ${test.name} - PASSED`);
    passed++;
  } catch (error) {
    console.error(`\n❌ ${test.name} - FAILED`);
    failed++;
  }
}

console.log('\n' + '═'.repeat(50));
console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
console.log('\n' + '═'.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
