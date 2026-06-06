/**
 * ---
 * aix:
 *   id: frontend.scripts.inittailwind
 *   role: Build/utility script: scripts/initTailwind.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - initTailwind.js
 * ---
 */
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

export function initializeTailwind() {
  console.log(chalk.blue.bold("\n⚡  Initializing Tailwind v4..."));
  console.log(chalk.gray("─".repeat(50)));

  const INPUT = "tailwind/styles.css";
  const OUTPUT = "_site/assets/styles.css";

  // Check if input file exists
  if (!fs.existsSync(INPUT)) {
    console.error(chalk.red(`Tailwind input file not found: ${INPUT}`));
    process.exit(1);
  }

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(chalk.blue("    input: "), chalk.gray(INPUT));
  console.log(chalk.blue("    output: "), chalk.gray(OUTPUT));

  const { status } = spawnSync(
    "npx",
    ["tailwindcss", "-i", INPUT, "-o", OUTPUT, "--watch"],
    { shell: true, stdio: "inherit" },
  );

  console.log(chalk.gray("─".repeat(50)) + "\n");

  if (status !== 0) {
    console.error(
      chalk.red(`Tailwind build process exited with code ${status}`),
    );
    process.exit(1);
  }

  // Check if output file was created
  if (!fs.existsSync(OUTPUT)) {
    console.error(chalk.red(`Output file was not created: ${OUTPUT}`));
    process.exit(1);
  }

  console.log(chalk.blue("✓ Tailwind v4 built successfully"));
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeTailwind();
}
