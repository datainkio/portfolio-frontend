import chalk from "chalk";
import fetchAirtableData from "../../airtable/fetchAirtableData.js";
/**
 * Airtable builds a collection for each table in the site.airtables array
 */
export async function init(eleventyConfig, site) {
  console.log(chalk.green.bold("\n📊 Airtable Data Sync"));
  console.log(
    chalk.gray(`   (API info and cache curation are managed by site.json)\n`)
  );

  if (!site || !site.airtables) {
    console.error(
      " eleventy/collections/content.js didn't get the configuration info it needed. See site.json or eleventy/collections/index.js"
    );
    return;
  }

  // Fetch all table data in parallel
  const results = await Promise.all(
    site.airtables.map(async (table) => {
      try {
        const data = await fetchAirtableData(table);
        // console.log(chalk.gray(`  ✅ Fetched: ${table.tableName}`));
        return { tableName: table.tableName.toLowerCase(), data };
      } catch (error) {
        console.error(
          chalk.red(`  💥 Error fetching ${table.tableName}: ${error}`)
        );
        return { tableName: table.tableName.toLowerCase(), data: [] };
      }
    })
  );

  // Register Eleventy collections after all fetches complete
  results.forEach(({ tableName, data }) => {
    eleventyConfig.addCollection(tableName, () => data);
  });
}
