export const projectProjection = `
  _id,
  "title": page.title,
  "url": page.slug.current,
  "image": featuredImage->image.asset->url,
  "description": page.abstract,
  "organizations": organization[]->title,
  "outcomes": outcomes[]->title,
  "activities": activities[]->title,
  "roles": roles[]->title
`;
