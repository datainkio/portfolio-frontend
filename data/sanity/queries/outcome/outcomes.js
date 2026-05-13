/** @format */
import { makeSkosConceptQuery } from "../taxonomy/skos-concept.js";

export const outcomesQuery = makeSkosConceptQuery({
  id: "outcomes",
  description: "Deliverable concepts for projects",
  schemeIds: ["deliverable", "deliverables", "outcome", "outcomes"],
  schemeTitles: ["Deliverable", "Deliverables", "Outcome", "Outcomes"],
});
