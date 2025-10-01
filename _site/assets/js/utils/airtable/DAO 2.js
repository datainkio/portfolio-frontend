/** @format */

// File: airtableFetcher.js
import dotenv from "dotenv";
import { AssetCache } from "@11ty/eleventy-fetch";
import Airtable from "airtable";

dotenv.config();

const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
}).base(process.env.AIRTABLE_BASE_TOKEN);

/**
 * Fetch data from Airtable and cache it.
 * @param {string} tableName - The name of the Airtable table.
 * @param {string} viewName - The name of the Airtable view.
 * @param {string} cacheId - Unique cache ID for storing data.
 * @param {Array<Object>} sortCriteria - Sorting criteria for Airtable API.
 * @returns {Promise<Array>} Data fetched from Airtable or the cache.
 */
export async function fetchAirtableData({
  tableName,
  viewName = "Grid view",
  cacheId,
  sortCriteria = []
}) {
  const asset = new AssetCache(cacheId);

  if (asset.isCacheValid(process.env.CACHE_DUR)) {
    console.log(`Serving ${tableName} data from the cache…`);
    return asset.getCachedValue();
  }

  console.log(`Refreshing ${tableName} data`);

  return new Promise((resolve, reject) => {
    const allRecords = [];

    base(tableName)
      .select({
        view: viewName,
        sort: sortCriteria
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            allRecords.push({
              id: record._rawJson.id,
              ...record._rawJson.fields
            });
          });
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
