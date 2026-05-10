/**
 * ---
 * aix:
 *   id: frontend.test.logger.script-outline-test
 *   role: Test module: test/logger/script-outline.test.js
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
 * Test Script Outline Logger Functionality
 *
 * Tests the new showScriptOutline method that displays planned script execution sequences
 * for transparency in build processes.
 */

import logger, { LumberjackStyle } from "@datainkio/lumberjack";

// Enable logger for testing
logger.enabled = true;

console.log("\n=== Testing Script Outline Logger ===\n");

// Test 1: Basic script outline
console.log("Test 1: Basic Build Process Outline (brief mode)");
const basicBuildSequence = [
  {
    name: "clean",
    description: "Clear build directory preserving content cache",
    script: "clearSiteFolder.js",
  },
  {
    name: "sync:content",
    description: "Sync cached content to build directory",
    script: "syncContent.js",
  },
  {
    name: "build:design",
    description: "Fetch design tokens from Figma API",
    script: "fetchFigma.js",
    triggers: ["buildCSS.js"],
  },
  {
    name: "build:css",
    description: "Compile Tailwind CSS with comprehensive logging",
    script: "buildCSS.js",
  },
  {
    name: "build:11ty",
    description: "Generate static site from Nunjucks templates",
    script: "eleventy --quiet",
  },
];

logger.showScriptOutline("Full Build Process", basicBuildSequence, "brief");

// Test 2: Verbose script outline with dependencies
console.log("\nTest 2: Development Workflow Outline (verbose mode)");
const devWorkflowSequence = [
  {
    name: "dev:css",
    description: "Start Tailwind CSS watch mode for hot reloading",
    script: "buildCSS.js --watch",
    dependencies: ["tailwind.config.js", "styles/main.css"],
  },
  {
    name: "dev:11ty",
    description: "Start 11ty development server with live reload",
    script: "eleventy --serve --quiet",
    dependencies: ["Sanity content", "CSS compilation"],
  },
];

logger.showScriptOutline(
  "Development Workflow",
  devWorkflowSequence,
  "verbose",
);

// Test 3: Custom styling
console.log("\nTest 3: Design System Sync (custom styling)");
const designSyncSequence = [
  {
    name: "fetch-figma",
    description: "Download design tokens from Figma",
    script: "fetchFigma.js",
  },
  {
    name: "process-colors",
    description: "Generate CSS custom properties from color tokens",
    script: "PaletteService.js",
    triggers: ["CSS rebuild"],
  },
  {
    name: "process-typography",
    description: "Generate font family utilities from text styles",
    script: "TypographyService.js",
    triggers: ["CSS rebuild"],
  },
];

const customStyle = new LumberjackStyle("#9333EA", "🎨");
logger.showScriptOutline(
  "Design System Sync",
  designSyncSequence,
  "verbose",
  customStyle,
);

// Test 4: Error handling - empty sequence
console.log("\nTest 4: Empty Script Sequence");
logger.showScriptOutline("Empty Process", [], "brief");

// Test 5: Complex build with multiple triggers
console.log("\nTest 5: Complex Production Build");
const productionSequence = [
  {
    name: "clean",
    description: "Remove all build artifacts",
    script: "clearSiteFolder.js",
  },
  {
    name: "env-check",
    description: "Validate environment variables and API tokens",
    dependencies: ["FIGMA_TOKEN", "SANITY_TOKEN"],
  },
  {
    name: "content-sync",
    description: "Force refresh all content from Sanity",
    script: "syncContent.js",
    triggers: ["Image processing", "Cache invalidation"],
  },
  {
    name: "design-sync",
    description: "Sync latest design tokens from Figma",
    script: "fetchFigma.js",
    triggers: ["CSS rebuild", "Design token cache update"],
  },
  {
    name: "build-static",
    description: "Generate optimized static site",
    script: "eleventy --quiet",
    dependencies: ["Fresh content", "Current design tokens", "Compiled CSS"],
  },
];

logger.showScriptOutline(
  "Production Build",
  productionSequence,
  "verbose",
  "success",
);

console.log("\n=== Script Outline Tests Complete ===\n");
