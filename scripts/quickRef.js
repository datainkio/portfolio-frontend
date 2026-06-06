#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.scripts.quickref
 *   role: Build/utility script: scripts/quickRef.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - quickRef.js
 * ---
 */
/** @format */

/**
 * Quick Reference Script
 *
 * Provides fast access to the most commonly used commands
 * organized by development scenarios.
 */

import chalk from "chalk";

console.log(chalk.cyan.bold("\n⚡ QUICK REFERENCE"));
console.log(chalk.gray("─".repeat(40)));

console.log(chalk.green.bold("\n🚀 Getting Started"));
console.log(
  chalk.yellow("npm run setup") +
    chalk.gray("     - Validate environment & system health"),
);
console.log(
  chalk.yellow("npm start") + chalk.gray("         - Start development server"),
);

console.log(chalk.green.bold("\n🎨 Design Updates"));
console.log(
  chalk.yellow("npm run design") +
    chalk.gray("     - Sync Figma tokens + rebuild CSS"),
);
console.log(
  chalk.yellow("npm run dev:css") + chalk.gray("    - Watch CSS compilation"),
);

console.log(chalk.green.bold("\n📝 Content Updates"));
console.log(
  chalk.yellow("npm run build:11ty") +
    chalk.gray("         - Regenerate pages (CMS fetch)"),
);

console.log(chalk.green.bold("\n🏗️ Build & Deploy"));
console.log(
  chalk.yellow("npm run fresh") + chalk.gray("       - Complete fresh build"),
);
console.log(
  chalk.yellow("npm run build") + chalk.gray("       - Production build"),
);

console.log(chalk.green.bold("\n🔧 Troubleshooting"));
console.log(
  chalk.yellow("npm run doctor") + chalk.gray("     - System health check"),
);
console.log(
  chalk.yellow("npm run help") + chalk.gray("       - View all commands"),
);
console.log(
  chalk.yellow("npm run clean") + chalk.gray("      - Clear build directory"),
);

console.log(
  chalk.gray(
    "\n💡 Pro tip: Use npm run help for complete workflow documentation",
  ),
);
console.log();
