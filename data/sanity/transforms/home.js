/** @format */

import { serializePortableTextToHtml } from "./portableText.js";

export function normalizeLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const valuePropBodyHtml = serializePortableTextToHtml(
      record?.valuePropRichText,
    );

    return {
      ...record,
      valuePropBodyHtml,
    };
  });
}
