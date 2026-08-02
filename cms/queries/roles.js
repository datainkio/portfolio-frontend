/** @format */
import groq from 'groq';

export const rolesQuery = {
  id: 'roles',
  description: 'Roles taxonomy for project metadata',
  cacheDuration: '1d',
  query: groq`*[_type == "role"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    category,
    weight
  } | order(weight desc, title asc)`,
};
