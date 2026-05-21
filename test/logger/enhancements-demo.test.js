#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.test.logger.enhancements-demo-test
 *   role: Test module: test/logger/enhancements-demo.test.js
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/46
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
 * Logger Enhancements Example
 *
 * Demonstrates the enhanced Logger capabilities for service integration
 * Shows best practices for using scoped loggers in your architecture
 */

import lumberjack from "@datainkio/lumberjack";

console.log("\n🚀 LOGGER ENHANCEMENTS DEMO");
console.log("─".repeat(60));

// Example 1: Service-specific loggers
console.log("\n1. SERVICE-SPECIFIC LOGGERS");
console.log("─".repeat(30));

const figmaService = Logger.createScoped("Figma", { prefix: "🎨" });
const sanityService = Logger.createScoped("Sanity", { prefix: "📊" });
const navigationService = Logger.createScoped("Navigation");

figmaService.trace("Fetching design tokens from API");
sanityService.trace("Syncing content from CMS", { tables: 15 });
navigationService.trace("Building primary navigation structure");

// Example 2: Build process coordination
console.log("\n2. BUILD PROCESS COORDINATION");
console.log("─".repeat(30));

const buildLogger = Logger.createScoped("BuildPipeline");
await buildLogger.group(async () => {
  buildLogger.trace("Starting production build");

  const designLogger = Logger.createScoped("Design");
  designLogger.trace("Processing Figma integration");

  const cssLogger = Logger.createScoped("CSS");
  cssLogger.trace("Compiling Tailwind CSS");

  buildLogger.trace("Build pipeline completed successfully");
});

// Example 3: Configuration flexibility
console.log("\n3. RUNTIME CONFIGURATION");
console.log("─".repeat(30));

// Configure global prefix
Logger.configure({ prefix: "[PROD]" });
Logger.trace("Global configuration applied");

// Service loggers inherit configuration but maintain scope
figmaService.trace("Design sync with production config");

// Example 4: Script outline with scopes
console.log("\n4. SCOPED SCRIPT OUTLINES");
console.log("─".repeat(30));

const deploymentLogger = Logger.createScoped("Deployment");
deploymentLogger.showScriptOutline("Production Deployment", [
  { name: "validate", description: "Validate build artifacts" },
  { name: "optimize", description: "Optimize assets for production" },
  { name: "deploy", description: "Deploy to CDN and update DNS" },
  { name: "verify", description: "Verify deployment health" },
]);

console.log("\n✅ Logger enhancements demo completed!");
console.log("\nBENEFITS:");
console.log("• Service isolation with consistent formatting");
console.log("• Runtime configuration flexibility");
console.log("• Maintained singleton benefits");
console.log("• Enhanced debugging capabilities");
console.log("• Better service coordination visibility");
