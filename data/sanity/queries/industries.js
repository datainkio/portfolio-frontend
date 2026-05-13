/** @format */
import { makeSkosConceptQuery } from "./skos-concept.js";

export const industriesQuery = makeSkosConceptQuery({
  id: "industries",
  description: "Industry concepts for organizations and projects",
  schemeIds: ["industry", "industries"],
  schemeTitles: ["Industry", "Industries"],
  topConceptsOnly: true,
  limit: 5,
});
