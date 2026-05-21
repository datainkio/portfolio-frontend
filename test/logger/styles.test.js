/**
 * ---
 * aix:
 *   id: frontend.test.logger.styles-test
 *   role: Test module: test/logger/styles.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/55
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - logger
 * ---
 */
/** @format */

import logger from "@datainkio/lumberjack";

// Enable logger
logger.enabled = true;

console.log("\n🧪 Testing Logger Styles with Prefixes\n");

// Test all four styles
logger.trace(
  "Standard style test:",
  { type: "info", value: "default informational message" },
  "brief",
  "standard",
);
logger.trace(
  "Heads up style test:",
  { type: "attention", value: "important message" },
  "brief",
  "headsup",
);
logger.trace(
  "Error style test:",
  { type: "failure", value: "something went wrong" },
  "brief",
  "error",
);
logger.trace(
  "Success style test:",
  { type: "completion", value: "operation completed" },
  "brief",
  "success",
);

console.log("\n🧪 Testing with default style (should be standard)\n");

// Test default parameter (should use 'standard')
logger.trace(
  "Default style test:",
  { message: "no style parameter provided" },
  "brief",
);

console.log("\n🧪 Testing verbose mode with different styles\n");

// Test verbose mode with different styles
const testData = {
  id: 123,
  name: "Test Object",
  nested: {
    prop1: "value1",
    prop2: 42,
  },
};

logger.trace("Verbose standard:", testData, "verbose", "standard");
logger.trace("Verbose success:", testData, "verbose", "success");

console.log("\n🧪 Testing indentation levels\n");

// Test indentation
logger.trace("Top level message", "No indentation", "brief", "headsup");

logger.indent();
logger.trace("Level 1 message", "One level deep", "brief", "standard");

logger.indent();
logger.trace("Level 2 message", "Two levels deep", "brief", "standard");
logger.trace(
  "Level 2 verbose:",
  { nested: "data", value: 42 },
  "verbose",
  "standard",
);

logger.outdent();
logger.trace("Back to level 1", "Outdented once", "brief", "standard");

logger.resetIndent();
logger.trace("Reset to top level", "No indentation again", "brief", "success");

console.log("\n🧪 Testing group method\n");

// Test group method
logger.trace(
  "Starting grouped operation",
  "Using async group",
  "brief",
  "headsup",
);
await logger.group(async () => {
  logger.trace("Inside group level 1", "Auto-indented", "brief", "standard");
  await logger.group(async () => {
    logger.trace("Inside group level 2", "Nested group", "brief", "standard");
  });
  logger.trace("Back to level 1", "After nested group", "brief", "standard");
});
logger.trace("Group complete", "Back to top level", "brief", "success");

console.log("\n✅ Logger style tests complete\n");
