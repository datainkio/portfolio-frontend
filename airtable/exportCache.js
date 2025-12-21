/** @format */

/**
 * Export Airtable cache data for migration to Sanity
 * This script reads cached Airtable data and writes it to JSON files
 * that can be easily consumed by the Sanity migration script.
 */

import { AssetCache } from '@11ty/eleventy-fetch';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TABLES = [
  'IA',
  'Activities',
  'Roles',
  'Outcomes',
  'Organizations',
  'Projects',
  'Awards',
  'Feed',
];
const OUTPUT_DIR = join(__dirname, '../../backend/sanity/cache-export');

// Create output directory
mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('📦 Exporting Airtable cache data...\n');

for (const tableName of TABLES) {
  try {
    const cacheKey = `${tableName}Cached`;
    const asset = new AssetCache(cacheKey);

    if (!asset.isCacheValid('1y')) {
      console.log(`⚠️  No valid cache for ${tableName}`);
      continue;
    }

    const data = await asset.getCachedValue();
    const outputPath = join(OUTPUT_DIR, `${tableName}.json`);

    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✓ Exported ${data.length} records from ${tableName}`);
  } catch (error) {
    console.error(`✗ Error exporting ${tableName}:`, error.message);
  }
}

console.log(`\n✅ Cache export complete! Files written to: ${OUTPUT_DIR}`);
