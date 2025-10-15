import logger from '../../js/utils/logger/index.js';
import fetchAirtableData from '../../airtable/fetchAirtableData.js';
/**
 * Airtable builds a collection for each table in the site.airtables array
 */
export async function init(eleventyConfig, site) {
  // Output init message
  logger.trace('Airtable Data Sync', undefined, 'brief', 'headsup');
  logger.indent();
  logger.trace('API info and cache curation managed by site.json', undefined, 'brief', 'standard');

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
    logger.outdent();
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

  logger.outdent();
}
