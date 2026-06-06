/** @format */

/**
 * Factory for skosConcept query objects.
 * Shared by activities, roles, outcomes, and industries queries.
 *
 * @param {object}   options
 * @param {string}   options.id                         Query identifier
 * @param {string}   options.description                Human-readable description
 * @param {string[]} options.schemeIds                  Scheme IDs to match against schemeId field
 * @param {string[]} options.schemeTitles               Scheme titles to match against title field
 * @param {boolean}  [options.topConceptsOnly=false]    Match only topConcepts (skip concepts[])
 * @param {number}   [options.limit]                    Optional GROQ result slice limit
 * @returns {{ id: string, description: string, cacheDuration: string, query: string }}
 */
export function makeSkosConceptQuery({
  id,
  description,
  schemeIds,
  schemeTitles,
  topConceptsOnly = false,
  limit,
}) {
  const ids = schemeIds.map((s) => `"${s}"`).join(", ");
  const titles = schemeTitles.map((s) => `"${s}"`).join(", ");
  const schemeRef = `*[_type == "skosConceptScheme" && (schemeId in [${ids}] || title in [${titles}])]`;

  const memberFilter = topConceptsOnly
    ? `_id in ${schemeRef}[0].topConcepts[]._ref`
    : `(\n      _id in ${schemeRef}[0].topConcepts[]._ref ||\n      _id in ${schemeRef}[0].concepts[]._ref\n    )`;

  const limitSuffix = limit != null ? `[0...${limit}]` : "";

  return {
    id,
    description,
    cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
    query: `*[\n    _type == "skosConcept" &&\n    ${memberFilter}\n  ]{\n    _id,\n    _updatedAt,\n    "title": prefLabel,\n    conceptId,\n    "description": coalesce(definition, scopeNote, "")\n  } | order(title asc)${limitSuffix}`,
  };
}
