/**
 * ---
 * aix:
 *   id: frontend.scripts.displayenvironmentinfo
 *   role: Build/utility script: scripts/displayEnvironmentInfo.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - displayEnvironmentInfo.js
 * ---
 */
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

/**
 * Displays and validates environment configuration
 * @returns {Promise<void>}
 */
async function displayEnvironmentInfo() {
  // Clear terminal
  process.stdout.write('\x1Bc');
  // Clear browser console
  console.clear();
  return new Promise((resolve, reject) => {
    try {
      const env = dotenv.config().parsed ?? {};
      console.log(chalk.green.bold('\n🌎 ENVIRONMENT CONFIG'));
      console.log(chalk.gray('─'.repeat(50)));

      // Validate required environment variables
      const missing = [];
      const figmaToken = env.FIGMA_TOKEN || env.FIGMA_ACCESS_TOKEN;
      if (!figmaToken) missing.push('FIGMA_TOKEN');
      if (!env.FIGMA_FILE_ID) missing.push('FIGMA_FILE_ID');

      if (missing.length) {
        reject(
          new Error(
            `Missing required environment variables: ${missing.join(', ')} (legacy token name: FIGMA_ACCESS_TOKEN)`
          )
        );
        return;
      }

      // Display environment variables
      Object.entries(env).forEach(([key, value]) => {
        const maskedValue =
          key.includes('TOKEN') || key.includes('KEY')
            ? value.substring(0, 4) + '...' + value.slice(-4)
            : value;
        console.log(chalk.green('\t', key.padEnd(25)), chalk.white(maskedValue));
      });

      console.log('\n\n');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Main execution function
 */
async function main() {
  try {
    await displayEnvironmentInfo();
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default displayEnvironmentInfo;
