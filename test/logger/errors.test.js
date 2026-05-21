/**
 * ---
 * aix:
 *   id: frontend.test.logger.errors-test
 *   role: Test module: test/logger/errors.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/49
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

logger.enabled = true;

console.log("\n=== Testing Logger Error Handling ===\n");

// Create test errors
const simpleError = new Error("Something went wrong");
const customError = new TypeError("Invalid type provided");

// Test brief mode with error (should show just the message)
logger.trace("Brief error test:", simpleError, "brief", "error");

// Test verbose mode with error (should show name, message, and stack)
logger.trace("Verbose error test:", simpleError, "verbose", "error");

// Test with custom error type
logger.trace("Custom error type:", customError, "verbose", "error");

// Test in a group context
console.log("\n🧪 Testing errors in group context\n");

await logger.group(async () => {
  try {
    logger.trace(
      "Starting risky operation:",
      "About to fail...",
      "brief",
      "headsup",
    );
    throw new Error("Operation failed: Database connection timeout");
  } catch (err) {
    logger.trace("Caught error (brief):", err, "brief", "error");
    logger.trace("Caught error (verbose):", err, "verbose", "error");
  }
});

console.log("\n✅ Error handling tests complete");
