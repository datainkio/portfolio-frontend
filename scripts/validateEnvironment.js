#!/usr/bin/env node
/** @format */

/**
 * Environment Validation Script
 *
 * CRITICAL WARNING: This script validates the development environment for dataink.io
 * portfolio build system. Missing environment variables or incorrect configurations
 * will cause silent failures in Figma design sync and Airtable content integration.
 *
 * REQUIREMENTS:
 * - FIGMA_TOKEN: Personal access token for design system sync
 * - AIRTABLE_PERSONAL_ACCESS_TOKEN: API access for content management
 * - AIRTABLE_BASE_TOKEN: Specific base identifier for portfolio content
 * - Node.js 18+ for ES modules support
 * - npm-run-all for parallel script execution
 *
 * USAGE:
 * npm run validate:env
 * node scripts/validateEnvironment.js
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log(chalk.cyan.bold('\n🔍 ENVIRONMENT VALIDATION'));
console.log(chalk.gray('─'.repeat(50)));

let hasErrors = false;
const warnings = [];

/**
 * Validate required environment variables
 */
function validateEnvironmentVariables() {
  console.log(chalk.blue('\n📋 Environment Variables'));

  const requiredVars = [
    {
      name: 'FIGMA_TOKEN',
      description: 'Personal access token for Figma API',
      critical: true,
    },
    {
      name: 'AIRTABLE_PERSONAL_ACCESS_TOKEN',
      description: 'Personal access token for Airtable API',
      critical: true,
    },
    {
      name: 'AIRTABLE_BASE_TOKEN',
      description: 'Base ID for portfolio content in Airtable',
      critical: true,
    },
  ];

  requiredVars.forEach(variable => {
    const value = process.env[variable.name];
    if (!value) {
      if (variable.critical) {
        console.log(chalk.red(`  ❌ ${variable.name}: MISSING (CRITICAL)`));
        console.log(chalk.gray(`     ${variable.description}`));
        hasErrors = true;
      } else {
        console.log(chalk.yellow(`  ⚠️  ${variable.name}: Missing (optional)`));
        warnings.push(`${variable.name}: ${variable.description}`);
      }
    } else {
      const maskedValue =
        value.length > 8
          ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
          : '*'.repeat(value.length);
      console.log(chalk.green(`  ✅ ${variable.name}: ${maskedValue}`));
    }
  });
}

/**
 * Validate project file structure
 */
function validateProjectStructure() {
  console.log(chalk.blue('\n📁 Project Structure'));

  const requiredPaths = [
    { path: 'njk/_data/site.json', description: 'Site configuration' },
    { path: 'styles/main.css', description: 'Main CSS entry point' },
    { path: 'tailwind.config.js', description: 'Tailwind configuration' },
    { path: '.eleventy.js', description: '11ty configuration' },
    { path: 'scripts', description: 'Build scripts directory' },
    { path: 'figma', description: 'Figma integration services' },
    { path: 'airtable', description: 'Airtable integration services' },
  ];

  requiredPaths.forEach(item => {
    const fullPath = resolve(item.path);
    if (existsSync(fullPath)) {
      console.log(chalk.green(`  ✅ ${item.path}`));
    } else {
      console.log(chalk.red(`  ❌ ${item.path}: Missing`));
      console.log(chalk.gray(`     ${item.description}`));
      hasErrors = true;
    }
  });
}

/**
 * Validate Node.js and npm setup
 */
function validateNodeSetup() {
  console.log(chalk.blue('\n⚙️ Node.js Environment'));

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion >= 18) {
    console.log(chalk.green(`  ✅ Node.js: ${nodeVersion}`));
  } else {
    console.log(chalk.red(`  ❌ Node.js: ${nodeVersion} (requires 18+)`));
    hasErrors = true;
  }

  // Check for package.json
  if (existsSync('package.json')) {
    console.log(chalk.green('  ✅ package.json: Found'));
  } else {
    console.log(chalk.red('  ❌ package.json: Missing'));
    hasErrors = true;
  }

  // Check for node_modules
  if (existsSync('node_modules')) {
    console.log(chalk.green('  ✅ node_modules: Dependencies installed'));
  } else {
    console.log(chalk.yellow('  ⚠️  node_modules: Run npm install'));
    warnings.push('Dependencies not installed - run npm install');
  }
}

/**
 * Main validation function
 */
async function validateEnvironment() {
  try {
    validateNodeSetup();
    validateEnvironmentVariables();
    validateProjectStructure();

    // Summary
    console.log(chalk.blue('\n📊 Validation Summary'));
    console.log(chalk.gray('─'.repeat(30)));

    if (hasErrors) {
      console.log(chalk.red('❌ Environment validation FAILED'));
      console.log(chalk.yellow('\nRequired actions:'));
      console.log('1. Set missing environment variables in .env file');
      console.log('2. Ensure all required project files exist');
      console.log('3. Run npm install if dependencies are missing');
      console.log('\nSee README.md for detailed setup instructions');
      process.exit(1);
    } else {
      console.log(chalk.green('✅ Environment validation PASSED'));

      if (warnings.length > 0) {
        console.log(chalk.yellow(`\n⚠️  ${warnings.length} warnings:`));
        warnings.forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }

      console.log(chalk.cyan('\n🚀 Ready to start development!'));
      console.log('Run: npm start');
    }
  } catch (error) {
    console.error(chalk.red('❌ Validation failed:'), error.message);
    process.exit(1);
  }
}

// Run validation if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  validateEnvironment();
}

export { validateEnvironment };
