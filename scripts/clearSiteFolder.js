/** @format */

import { rm, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const siteFolder = join(process.cwd(), '_site');
const preserveDirs = ['content']; // Directories to preserve

async function clearSiteFolder() {
  if (existsSync(siteFolder)) {
    try {
      const entries = await readdir(siteFolder);

      // Delete each entry except preserved directories
      const deletePromises = entries
        .filter(entry => !preserveDirs.includes(entry))
        .map(entry => rm(join(siteFolder, entry), { recursive: true, force: true }));

      await Promise.all(deletePromises);

      console.log('_site folder cleared (preserved: content).');
    } catch (err) {
      console.error(`Error clearing _site folder: ${err.message}`);
    }
  } else {
    console.log('_site folder does not exist, skipping cleanup.');
  }
}

clearSiteFolder();
