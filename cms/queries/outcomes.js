/** @format */
import groq from 'groq';

export const outcomesQuery = {
  id: 'outcomes',
  description: 'Outcomes taxonomy for deliverables',
  cacheDuration: '1d',
  query: groq`*[_type == "outcome"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    category,
    icon,
    weight
  } | order(weight desc, title asc)`,
};
