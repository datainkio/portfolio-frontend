/**
 * ---
 * aix:
 *   id: frontend.scripts.buildcss
 *   role: Build/utility script: scripts/buildCSS.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - buildCSS.js
 * ---
 */
/**
 * Enhanced Tailwind CSS Build Script with Comprehensive Logging
 *
 * CRITICAL WARNING: This script provides detailed transparency into the
 * Tailwind CSS build process to match the logging standards used throughout
 * the project. DO NOT bypass this script for production builds - the logging
 * data is essential for debugging CSS generation issues and performance optimization.
 *
 * ARCHITECTURE OVERVIEW:
 * - Wraps Tailwind CLI with TailwindLogger service for transparency
 * - Provides same level of detail as 11ty collections and Figma services
 * - Tracks build performance, file sizes, and optimization opportunities
 * - Integrates with existing logger infrastructure for consistent output
 *
 * USAGE MODES:
 * - Production: npm run build:css (with minification and optimization analysis)
 * - Development: npm run build:css:dev (with detailed analysis, no minification)
 * - Watch: npm run watch:css (continuous building with file change monitoring)
 *
 * CRITICAL DEPENDENCIES:
 * - TailwindLogger service for build transparency
 * - Tailwind CSS 4.0 CLI (@tailwindcss/cli)
 * - Logger utility for consistent output styling
 * - Node.js child_process for CLI execution
 *
 * PERFORMANCE IMPACT:
 * - Adds ~10-20ms build time for comprehensive analysis
 * - Provides invaluable debugging information for CSS issues
 * - Memory optimized for large CSS output files
 *
 * INTEGRATION POINTS:
 * - Called by npm scripts for consistent build process
 * - Triggered by Figma design token sync for cache invalidation
 * - Monitored by development server for hot reloading
 *
 * @module scripts/buildCSS
 */
import { TailwindLogger } from "../eleventy/services/TailwindLogger.js";
import { execSync, spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import logger, { LumberjackStyle } from "@datainkio/lumberjack";

// Enable logger for build transparency
logger.enabled = true;

// Get directory paths for imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

/**
 * Custom Logger Styles for Build Script
 */
const scriptStyle = new LumberjackStyle("#7C3AED", "\n⚙️ ");
const errorStyle = new LumberjackStyle("#EF4444", "\n🚨 ");

/**
 * CRITICAL WARNING: Main CSS build function with comprehensive logging
 *
 * This function orchestrates the Tailwind CSS build process with detailed
 * transparency logging. It handles all build modes (production, development, watch)
 * and provides the same level of detail as other build processes in the project.
 *
 * BUILD PROCESS:
 * 1. Initialize TailwindLogger with build context
 * 2. Analyze input files and configuration
 * 3. Execute Tailwind CLI with appropriate flags
 * 4. Analyze output and provide performance metrics
 * 5. Log completion status with optimization suggestions
 *
 * ERROR HANDLING:
 * - Captures and logs detailed error information
 * - Provides actionable debugging suggestions
 * - Maintains build process transparency even on failure
 *
 * @param {Object} options - Build configuration options
 * @param {boolean} options.watch - Enable file watching mode
 * @param {boolean} options.minify - Enable CSS minification
 * @param {boolean} options.verbose - Enable verbose logging
 * @returns {Promise<Object>} Build result with metrics
 */
async function buildCSS(options = {}) {
  const {
    watch = false,
    minify = false,
    verbose = process.env.DEBUG === "true",
  } = options;

  // Initialize logger with options
  const tailwindLogger = new TailwindLogger({ verbose });

  // File paths
  const inputFile = resolve(projectRoot, "styles/main.css");
  const outputFile = resolve(projectRoot, "_site/assets/styles.css");
  const configFile = resolve(projectRoot, "tailwind.config.js");

  try {
    // Show script execution outline
    const buildWorkflow = [
      {
        name: "config-analysis",
        description: "Analyze Tailwind configuration and content paths",
        script: "TailwindLogger.logConfigAnalysis()",
      },
      {
        name: "input-analysis",
        description: "Parse CSS imports, layers, and custom properties",
        script: "TailwindLogger.logFileAnalysis()",
      },
      {
        name: "css-compilation",
        description: `Compile CSS with Tailwind CLI${minify ? " (minified)" : ""}${watch ? " (watch mode)" : ""}`,
        script: "@tailwindcss/cli",
        dependencies: ["tailwind.config.js", "styles/main.css"],
      },
      {
        name: "output-analysis",
        description: "Analyze generated CSS for size and performance metrics",
        script: "TailwindLogger.logOutputAnalysis()",
      },
      {
        name: "performance-review",
        description: "Provide optimization suggestions and build metrics",
        script: "TailwindLogger.completeBuild()",
      },
    ];

    const operationName = watch
      ? "Tailwind CSS Watch Mode"
      : "Tailwind CSS Build";
    logger.showScriptOutline(operationName, buildWorkflow, "brief");

    // Initialize build logging
    tailwindLogger.startBuild(inputFile, outputFile, { watch, minify });

    // Analyze configuration and input files
    await tailwindLogger.logConfigAnalysis(configFile);
    tailwindLogger.logFileAnalysis(inputFile);

    // Build Tailwind command
    let command = `npx @tailwindcss/cli -i ${inputFile} -o ${outputFile}`;
    if (minify) command += " --minify";
    if (watch) command += " --watch=always";

    logger.trace(`Executing: ${command}`, null, "brief", scriptStyle);

    if (watch) {
      // Watch mode: use spawn for continuous process
      return await runWatchMode(command, tailwindLogger, outputFile);
    } else {
      // Single build: use execSync for immediate execution
      return await runSingleBuild(command, tailwindLogger, outputFile);
    }
  } catch (error) {
    tailwindLogger.logError(error, "build script");
    tailwindLogger.completeBuild(false);

    // Log additional context for build failures
    logger.trace(
      null,
      "Build script failed. Common causes: missing dependencies, invalid CSS syntax, configuration errors, or file permission issues. Check the error details above for specific resolution steps.",
      "brief",
      "standard",
    );

    throw error; // Re-throw to ensure proper exit codes
  }
}

/**
 * Execute single build with comprehensive analysis
 *
 * @param {string} command - Tailwind CLI command to execute
 * @param {TailwindLogger} tailwindLogger - Logger instance
 * @param {string} outputFile - Path to generated CSS file
 * @returns {Promise<Object>} Build result
 */
async function runSingleBuild(command, tailwindLogger, outputFile) {
  try {
    const result = execSync(command, {
      encoding: "utf-8",
      cwd: projectRoot,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Analyze output after successful build
    tailwindLogger.logOutputAnalysis(outputFile);

    // Parse Tailwind CLI output for additional metrics
    const metrics = parseTailwindOutput(result);
    tailwindLogger.completeBuild(true, metrics);

    return {
      success: true,
      summary:
        typeof tailwindLogger.getBuildSummary === "function"
          ? tailwindLogger.getBuildSummary()
          : null,
      output: result,
    };
  } catch (error) {
    // Parse error output for specific issues
    const errorOutput = error.stderr || error.stdout || error.message;

    // Filter out normal Tailwind messages that might appear in error streams
    const isActualError =
      errorOutput &&
      !errorOutput.includes("tailwindcss v") &&
      !errorOutput.includes("Done in") &&
      !errorOutput.includes("Build finished") &&
      errorOutput.trim().length > 0;

    if (isActualError) {
      tailwindLogger.logError(new Error(errorOutput), "Tailwind CLI");
    }

    return {
      success: false,
      error: isActualError
        ? errorOutput
        : "Build failed - check logs for details",
      summary:
        typeof tailwindLogger.getBuildSummary === "function"
          ? tailwindLogger.getBuildSummary()
          : null,
    };
  }
}

/**
 * Execute watch mode with ongoing file monitoring
 *
 * @param {string} command - Tailwind CLI command to execute
 * @param {TailwindLogger} tailwindLogger - Logger instance
 * @param {string} outputFile - Path to generated CSS file
 * @returns {Promise<Object>} Watch process result
 */
async function runWatchMode(command, tailwindLogger, outputFile) {
  return new Promise((resolve, reject) => {
    logger.trace(
      "Starting CSS watch mode - press Ctrl+C to stop",
      null,
      "brief",
      scriptStyle,
    );

    const [cmd, ...args] = command.split(" ");
    let buildCount = 0;
    let childProcess = null;
    let isShuttingDown = false;

    const cleanup = () => {
      process.off("SIGINT", handleSigInt);
      process.off("SIGTERM", handleSigTerm);
    };

    const finalizeSuccess = () => {
      cleanup();
      resolve({
        success: true,
        buildCount,
        summary:
          typeof tailwindLogger.getBuildSummary === "function"
            ? tailwindLogger.getBuildSummary()
            : null,
      });
    };

    const finalizeError = (error) => {
      cleanup();
      reject(error);
    };

    const startWatcher = () => {
      childProcess = spawn(cmd, args, {
        cwd: projectRoot,
        stdio: ["pipe", "pipe", "pipe"],
      });

      childProcess.stdout.on("data", (data) => {
        const output = data.toString();

        // Detect successful builds in watch mode
        if (output.includes("Done in") || output.includes("Build finished")) {
          buildCount++;
          logger.trace(
            `Watch rebuild #${buildCount} completed`,
            null,
            "brief",
            scriptStyle,
          );

          // Analyze output periodically (every 5th build to avoid spam)
          if (buildCount % 5 === 0) {
            tailwindLogger.logOutputAnalysis(outputFile);
          }
        }

        // Forward Tailwind output with our styling
        if (output.trim()) {
          logger.trace(output.trim(), null, "brief");
        }
      });

      childProcess.stderr.on("data", (data) => {
        const output = data.toString().trim();

        // Filter out normal Tailwind status messages that go to stderr
        const isNormalMessage =
          output.includes("tailwindcss v") || // Version info
          output.includes("Done in") || // Build completion
          output.includes("Build finished") || // Build status
          output.includes("Watching for changes") || // Watch status
          output.match(/^\s*$/) || // Empty lines
          output.includes("Ready in"); // Ready status

        if (isNormalMessage) {
          // Log as normal output, not error
          if (output.trim()) {
            logger.trace(output, null, "brief");
          }
          return;
        }

        // Only log actual errors
        tailwindLogger.logError(new Error(output), "watch mode");
      });

      childProcess.on("close", (code) => {
        if (isShuttingDown) {
          logger.trace("CSS watch mode stopped", null, "brief", scriptStyle);
          finalizeSuccess();
          return;
        }

        if (code === 0) {
          logger.trace("CSS watch mode stopped", null, "brief", scriptStyle);
          finalizeSuccess();
        } else {
          finalizeError(new Error(`Watch process exited with code ${code}`));
        }
      });
    };

    const handleSigInt = () => {
      if (isShuttingDown) return;

      isShuttingDown = true;
      logger.trace("Stopping CSS watch mode...", null, "brief", scriptStyle);

      if (childProcess && !childProcess.killed) {
        childProcess.kill("SIGTERM");
      }
    };

    const handleSigTerm = () => {
      if (isShuttingDown) return;

      isShuttingDown = true;
      if (childProcess && !childProcess.killed) {
        childProcess.kill("SIGTERM");
      }
    };

    process.on("SIGINT", handleSigInt);
    process.on("SIGTERM", handleSigTerm);

    startWatcher();
  });
}

/**
 * Parse Tailwind CLI output for build metrics
 *
 * @param {string} output - Raw Tailwind CLI output
 * @returns {Object} Parsed metrics
 */
function parseTailwindOutput(output) {
  const metrics = {};

  // Extract duration from output like "Done in 123ms"
  const durationMatch = output.match(/Done in (\d+(?:\.\d+)?)(ms|s)/);
  if (durationMatch) {
    const duration = parseFloat(durationMatch[1]);
    const unit = durationMatch[2];
    metrics.duration = unit === "s" ? duration * 1000 : duration;
  }

  // Extract warnings count
  const warningMatches = output.match(/(\d+) warnings?/);
  if (warningMatches) {
    metrics.warnings = parseInt(warningMatches[1]);
  }

  // Extract size information if available
  const sizeMatch = output.match(/(\d+(?:\.\d+)?)\s*(KB|MB)/);
  if (sizeMatch) {
    const size = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2];
    metrics.outputSize = unit === "MB" ? size * 1024 : size;
  }

  return metrics;
}

/**
 * Command line interface for build script
 */
async function main() {
  const args = process.argv.slice(2);

  const options = {
    watch: args.includes("--watch"),
    minify: args.includes("--minify"),
    verbose: args.includes("--verbose") || process.env.DEBUG === "true",
  };

  try {
    const result = await buildCSS(options);

    if (!result.success) {
      process.exit(1);
    }

    // Log final summary for integration with other build tools
    if (options.verbose) {
      logger.trace(
        "Build summary:",
        JSON.stringify(result.summary, null, 2),
        "verbose",
        scriptStyle,
      );
    }
  } catch (error) {
    logger.trace(
      `Build script error: ${error.message}`,
      null,
      "brief",
      errorStyle,
    );
    process.exit(1);
  }
}

// Export for programmatic use
export { buildCSS };

// Run as CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
