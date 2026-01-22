/**
 * ---
 * aix:
 *   id: frontend.scripts.clearsitefolder
 *   role: Build/utility script: scripts/clearSiteFolder.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - clearSiteFolder.js
 * ---
 */
/** @format */

import { rm, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import logger from '@datainkio/lumberjack';

logger.enabled = true;

const siteFolder = join(process.cwd(), '_site');
const preserveDirs = ['content']; // Directories to preserve

async function clearSiteFolder() {
  logger.trace('Starting site cleanup:', 'Analyzing folder structure...', 'brief', 'headsup');

  if (existsSync(siteFolder)) {
    logger.indent();
    try {
      const entries = await readdir(siteFolder);
      logger.trace('Site folder entries found:', entries, 'verbose', 'standard');

      // Delete each entry except preserved directories
      logger.indent();
      const deletePromises = entries
        .filter(entry => !preserveDirs.includes(entry))
        .map(entry => rm(join(siteFolder, entry), { recursive: true, force: true }));

      await Promise.all(deletePromises);
      logger.outdent();

      const deletedItems = entries.filter(e => !preserveDirs.includes(e));
      if (deletedItems.length > 0) {
        logger.trace('✓ Successfully deleted:', deletedItems, 'brief', 'success');
      } else {
        logger.trace('No items to delete', 'All content preserved', 'brief', 'standard');
      }

      console.log('_site folder cleared (preserved: content).');
    } catch (err) {
      console.error(`Error clearing _site folder: ${err.message}`);
      logger.trace('✗ Clear operation failed:', err, 'verbose', 'error');
    } finally {
      logger.outdent();
    }
  } else {
    logger.indent();
    console.log('_site folder does not exist, skipping cleanup.');
    logger.trace('Site folder status:', 'does not exist', 'brief', 'standard');
    logger.outdent();
  }

  logger.resetIndent();
}

clearSiteFolder();
