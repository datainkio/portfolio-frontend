/**
 * ---
 * aix:
 *   id: frontend.test.airtable-styles-preview
 *   role: Test module: test/airtable-styles-preview.js
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - airtable-styles-preview.js
 * ---
 */
/** @format */

/**
 * Visual Test for Airtable Custom Logger Styles
 *
 * Simulates the visual output you'll see during Airtable data fetching
 */

import logger, { LumberjackStyle } from '@datainkio/lumberjack';

logger.enabled = true;

// Recreate the custom styles from fetchAirtableData.js
const airtableStyle = new LumberjackStyle('#F97316', '🗄️');
const cachingStyle = new LumberjackStyle('#8B5CF6', '💾');
const processingStyle = new LumberjackStyle('#06B6D4', '⚙️');

console.log('\n=== Airtable Logger Styles Preview ===\n');

// Simulate cache hit scenario
console.log('Scenario 1: Cache Hit\n');
logger.trace('Using cached data:', { table: 'Projects' }, 'brief', cachingStyle);

// Simulate force refresh scenario
console.log('\nScenario 2: Force Refresh\n');
logger.trace(
  'Force refreshing table:',
  { table: 'Projects', reason: 'FORCE_REFRESH=true' },
  'brief',
  airtableStyle
);

// Simulate normal refresh scenario
console.log('\nScenario 3: Cache Expired\n');
logger.trace('Cache expired, refreshing:', { table: 'BlogPosts' }, 'brief', airtableStyle);

// Simulate processing records
console.log('\nScenario 4: Processing Records\n');
await logger.group(async () => {
  logger.trace(
    'Force refreshing table:',
    { table: 'Projects', reason: 'Cache expired' },
    'brief',
    airtableStyle
  );

  logger.indent();
  logger.trace('Processing records:', { table: 'Projects', count: 10 }, 'brief', processingStyle);
  logger.trace('Processing records:', { table: 'Projects', count: 20 }, 'brief', processingStyle);
  logger.trace('Processing records:', { table: 'Projects', count: 30 }, 'brief', processingStyle);
  logger.outdent();

  logger.trace(
    'Data cached successfully:',
    { table: 'Projects', records: 30 },
    'brief',
    cachingStyle
  );
});

// Simulate error scenario
console.log('\nScenario 5: Error Handling\n');
try {
  throw new Error('Failed to connect to Airtable API');
} catch (err) {
  logger.trace('Airtable fetch error:', err, 'brief'); // Auto-detects error style
}

// Show all styles together
console.log('\nScenario 6: Complete Fetch Cycle\n');
await logger.group(async () => {
  logger.trace('Cache expired, refreshing:', { table: 'Work' }, 'brief', airtableStyle);

  logger.indent();
  logger.trace('Processing records:', { table: 'Work', count: 5 }, 'brief', processingStyle);
  logger.trace('Processing records:', { table: 'Work', count: 10 }, 'brief', processingStyle);
  logger.trace('Could not build slug:', { recordId: 'rec123', table: 'Work' }, 'brief', 'error');
  logger.trace('Processing records:', { table: 'Work', count: 15 }, 'brief', processingStyle);
  logger.outdent();

  logger.trace('Data cached successfully:', { table: 'Work', records: 15 }, 'brief', cachingStyle);
});

console.log('\n=== Style Preview Complete ===\n');

console.log('Color Reference:');
console.log('  🗄️  Orange (#F97316) - Airtable database operations');
console.log('  💾 Purple (#8B5CF6) - Cache operations');
console.log('  ⚙️  Cyan (#06B6D4) - Processing operations');
console.log('  ❌ Red (built-in) - Errors (auto-detected)');
console.log('');
