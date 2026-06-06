#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.scripts.exportdiagrams
 *   role: Build/utility script: scripts/exportDiagrams.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - exportDiagrams.js
 * ---
 */
/**
 * Export Mermaid diagrams to SVG
 *
 * Finds all .mmd files in the project and exports them to SVG format
 * in the same directory as the source file with proper font embedding.
 *
 * Usage:
 *   node scripts/exportDiagrams.js           # Export all diagrams
 *   node scripts/exportDiagrams.js --dir js  # Export only from js/ directory
 */

import { glob } from "glob";
import { execSync } from "child_process";
import { basename, dirname, join } from "path";
import chalk from "chalk";

// Parse command line arguments
const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const targetDir = dirIndex !== -1 ? args[dirIndex + 1] : null;

// Build search pattern based on target directory
const PATTERN = targetDir ? `${targetDir}/**/*.mmd` : "**/*.mmd";
const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/_site/**",
  "**/dist/**",
  "**/build/**",
];

console.log(chalk.blue("🔍 Finding Mermaid diagram files...\n"));
if (targetDir) {
  console.log(chalk.cyan(`   Searching in: ${targetDir}\n`));
}

// Find all .mmd files
const files = glob.sync(PATTERN, { ignore: EXCLUDE_PATTERNS });

if (files.length === 0) {
  console.log(chalk.yellow("⚠️  No .mmd files found"));
  process.exit(0);
}

console.log(chalk.green(`✓ Found ${files.length} diagram file(s)\n`));

let successCount = 0;
let errorCount = 0;

// Export each file to its own directory
files.forEach((inputFile, index) => {
  const dir = dirname(inputFile);
  const filename = basename(inputFile, ".mmd");
  const outputFile = join(dir, `${filename}.svg`);

  try {
    console.log(
      chalk.cyan(`  [${index + 1}/${files.length}] Converting: ${inputFile}`),
    );

    // Use mmdc with white background and proper cleanup
    execSync(`npx mmdc -i "${inputFile}" -o "${outputFile}" -b white`, {
      stdio: "pipe",
      timeout: 30000, // 30 second timeout per file
      windowsHide: true,
    });

    console.log(chalk.green(`  ✓ Exported: ${outputFile}\n`));
    successCount++;
  } catch (error) {
    console.error(chalk.red(`  ✗ Failed: ${inputFile}`));
    if (error.killed) {
      console.error(
        chalk.red(`    Timeout: Process killed after 30 seconds\n`),
      );
    } else {
      console.error(chalk.red(`    ${error.message}\n`));
    }
    errorCount++;
  }
});

// Summary
console.log(chalk.bold("\n" + "=".repeat(50)));
console.log(chalk.bold("Export Summary:"));
console.log(chalk.green(`✓ Success: ${successCount}`));
if (errorCount > 0) {
  console.log(chalk.red(`✗ Failed: ${errorCount}`));
}
console.log(chalk.bold("=".repeat(50) + "\n"));

process.exit(errorCount > 0 ? 1 : 0);
