/** @format */

// Silence punycode deprecation warning
process.noDeprecation = true;

import logger, { LumberjackStyle } from '../js/utils/lumberjack/index.js';
import { config } from 'dotenv';
import { AssetCache } from '@11ty/eleventy-fetch';
import { processFile, completeProcessing } from './processFile.js';
import Airtable from 'airtable';

config();

/**
 * Custom Logger Styles for Airtable Operations
 *
 * These styles provide visual distinction for different Airtable operations:
 * - airtableStyle (Orange 🗄️): Database operations, fetching, refreshing
 * - cachingStyle (Purple 💾): Cache-related operations (using/saving cache)
 * - processingStyle (Cyan ⚙️): Record processing operations
 */
const msgStyle = new LumberjackStyle('#0A9396', '🗄️');
const cachedStyle = new LumberjackStyle('#CA6702', '•');
const refreshStyle = new LumberjackStyle('#CA6702', '↻');

/**
 * Fetch data from an Airtable table and cache it.
 *
 * CACHE REFRESH OPTIONS:
 * 1. Force refresh all tables: Set FORCE_REFRESH=true environment variable
 *    Example: FORCE_REFRESH=true npm run build
 *
 * 2. Force refresh specific table: Set FORCE_REFRESH_TABLE=TableName
 *    Example: FORCE_REFRESH_TABLE=Projects npm run build
 *
 * 3. Normal cache behavior: Don't set any FORCE_REFRESH variables
 *    Cache duration controlled by table.cache in site.json
 *
 * @param {Object} table - Table configuration object
 * @param {string} table.tableName - The name of the Airtable table
 * @param {string} table.tableView - The name of the Airtable view
 * @param {string} table.cache - The cache duration (e.g., '1d', '1h')
 * @returns {Promise<Object[]>} A promise that resolves to the data fetched from Airtable
 */
export default async function fetchAirtableData(table) {
  const asset = new AssetCache(table.tableName + 'Cached');

  // Check for force refresh flags
  const forceRefreshAll = process.env.FORCE_REFRESH === 'true';
  const forceRefreshTable = process.env.FORCE_REFRESH_TABLE === table.tableName;
  const shouldForceRefresh = forceRefreshAll || forceRefreshTable;

  // Use cached data if valid and not forcing refresh
  if (!shouldForceRefresh && asset.isCacheValid(table.cache)) {
    logger.trace(table.tableName + ': ', 'cached', 'brief', cachedStyle);
    return asset.getCachedValue();
  }

  // Log reason for refresh
  if (shouldForceRefresh) {
    logger.trace(table.tableName + ': ', 'forced refresh', 'brief', refreshStyle);
  } else {
    logger.trace(table.tableName + ': ', 'expired', 'brief', refreshStyle);
  }

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_TOKEN);

  return new Promise((resolve, reject) => {
    const allRecords = [];
    let processedRecords = 0;

    base(table.tableName)
      .select({
        view: table.tableView,
      })
      .eachPage(
        async (records, fetchNextPage) => {
          // Update and display the current count of processed records
          processedRecords += records.length;
          logger.trace(
            '',
            'Processing ' + processedRecords + ' records from ' + table.tableName,
            'brief',
            refreshStyle
          );

          // Calculate the total number of file fields in the current batch of records so that we can track progress
          const fileFields = records.reduce((count, record) => {
            return count + (record.fields.File ? record.fields.File.length : 0);
          }, 0);

          // For each record in this batch...
          for (const record of records) {
            // process each of the record's fields
            const processedFields = await Object.fromEntries(
              await Promise.all(
                Object.entries(record.fields).map(async ([key, value]) => {
                  const lowerKey = key.toLowerCase(); // Normalize the key to lowercase to keep ourselves sane
                  // File fields need a little extra processing
                  if (key === 'File') {
                    const processedValue = await processFile(value[0], fileFields, table.cache);
                    return [lowerKey, processedValue];
                  }
                  return [lowerKey, value];
                })
              )
            );

            // Create the slug for the record
            // logger.trace('Building slug for record:', table.tableName, 'brief', 'standard');
            let slug = '';
            if (processedFields.title) {
              slug = `/${slugify(table.tableName.toLowerCase())}/${slugify(
                processedFields.title.toLowerCase()
              )}`;
            } else {
              logger.trace(
                'Could not build slug:',
                { recordId: record.id, table: table.tableName },
                'brief',
                'error'
              );
            }

            allRecords.push({
              id: record.id,
              ...processedFields,
              slug,
            });
          }
          completeProcessing();
          fetchNextPage();
        },
        err => {
          if (err) {
            logger.trace('Airtable fetch error:', err, 'verbose'); // Auto-detects Error, applies error style
            reject(err);
          } else {
            asset.save(allRecords, 'json');
            logger.trace('', table.tableName + ' data cached', 'brief', refreshStyle);
            resolve(allRecords);
          }
        }
      );
  });
}

// Helper function to slugify a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
