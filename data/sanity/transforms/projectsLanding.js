/** @format */

import { serializePortableTextToHtml } from "./portableText.js";

export function normalizeProjectsLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const pageBodyHtml = serializePortableTextToHtml(record?.pageBody);

    return {
      ...record,
      pageBodyHtml,
    };
  });
}
