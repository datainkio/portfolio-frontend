#!/usr/bin/env node
/** @format */

/**
 * Available Workflows Display Script
 *
 * CRITICAL WARNING: This script provides comprehensive documentation of all
 * available npm scripts organized by workflow type. Use this as your primary
 * reference for understanding the build system capabilities.
 *
 * ARCHITECTURE INTEGRATION:
 * - Development workflows for design iteration
 * - Build processes for production deployment
 * - Content management for Airtable/Figma sync
 * - Testing and validation workflows
 * - Debugging and troubleshooting tools
 *
 * USAGE:
 * npm run help
 * node scripts/showAvailableWorkflows.js
 */

import chalk from 'chalk';
import { readFileSync } from 'fs';

// Load package.json to get current scripts
const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const scripts = packageJson.scripts || {};

console.log(chalk.cyan.bold('\n🚀 DATAINK.IO PORTFOLIO WORKFLOWS'));
console.log(chalk.gray('─'.repeat(60)));

/**
 * Display workflow section
 */
function showWorkflowSection(title, icon, workflows, description) {
  console.log(chalk.blue.bold(`\n${icon} ${title.toUpperCase()}`));
  if (description) {
    console.log(chalk.gray(description));
  }
  console.log(chalk.gray('─'.repeat(40)));

  workflows.forEach(workflow => {
    const scriptExists = scripts[workflow.script];
    const status = scriptExists ? chalk.green('✅') : chalk.red('❌');
    const command = chalk.yellow(`npm run ${workflow.script}`);

    console.log(`${status} ${command}`);
    console.log(chalk.gray(`   ${workflow.description}`));

    if (workflow.note) {
      console.log(chalk.cyan(`   💡 ${workflow.note}`));
    }

    if (!scriptExists) {
      console.log(chalk.red(`   ⚠️  Script not found in package.json`));
    }
    console.log();
  });
}

// Development Workflows
showWorkflowSection(
  'Development Workflows',
  '🔧',
  [
    {
      script: 'start',
      description: 'Start development server with hot reloading',
      note: 'Runs CSS watch + 11ty dev server in parallel',
    },
    {
      script: 'dev',
      description: 'Same as start - parallel dev:css and dev:11ty',
    },
    {
      script: 'dev:css',
      description: 'Watch Tailwind CSS compilation with hot reload',
    },
    {
      script: 'dev:11ty',
      description: 'Start 11ty development server on localhost:8080',
    },
  ],
  'Primary development workflows for design iteration and content updates'
);

// Build Processes
showWorkflowSection(
  'Build Processes',
  '🏗️',
  [
    {
      script: 'build',
      description: 'Full production build: clean → sync → build:*',
      note: 'Complete build including content sync and design tokens',
    },
    {
      script: 'build:debug',
      description: 'Debug build with verbose logging (DEBUG=true)',
    },
    {
      script: 'build:force',
      description: 'Force refresh all content and rebuild (FORCE_REFRESH=true)',
    },
    {
      script: 'build:preview',
      description: 'Show build process overview without execution',
    },
    {
      script: 'build:css',
      description: 'Compile Tailwind CSS for production (minified)',
    },
    {
      script: 'build:css:dev',
      description: 'Compile Tailwind CSS for development (unminified)',
    },
    {
      script: 'build:11ty',
      description: 'Generate static site files with 11ty',
    },
  ],
  'Production build processes and CSS compilation'
);

// Content & Design Sync
showWorkflowSection(
  'Content & Design Sync',
  '🎨',
  [
    {
      script: 'sync:content',
      description: 'Sync cached content from Airtable CMS',
    },
    {
      script: 'sync:content:debug',
      description: 'Sync content with debug logging',
    },
    {
      script: 'sync:content:force',
      description: 'Force refresh all Airtable content (ignores cache)',
    },
    {
      script: 'build:design',
      description: 'Fetch design tokens from Figma API',
      note: 'Automatically triggers CSS rebuild with new tokens',
    },
    {
      script: 'build:design:debug',
      description: 'Fetch Figma design tokens with debug logging',
    },
  ],
  'Figma design system and Airtable content management'
);

// Testing & Validation
showWorkflowSection(
  'Testing & Validation',
  '🧪',
  [
    {
      script: 'test',
      description: 'Run all logger tests',
    },
    {
      script: 'test:logger',
      description: 'Test core Logger functionality',
    },
    {
      script: 'test:logger:styles',
      description: 'Test Logger style system with examples',
    },
    {
      script: 'test:logger:enhancements',
      description: 'Test enhanced Logger features (scoped, configuration)',
    },
  ],
  'Comprehensive testing suite for Logger and build system'
);

// Utility Scripts
showWorkflowSection(
  'Utility Scripts',
  '🛠️',
  [
    {
      script: 'clean',
      description: 'Clear build directory (_site/)',
    },
    {
      script: 'clean:debug',
      description: 'Clear build directory with debug logging',
    },
    {
      script: 'format',
      description: 'Format all code with Prettier',
    },
    {
      script: 'format:check',
      description: 'Check code formatting without changes',
    },
    {
      script: 'format:njk',
      description: 'Format Nunjucks templates specifically',
    },
  ],
  'Maintenance and code formatting utilities'
);

// Quick Reference
console.log(chalk.magenta.bold('\n⚡ QUICK START GUIDE'));
console.log(chalk.gray('─'.repeat(40)));
console.log(chalk.green('New to this project?'));
console.log(chalk.yellow('  1. npm run validate:env') + chalk.gray(' - Check environment setup'));
console.log(chalk.yellow('  2. npm install') + chalk.gray(' - Install dependencies'));
console.log(chalk.yellow('  3. npm start') + chalk.gray(' - Start development server'));
console.log();

console.log(chalk.green('Working on design updates?'));
console.log(chalk.yellow('  1. npm run build:design') + chalk.gray(' - Sync Figma tokens'));
console.log(chalk.yellow('  2. npm run dev:css') + chalk.gray(' - Watch CSS compilation'));
console.log();

console.log(chalk.green('Content updates?'));
console.log(chalk.yellow('  1. npm run sync:content:force') + chalk.gray(' - Fresh Airtable sync'));
console.log(chalk.yellow('  2. npm run build:11ty') + chalk.gray(' - Regenerate pages'));
console.log();

console.log(chalk.green('Production deployment?'));
console.log(chalk.yellow('  1. npm run build') + chalk.gray(' - Full production build'));
console.log(chalk.yellow('  2. Deploy _site/ directory'));
console.log();

console.log(chalk.magenta.bold('\n📚 ADDITIONAL HELP'));
console.log(chalk.gray('─'.repeat(40)));
console.log(
  chalk.cyan('• npm run build:preview') + chalk.gray(' - Detailed build process overview')
);
console.log(chalk.cyan('• npm run test:logger') + chalk.gray(' - Verify Logger functionality'));
console.log(chalk.cyan('• Check README.md') + chalk.gray(' - Complete setup documentation'));
console.log(chalk.cyan('• Review .env.example') + chalk.gray(' - Environment variable template'));

console.log(chalk.gray('\n' + '─'.repeat(60)));
console.log(
  chalk.cyan('💡 Pro tip: Use npm run build:preview:verbose for detailed workflow insights')
);
console.log();
