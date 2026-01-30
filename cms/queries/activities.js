/** @format */
import groq from 'groq';

export const activitiesQuery = {
  id: 'activities',
  description: 'Activities taxonomy for project classification',
  cacheDuration: '1d',
  query: groq`*[_type == "activity"]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    icon,
    color,
    weight,
    featured
  } | order(featured desc, weight desc, title asc)`,
};
