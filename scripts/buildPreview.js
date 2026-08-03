#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.scripts.buildpreview
 *   role: Build/utility script: scripts/buildPreview.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - buildPreview.js
 * ---
 */
/** @format */

/**
 * Build Process Overview Script
 *
 * CRITICAL WARNING: This script provides a comprehensive overview of the entire
 * build process before execution. Use this to understand the complete script
 * execution sequence and dependencies before running production builds.
 *
 * USAGE:
 * - npm run build:preview - Show full build process outline
 * - node scripts/buildPreview.js --verbose - Show detailed workflow
 * - node scripts/buildPreview.js --dev - Show development workflow
 *
 * ARCHITECTURE INTEGRATION:
 * This script uses the Logger.showScriptOutline() method to provide transparency
 * into build process execution order, matching the logging standards used
 * throughout the project.
 */

import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import logger from "@datainkio/lumberjack";

// Enable logger for preview
logger.enabled = true;

// Get command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes("--verbose");
const isDev = args.includes("--dev");

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

/**
 * Display full production build process outline
 */
function showProductionBuild() {
  const productionSequence = [
    {
      name: "clean",
      description: "Clear build directory preserving content cache",
      script: "clearSiteFolder.js",
      dependencies: ["Node.js fs permissions"],
    },
    {
      name: "build:design",
      description: "Fetch design tokens from Figma API",
      script: "fetchFigma.js",
      dependencies: ["FIGMA_TOKEN", "Network access"],
      triggers: ["CSS token updates", "buildCSS.js execution"],
    },
    {
      name: "build:css",
      description: "Compile Tailwind CSS with comprehensive logging",
      script: "buildCSS.js --minify",
      dependencies: ["Design tokens", "tailwind.config.js", "styles/main.css"],
      triggers: ["_site/assets/styles.css generation"],
    },
    {
      name: "build:11ty",
      description: "Generate static site from Nunjucks templates",
      script: "eleventy --quiet",
      dependencies: ["CMS content", "Compiled CSS"],
      triggers: [
        "Static HTML generation",
        "Asset copying",
        "Site deployment readiness",
      ],
    },
  ];

  logger.showScriptOutline(
    "Production Build Process",
    productionSequence,
    isVerbose ? "verbose" : "brief",
  );
}

/**
 * Display development workflow outline
 */
function showDevelopmentWorkflow() {
  const devSequence = [
    {
      name: "dev:css",
      description: "Start Tailwind CSS watch mode for hot reloading",
      script: "buildCSS.js --watch",
      dependencies: ["tailwind.config.js", "styles/main.css"],
      triggers: ["CSS hot reloading", "Browser refresh"],
    },
    {
      name: "dev:11ty",
      description: "Start 11ty development server with live reload",
      script: "eleventy --serve --quiet",
      dependencies: ["CMS content", "CSS compilation"],
      triggers: ["HTTP server on localhost:8080", "Template hot reloading"],
    },
  ];

  logger.showScriptOutline(
    "Development Workflow",
    devSequence,
    isVerbose ? "verbose" : "brief",
  );
}

/**
 * Display design system sync workflow
 */
function showDesignSystemSync() {
  const designSequence = [
    {
      name: "fetch-design-file",
      description: "Download design file data from Figma API",
      script: "figma/services/FileService.js",
      dependencies: ["FIGMA_TOKEN", "Figma file access"],
    },
    {
      name: "extract-styles",
      description: "Extract color and typography style definitions",
      script: "figma/services/StyleService.js",
      dependencies: ["Design file data"],
    },
    {
      name: "process-colors",
      description: "Generate CSS custom properties from color tokens",
      script: "figma/services/PaletteService.js",
      triggers: ["styles/colors.css update"],
    },
    {
      name: "process-typography",
      description: "Generate font family utilities from text styles",
      script: "figma/services/TypographyService.js",
      triggers: ["styles/typography/fontFamilies.css update"],
    },
    {
      name: "rebuild-css",
      description: "Compile CSS with updated design tokens",
      script: "scripts/buildCSS.js",
      triggers: ["_site/assets/styles.css regeneration"],
    },
  ];

  logger.showScriptOutline(
    "Design System Sync",
    designSequence,
    isVerbose ? "verbose" : "brief",
  );
}

/**
 * Main execution function
 */
function main() {
  console.log("\n🔍 BUILD PROCESS OVERVIEW");
  console.log("─".repeat(70));

  if (isDev) {
    showDevelopmentWorkflow();
  } else {
    showProductionBuild();

    if (isVerbose) {
      console.log("\n");
      showDesignSystemSync();
    }
  }

  // Show execution commands
  console.log("\n📋 AVAILABLE COMMANDS");
  console.log("─".repeat(70));
  logger.trace("Production build:", "npm run build", "brief", "standard");
  logger.trace("Development server:", "npm start", "brief", "standard");
  logger.trace(
    "Design sync only:",
    "npm run build:design",
    "brief",
    "standard",
  );
  logger.trace("CSS build only:", "npm run build:css", "brief", "standard");

  if (isVerbose) {
    console.log("\n🔧 DEBUG COMMANDS");
    console.log("─".repeat(70));
    logger.trace("Debug build:", "npm run build:debug", "brief", "standard");
    logger.trace("Force refresh:", "npm run build:force", "brief", "standard");
    logger.trace(
      "Design debug:",
      "npm run build:design:debug",
      "brief",
      "standard",
    );
  }

  console.log("\n");
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { showProductionBuild, showDevelopmentWorkflow, showDesignSystemSync };
