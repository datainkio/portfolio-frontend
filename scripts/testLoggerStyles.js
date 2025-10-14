/** @format */

import logger from '../js/utils/logger/index.js';

// Enable logger
logger.enabled = true;

console.log('\n🧪 Testing Logger Styles with Icons\n');

// Test all four styles
logger.trace(
  'Standard style test:',
  { type: 'info', value: 'default informational message' },
  'brief',
  'standard'
);
logger.trace(
  'Heads up style test:',
  { type: 'attention', value: 'important message' },
  'brief',
  'headsup'
);
logger.trace(
  'Error style test:',
  { type: 'failure', value: 'something went wrong' },
  'brief',
  'error'
);
logger.trace(
  'Success style test:',
  { type: 'completion', value: 'operation completed' },
  'brief',
  'success'
);

console.log('\n🧪 Testing with default style (should be standard)\n');

// Test default parameter (should use 'standard')
logger.trace('Default style test:', { message: 'no style parameter provided' }, 'brief');

console.log('\n🧪 Testing verbose mode with different styles\n');

// Test verbose mode with different styles
const testData = {
  id: 123,
  name: 'Test Object',
  nested: {
    prop1: 'value1',
    prop2: 42,
  },
};

logger.trace('Verbose standard:', testData, 'verbose', 'standard');
logger.trace('Verbose success:', testData, 'verbose', 'success');

console.log('\n✅ Logger style tests complete\n');
