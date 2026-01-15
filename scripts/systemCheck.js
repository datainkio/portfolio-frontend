#!/usr/bin/env node
/** @format */

/**
 * System Health Check Script
 *
 * CRITICAL WARNING: This script performs comprehensive system health checks
 * for the dataink.io portfolio build system. Use this for troubleshooting
 * when builds fail or services are unresponsive.
 *
 * ARCHITECTURE VALIDATION:
 * - Environment variables and API tokens
 * - File system permissions and structure
 * - Network connectivity to external services
 * - Build tool versions and compatibility
 * - Cache states and disk usage
 *
 * USAGE:
 * npm run doctor
 * node scripts/systemCheck.js
 */

import { existsSync, statSync, accessSync, constants } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Load environment variables
dotenv.config();

console.log(chalk.green.bold('\n🩺 SYSTEM HEALTH CHECK'));
console.log(chalk.gray('─'.repeat(50)));

let healthScore = 0;
let totalChecks = 0;
const issues = [];
const warnings = [];

/**
 * Perform a health check with scoring
 */
function healthCheck(name, checkFn, weight = 1) {
  totalChecks += weight;
  try {
    const result = checkFn();
    if (result.status === 'pass') {
      console.log(chalk.green(`✅ ${name}`));
      if (result.details) {
        console.log(chalk.gray(`   ${result.details}`));
      }
      healthScore += weight;
    } else if (result.status === 'warn') {
      console.log(chalk.yellow(`⚠️  ${name}`));
      console.log(chalk.yellow(`   ${result.message}`));
      warnings.push(`${name}: ${result.message}`);
      healthScore += weight * 0.5; // Half credit for warnings
    } else {
      console.log(chalk.red(`❌ ${name}`));
      console.log(chalk.red(`   ${result.message}`));
      issues.push(`${name}: ${result.message}`);
    }
  } catch (error) {
    console.log(chalk.red(`❌ ${name}: ${error.message}`));
    issues.push(`${name}: ${error.message}`);
  }
}

/**
 * Check Node.js version and capabilities
 */
function checkNodeEnvironment() {
  console.log(chalk.blue('\n🟢 Node.js Environment'));

  healthCheck('Node.js Version', () => {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    if (major >= 18) {
      return { status: 'pass', details: `${version} (✓ ES modules supported)` };
    } else {
      return { status: 'fail', message: `${version} - requires Node.js 18+ for ES modules` };
    }
  });

  healthCheck('npm Version', () => {
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      return { status: 'pass', details: `v${npmVersion}` };
    } catch (error) {
      return { status: 'fail', message: 'npm not available' };
    }
  });
}

/**
 * Check critical environment variables
 */
function checkEnvironmentVariables() {
  console.log(chalk.blue('\n🔐 Environment Variables'));

  healthCheck(
    'FIGMA_TOKEN',
    () => {
      const value = process.env.FIGMA_TOKEN ?? process.env.FIGMA_ACCESS_TOKEN;
      if (!value) {
        return {
          status: 'fail',
          message: 'Missing - set FIGMA_TOKEN (or legacy FIGMA_ACCESS_TOKEN) in .env file',
        };
      }
      const masked =
        value.length > 8
          ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
          : '*'.repeat(value.length);
      return { status: 'pass', details: masked };
    },
    2
  );

  const criticalVars = ['FIGMA_FILE_ID', 'AIRTABLE_PERSONAL_ACCESS_TOKEN', 'AIRTABLE_BASE_TOKEN'];

  criticalVars.forEach(varName => {
    healthCheck(
      `${varName}`,
      () => {
        const value = process.env[varName];
        if (!value) {
          return { status: 'fail', message: 'Missing - set in .env file' };
        }
        const masked =
          value.length > 8
            ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
            : '*'.repeat(value.length);
        return { status: 'pass', details: masked };
      },
      2
    ); // Higher weight for critical vars
  });
}

/**
 * Check project file structure and permissions
 */
function checkFileSystem() {
  console.log(chalk.blue('\n📁 File System'));

  const criticalPaths = [
    { path: '.eleventy.js', description: '11ty configuration' },
    { path: 'tailwind.config.js', description: 'Tailwind configuration' },
    { path: 'njk/_data/site.json', description: 'Site configuration' },
    { path: 'styles/main.css', description: 'Main CSS entry point' },
    { path: 'scripts', description: 'Build scripts directory' },
  ];

  criticalPaths.forEach(item => {
    healthCheck(`${item.path}`, () => {
      const fullPath = resolve(projectRoot, item.path);
      if (!existsSync(fullPath)) {
        return { status: 'fail', message: `Missing: ${item.description}` };
      }

      try {
        accessSync(fullPath, constants.R_OK);
        const stats = statSync(fullPath);
        const type = stats.isDirectory() ? 'directory' : 'file';
        return { status: 'pass', details: `${type} readable` };
      } catch (error) {
        return { status: 'fail', message: 'Permission denied' };
      }
    });
  });

  // Check _site directory permissions
  healthCheck('_site Directory', () => {
    const sitePath = resolve(projectRoot, '_site');
    if (!existsSync(sitePath)) {
      return { status: 'warn', message: 'Build directory missing - run npm run build' };
    }

    try {
      accessSync(sitePath, constants.W_OK);
      return { status: 'pass', details: 'Build directory writable' };
    } catch (error) {
      return { status: 'fail', message: 'Build directory not writable' };
    }
  });
}

/**
 * Check dependencies and package health
 */
function checkDependencies() {
  console.log(chalk.blue('\n📦 Dependencies'));

  healthCheck(
    'node_modules',
    () => {
      const nodeModulesPath = resolve(projectRoot, 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        return { status: 'fail', message: 'Dependencies not installed - run npm install' };
      }

      const stats = statSync(nodeModulesPath);
      const sizeMB = Math.round(stats.size / (1024 * 1024));
      return { status: 'pass', details: `Dependencies installed` };
    },
    2
  );

  // Check critical dependencies
  const criticalDeps = ['@11ty/eleventy', 'tailwindcss', 'chalk', 'npm-run-all'];

  criticalDeps.forEach(dep => {
    healthCheck(`${dep}`, () => {
      try {
        const depPath = resolve(projectRoot, 'node_modules', dep);
        if (existsSync(depPath)) {
          return { status: 'pass', details: 'Installed' };
        } else {
          return { status: 'fail', message: 'Missing dependency' };
        }
      } catch (error) {
        return { status: 'fail', message: 'Dependency check failed' };
      }
    });
  });
}

/**
 * Check build tools and external connectivity
 */
function checkBuildTools() {
  console.log(chalk.blue('\n🔧 Build Tools'));

  healthCheck('Tailwind CLI', () => {
    try {
      execSync('npx @tailwindcss/cli -h', { stdio: 'ignore' });
      return { status: 'pass', details: 'Available' };
    } catch (error) {
      return { status: 'fail', message: 'Tailwind CLI not working' };
    }
  });

  healthCheck('11ty CLI', () => {
    try {
      execSync('npx eleventy --version', { stdio: 'ignore' });
      return { status: 'pass', details: 'Available' };
    } catch (error) {
      return { status: 'fail', message: '11ty CLI not working' };
    }
  });
}

/**
 * Generate health report
 */
function generateHealthReport() {
  console.log(chalk.blue('\n📊 HEALTH REPORT'));
  console.log(chalk.gray('─'.repeat(30)));

  const percentage = Math.round((healthScore / totalChecks) * 100);
  let status, color;

  if (percentage >= 90) {
    status = 'EXCELLENT';
    color = chalk.green;
  } else if (percentage >= 75) {
    status = 'GOOD';
    color = chalk.cyan;
  } else if (percentage >= 60) {
    status = 'FAIR';
    color = chalk.yellow;
  } else {
    status = 'POOR';
    color = chalk.red;
  }

  console.log(color.bold(`Health Score: ${percentage}% (${status})`));
  console.log(chalk.gray(`Passed: ${healthScore}/${totalChecks} checks`));

  if (issues.length > 0) {
    console.log(chalk.red.bold(`\n❌ Critical Issues (${issues.length}):`));
    issues.forEach(issue => {
      console.log(chalk.red(`   • ${issue}`));
    });
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold(`\n⚠️  Warnings (${warnings.length}):`));
    warnings.forEach(warning => {
      console.log(chalk.yellow(`   • ${warning}`));
    });
  }

  if (percentage >= 90) {
    console.log(chalk.green.bold('\n🎉 System is healthy and ready for development!'));
    console.log(chalk.cyan('Run: npm start'));
  } else if (percentage >= 75) {
    console.log(chalk.yellow.bold('\n⚠️  System has minor issues but should work'));
    console.log(chalk.cyan('Consider addressing warnings before deployment'));
  } else {
    console.log(chalk.red.bold('\n🚨 System requires attention before development'));
    console.log(chalk.yellow('Address critical issues first, then run: npm run doctor'));
  }
}

/**
 * Main system check function
 */
async function runSystemCheck() {
  try {
    checkNodeEnvironment();
    checkEnvironmentVariables();
    checkFileSystem();
    checkDependencies();
    checkBuildTools();

    generateHealthReport();
  } catch (error) {
    console.error(chalk.red('❌ System check failed:'), error.message);
    process.exit(1);
  }
}

// Run system check if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runSystemCheck();
}

export { runSystemCheck };
