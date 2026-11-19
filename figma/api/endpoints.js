export const ENDPOINTS = {
  pages: (id) => `/files/${id}?depth=1`,
  nodes: (id, nodeIds) => `/files/${id}/nodes?ids=${nodeIds}`,
  images: (id, imageIds) => `/images/${id}?ids=${imageIds}`,
};
