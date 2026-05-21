#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.test.logger.enhancements-test
 *   role: Test module: test/logger/enhancements.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/47
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

/**
 * Test Logger Enhancements
 *
 * Tests the new configuration flexibility and scoped logging capabilities
 * while maintaining singleton benefits.
 */

import lumberjack from "@datainkio/lumberjack";

console.log("=== Testing Logger Enhancements ===\n");

// Test 1: Basic functionality (should work as before)
Logger.enabled = true;
Logger.trace("✅ Basic Logger functionality working");

// Test 2: Configuration method
console.log("\n--- Test 2: Logger Configuration ---");
Logger.configure({
  enabled: true,
  prefix: "[BUILD]",
});

Logger.trace(
  "Configuration test message",
  { status: "configured" },
  "brief",
  "headsup",
);

// Test 3: Scoped loggers
console.log("\n--- Test 3: Scoped Loggers ---");

const tailwindLogger = Logger.createScoped("Tailwind");
const figmaLogger = Logger.createScoped("Figma", { prefix: "🎨" });
const navigationLogger = Logger.createScoped("Navigation");

tailwindLogger.trace("CSS compilation started", { mode: "watch" });
figmaLogger.trace("Design tokens fetched", { tokens: 42 });
navigationLogger.trace(
  "Building navigation structure",
  null,
  "brief",
  "success",
);

// Test 4: Scoped operations
console.log("\n--- Test 4: Scoped Group Operations ---");
await tailwindLogger.group(async () => {
  tailwindLogger.trace("Analyzing configuration");
  tailwindLogger.indent();
  tailwindLogger.trace("Content paths found: 3");
  tailwindLogger.trace("Plugins detected: 1");
  tailwindLogger.outdent();
  tailwindLogger.trace("Configuration analysis complete");
});

// Test 5: Script outlines with scopes
console.log("\n--- Test 5: Scoped Script Outlines ---");
const buildLogger = Logger.createScoped("BuildProcess");
buildLogger.showScriptOutline("CSS Build Pipeline", [
  { name: "config-analysis", description: "Analyze Tailwind configuration" },
  { name: "compilation", description: "Compile CSS with Tailwind CLI" },
  { name: "optimization", description: "Minimize and optimize output" },
]);

// Test 6: Configuration changes at runtime
console.log("\n--- Test 6: Runtime Configuration Changes ---");
Logger.configure({
  prefix: "[UPDATED]",
});

Logger.trace("Message with updated configuration");

// Test 7: Verify singleton behavior is maintained
console.log("\n--- Test 7: Singleton Behavior Verification ---");
const logger1 = Logger.createScoped("Test1");
const logger2 = Logger.createScoped("Test2");

logger1.trace("Setting enabled to false from scoped logger");
logger1.enabled = false;

Logger.trace("This should not appear (disabled via scoped logger)");
logger2.trace("This should also not appear (same singleton instance)");

// Re-enable for final message
Logger.enabled = true;
Logger.configure({ prefix: "" }); // Clear prefix
Logger.trace(
  "✅ All Logger enhancement tests completed successfully!",
  null,
  "brief",
  "success",
);

console.log("\n=== Logger Enhancement Tests Complete ===");
