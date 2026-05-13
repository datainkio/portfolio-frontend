/** @format */
import { makeSkosConceptQuery } from "./skos-concept.js";

export const activitiesQuery = makeSkosConceptQuery({
  id: "activities",
  description: "Activity concepts for project classification",
  schemeIds: ["activity", "activities"],
  schemeTitles: ["Activity", "Activities"],
});
