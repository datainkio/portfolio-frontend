/** @format */

/**
 * CONTENT SYNC SCRIPT
 *
 * CRITICAL WARNING: This script maintains the _site/content folder by ensuring
 * processed content (images, videos, etc.) from the .cache folder are available
 * at runtime. Without this, the site will have broken image links and missing assets.
 *
 * ARCHITECTURE DEPENDENCIES:
 * - .cache/ - 11ty-fetch cache with raw API responses and downloaded assets
 * - _site/content/ - Processed content directory served at runtime
 * - airtable/processFile.js - Image processing that writes to _site/content/images/
 *
 * INTEGRATION POINTS:
 * - Called as part of build process to ensure content availability
 * - Preserves content/ directory when clearSiteFolder runs
 * - Syncs only necessary files to avoid re-processing
 *
 * BUG POTENTIAL: If cache structure changes or file naming conventions shift,
 * this script will need updates. Always check console output for sync failures.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';

const CACHE_DIR = '.cache';
const CONTENT_DIR = '_site/content';

/**
 * Get stats for a file/directory
 */
async function getStats(filePath) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

/**
 * Copy a file from source to destination, creating directories as needed
 */
async function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(src, dest);
}

/**
 * Recursively find all .buffer files in the cache directory
 * These are the actual asset files (images, videos, etc.)
 */
async function findBufferFiles(dir, fileList = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await findBufferFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.buffer')) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Determine content type from file signature (magic bytes)
 */
async function detectFileType(filePath) {
  const fd = await fs.open(filePath, 'r');
  const buffer = Buffer.alloc(12);
  await fd.read(buffer, 0, 12, 0);
  await fd.close();

  // Check magic bytes for common file types
  const hex = buffer.toString('hex');

  // Images
  if (hex.startsWith('ffd8ff')) return { type: 'image/jpeg', ext: '.jpeg' };
  if (hex.startsWith('89504e47')) return { type: 'image/png', ext: '.png' };
  if (hex.startsWith('47494638')) return { type: 'image/gif', ext: '.gif' };
  if (hex.startsWith('52494646') && hex.includes('57454250'))
    return { type: 'image/webp', ext: '.webp' };
  if (hex.startsWith('3c3f786d6c') || hex.startsWith('3c737667'))
    return { type: 'image/svg+xml', ext: '.svg' };

  // Videos
  if (hex.includes('667479706d703432') || hex.includes('6674797069736f6d'))
    return { type: 'video/mp4', ext: '.mp4' };
  if (hex.includes('6674797071742020')) return { type: 'video/quicktime', ext: '.mov' };

  // PDFs
  if (hex.startsWith('25504446')) return { type: 'application/pdf', ext: '.pdf' };

  // Text
  if (buffer.every(b => b < 128 || b === 0)) return { type: 'text/plain', ext: '.txt' };

  return { type: 'application/octet-stream', ext: '.bin' };
}

/**
 * Get destination path for a cached file based on its type
 */
function getDestinationPath(cacheFile, fileInfo) {
  const basename = path.basename(cacheFile, '.buffer');

  if (fileInfo.type.startsWith('image/')) {
    // Images go to subdirectories by format
    const format = fileInfo.type.split('/')[1];
    return path.join(CONTENT_DIR, 'images', format, basename + fileInfo.ext);
  } else if (fileInfo.type.startsWith('video/')) {
    return path.join(CONTENT_DIR, 'video', basename + fileInfo.ext);
  } else if (fileInfo.type === 'application/pdf') {
    return path.join(CONTENT_DIR, 'pdf', basename + fileInfo.ext);
  } else {
    return path.join(CONTENT_DIR, 'txt', basename + fileInfo.ext);
  }
}

/**
 * Main sync function
 */
async function syncContent() {
  console.log(chalk.blue.bold('\n🔄 Starting content sync from .cache to _site/content...'));

  try {
    // Ensure content directory exists
    await fs.mkdir(CONTENT_DIR, { recursive: true });

    // Find all buffer files in cache
    const bufferFiles = await findBufferFiles(CACHE_DIR);
    console.log(chalk.gray(`Found ${bufferFiles.length} cached files`));

    let copied = 0;
    let skipped = 0;
    let errors = 0;

    for (const cacheFile of bufferFiles) {
      try {
        // Detect file type
        const fileInfo = await detectFileType(cacheFile);
        const destPath = getDestinationPath(cacheFile, fileInfo);

        // Check if destination exists and is newer
        const cacheStat = await getStats(cacheFile);
        const destStat = await getStats(destPath);

        if (destStat && destStat.mtime >= cacheStat.mtime) {
          skipped++;
          continue;
        }

        // Copy file
        await copyFile(cacheFile, destPath);
        copied++;

        // Log progress every 10 files
        if (copied % 10 === 0) {
          console.log(chalk.gray(`  Copied ${copied} files...`));
        }
      } catch (error) {
        errors++;
        console.error(chalk.red(`Error processing ${cacheFile}: ${error.message}`));
      }
    }

    console.log(
      chalk.green.bold(
        `\n✅ Content sync complete: ${copied} copied, ${skipped} skipped, ${errors} errors`
      )
    );

    if (errors > 0) {
      console.log(chalk.yellow(`⚠️  Some files failed to sync. Check error messages above.`));
    }
  } catch (error) {
    console.error(chalk.red.bold(`\n❌ Content sync failed: ${error.message}`));
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncContent().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { syncContent };
