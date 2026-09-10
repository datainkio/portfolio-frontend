/** @format */

import { serializePortableTextToHtml } from "./portableText.js";
import { fetchSvgMarkup } from "./award.js";

async function hydrateSocialAccountInlineLogos(socialAccounts = []) {
  if (!Array.isArray(socialAccounts)) {
    return socialAccounts;
  }

  return Promise.all(
    socialAccounts.map(async (account) => {
      const logoUrl = account?.logo?.url;
      const logoInline = await fetchSvgMarkup(logoUrl);

      if (!logoInline) {
        return account;
      }

      return {
        ...account,
        logo: {
          ...account.logo,
          inline: logoInline,
        },
      };
    }),
  );
}

export async function normalizeContactRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return Promise.all(
    records.map(async (record) => {
      const pageBodyHtml = serializePortableTextToHtml(record?.pageBody);
      const socialAccounts = await hydrateSocialAccountInlineLogos(
        record?.socialAccounts,
      );

      return {
        ...record,
        pageBodyHtml,
        socialAccounts,
      };
    }),
  );
}
