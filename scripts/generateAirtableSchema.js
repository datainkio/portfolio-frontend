/** @format */

/**
 * CMS Schema Generator (deprecated)
 *
 * The CMS query registry is the canonical source of truth.
 * See `frontend/data/sanity/queries/` for data contracts.
 */

const message =
  "Deprecated: CMS schema is defined in frontend/data/sanity/queries.";

function generateSchema() {
  return { message };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(message);
}

export default generateSchema;
