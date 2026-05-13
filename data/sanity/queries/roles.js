/** @format */
import { makeSkosConceptQuery } from "./skos-concept.js";

export const rolesQuery = makeSkosConceptQuery({
  id: "roles",
  description: "Role concepts for project metadata",
  schemeIds: ["role", "roles"],
  schemeTitles: ["Role", "Roles"],
});
