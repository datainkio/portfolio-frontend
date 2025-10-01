/** @format */
import chalk from "chalk";
import { config } from "dotenv";
import { AssetCache } from "@11ty/eleventy-fetch";
import { processFile, completeProcessing } from "./processFile.js";
import Airtable from "airtable";

config();

/**
 * Fetch data from an Airtable table and cache it.
 * @param {string} tableName - The name of the Airtable table.
 * @param {string} tableView - The name of the Airtable view.
 * @param {string} cache - The cache duration
 * @returns {Promise<Object[]>} A promise that resolves to the data fetched from Airtable.
 */
export default async function fetchAirtableData(table) {
  const asset = new AssetCache(table.tableName + "Cached");

  // If the cache is valid, then we're done here
  if (asset.isCacheValid(table.cache)) {
    // console.log(chalk.gray(`  📦 ${table.tableName}: using cached data`));
    return asset.getCachedValue();
  }

  // Otherwise, we need to fetch the data anew from Airtable
  console.log(chalk.green.bold("  📦 " + table.tableName + ": refreshing..."));

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
          console.log(
            chalk.gray(
              `Processing ${processedRecords} records from ${table.tableName}...`
            )
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
                  if (key === "File") {
                    const processedValue = await processFile(
                      value[0],
                      fileFields,
                      table.cache
                    );
                    return [lowerKey, processedValue];
                  }
                  return [lowerKey, value];
                })
              )
            );

            // Create the slug for the record
            // console.log(chalk.yellow(table.tableName));
            // console.log(processedFields);
            let slug = "";
            if (processedFields.title) {
              slug = `/${slugify(table.tableName.toLowerCase())}/${slugify(
                processedFields.title.toLowerCase()
              )}`;
            } else {
              console.log("Could not build the slug for this record: ", record);
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
        (err) => {
          if (err) {
            reject(err);
          } else {
            asset.save(allRecords, "json");
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
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
