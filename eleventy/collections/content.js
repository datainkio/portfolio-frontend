import logger, { LumberjackStyle } from '@datainkio/lumberjack';
import fetchAirtableData from '../../airtable/fetchAirtableData.js';

logger.enabled = true;

/**
 * Custom Logger Styles for 11ty Operations
 */
const titleStyle = new LumberjackStyle('#EE9B00', '\n☎️  ');
const msgStyle = new LumberjackStyle('#CA6702', '•');
const successStyle = new LumberjackStyle('#EE9B00', '\n👍');
/**
 * Airtable builds a collection for each table in the site.airtables array
 *
 * Fetching Strategy:
 * - Set AIRTABLE_PARALLEL=true for parallel fetching (faster, default)
 * - Set AIRTABLE_PARALLEL=false for sequential fetching (easier debugging)
 */
export async function init(eleventyConfig, site) {
  // Check if parallel fetching is enabled (default: true)
  const useParallel = process.env.AIRTABLE_PARALLEL !== 'false';

  // Output init message
  const mode = useParallel ? 'parallel' : 'sequential';
  logger.trace('Syncing with CMS (' + mode + ')', null, 'brief', titleStyle);
  logger.trace(
    null,
    'The registration of data collections starts by checking the freshness of local content. If the cache has expired, then it hits up the remote CMS for fresh content. CMS API info and cache curation are managed by site.json. Tables can be fetched in either parallel or sequential mode (set in dotenv).\n',
    'brief',
    'standard'
  );

  // If the site object or site.airtables config is missing, exit.
  if (!site || !site.airtables) {
    logger.trace(
      'Configuration error:',
      {
        message: "content.js didn't get the configuration info it needed",
        files: ['site.json', 'eleventy/collections/index.js'],
      },
      'verbose',
      'error'
    );
    return;
  }

  let results;

  if (useParallel) {
    // Fetch all table data in parallel (faster)
    results = await Promise.all(
      site.airtables.map(async table => {
        try {
          const data = await fetchAirtableData(table);
          // logger.trace('Fetched:', { table: table.tableName }, 'brief', 'success');
          return { tableName: table.tableName.toLowerCase(), data };
        } catch (error) {
          logger.trace('Fetch error:', error, 'verbose'); // Auto-detects error style
          return { tableName: table.tableName.toLowerCase(), data: [] };
        }
      })
    );
  } else {
    // Fetch table data sequentially (easier to debug)
    results = [];
    for (const table of site.airtables) {
      try {
        const data = await fetchAirtableData(table);
        // logger.trace('Fetched:', { table: table.tableName }, 'brief', 'success');
        results.push({ tableName: table.tableName.toLowerCase(), data });
      } catch (error) {
        logger.trace('Fetch error:', error, 'verbose'); // Auto-detects error style
        results.push({ tableName: table.tableName.toLowerCase(), data: [] });
      }
    }
  }

  // Register Eleventy collections after all fetches complete
  results.forEach(({ tableName, data }) => {
    eleventyConfig.addCollection(tableName, () => data);
  });

  logger.trace('CMS sync complete', null, 'brief', successStyle);
}
