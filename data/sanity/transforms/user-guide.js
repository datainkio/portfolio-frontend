/** @format */

import { serializePortableTextToHtml } from "./portableText.js";
import { slugify } from "../../../eleventy/filters/string.js";

function addHeadingIds(html) {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
    if (/\bid=/.test(attrs)) return match;
    const text = content.replace(/<[^>]+>/g, "");
    return `<h2${attrs} id="${slugify(text)}">${content}</h2>`;
  });
}

export function normalizeUserGuideRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const bodyHtml = addHeadingIds(
      serializePortableTextToHtml(record?.valuePropRichText),
    );

    return {
      ...record,
      bodyHtml,
    };
  });
}
