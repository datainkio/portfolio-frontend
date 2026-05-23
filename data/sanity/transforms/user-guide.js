/** @format */

import { serializePortableTextToHtml } from "./portableText.js";

export function normalizeUserGuideRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const bodyHtml = serializePortableTextToHtml(record?.valuePropRichText);

    return {
      ...record,
      bodyHtml,
    };
  });
}
