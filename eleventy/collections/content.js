import logger, { LoggerStyle } from '../../js/utils/logger/index.js';
import fetchAirtableData from '../../airtable/fetchAirtableData.js';
/**
 * Custom Logger Styles for 11ty Operations
 */
const titleStyle = new LoggerStyle('#EE9B00', '\n☎️  ');
const msgStyle = new LoggerStyle('#CA6702', '•');
const successStyle = new LoggerStyle('#EE9B00', '\n👍');
/**
 * Airtable builds a collection for each table in the site.airtables array
 */
export async function init(eleventyConfig, site) {
  // Output init message
  logger.trace('Syncing with CMS (Airtable)', null, 'brief', titleStyle);
  logger.trace(
    'The registration of data collections starts by checking the freshness of local content. If the cache has expired, then it hits up the remote CMS for fresh content. CMS API info and cache curation are managed by site.json.\n',
    undefined,
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

  // Fetch all table data in parallel
  const results = await Promise.all(
    site.airtables.map(async table => {
      try {
        const data = await fetchAirtableData(table);
        logger.trace('Fetched:', { table: table.tableName }, 'brief', 'success');
        return { tableName: table.tableName.toLowerCase(), data };
      } catch (error) {
        logger.trace('Fetch error:', error, 'verbose'); // Auto-detects error style
        return { tableName: table.tableName.toLowerCase(), data: [] };
      }
    })
  );

  // Register Eleventy collections after all fetches complete
  results.forEach(({ tableName, data }) => {
    eleventyConfig.addCollection(tableName, () => data);
  });
}
