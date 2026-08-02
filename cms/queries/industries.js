/** @format */
import groq from 'groq';

export const industriesQuery = {
  id: 'industries',
  description: 'Industry taxonomy for organizations and projects',
  cacheDuration: '1d',
  query: groq`*[_type == "industry"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    icon,
    color,
    weight
  } | order(weight desc, title asc)`,
};
